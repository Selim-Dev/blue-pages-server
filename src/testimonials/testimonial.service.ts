import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestimonialsDto } from './dto/testimonial.dto';
import { Testimonial } from './testimonial.entity';
import { S3Service } from 'src/s3-service/s3-service.service';
import { UpdateTestimonialDto } from './dto/updateTestimonial.dto';


@Injectable()
export class TestimonialService {
    constructor(@InjectRepository(Testimonial)
    private readonly testimonalRepository: Repository<Testimonial>,
        private readonly s3Service: S3Service,
    ) { }


    async findAll() {
			try{
        const getTes = await this.testimonalRepository.find()
        return getTes
			}catch(err){
				throw new InternalServerErrorException('something wrong happened!')
			}

    }

    async findOne(id: number) {
        try {
            return await this.testimonalRepository.findOne(id);
        } catch (e) {
            throw new NotFoundException('testimonal is not found');
        }
    }

    async create(testimonalDto: TestimonialsDto): Promise<any> {
			const { file,name, job, rating, content } = testimonalDto
        if (!file) throw new NotFoundException('please add image to testimonial')

        const { Location, Key } = await this.s3Service.s3UploadFile(file)
        const image = Location
        const image_key = Key

        const testimonal = new Testimonial()

        testimonal.name = name
        testimonal.job = job
        testimonal.rating = rating
        testimonal.content = content
        testimonal.image = image
        testimonal.image_key = image_key
        try {
            this.testimonalRepository.create(testimonal)
            return await this.testimonalRepository.save(testimonal);
        } catch (err) {
            if (err.code === '23505') {
                throw new ConflictException('this testimonial Already Exists');
            } else {
                throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
            }
        }

    }


    async update(updateTestimonialDto: UpdateTestimonialDto, id: number) {
        const getTestimonial = await this.findOne(id)
        if (!getTestimonial) throw new NotFoundException("testimonial Not found")
				const {file,...testimonialData} = updateTestimonialDto
				if (file) {
					if(getTestimonial.image_key){
						// console.log({file})
						const { Location, Key } = await this.s3Service.s3Replace(getTestimonial.image_key,file)
						const image = Location
						const image_key = Key
						testimonialData.image = image;
						testimonialData.image_key = image_key;
						// await this.s3Service.s3Update(getTestimonial.image_key, file)
					}else{
						const { Location, Key } = await this.s3Service.s3UploadFile(file)
						const image = Location
						const image_key = Key
						testimonialData.image = image;
						testimonialData.image_key = image_key;
					}
			}
			try {
        const result = await this.testimonalRepository.save( {...getTestimonial, ...testimonialData });
				return result
			} catch (e) {
				throw new NotFoundException(+ e)
			}
        // if (result.affected === 0) { // affected === 0 means that no rows were found
        //     throw new NotFoundException('Testimonial can not deleted');
        // } else {
        //     const gitCat = await this.testimonalRepository.findOne(id);
        //     return gitCat;
        // }
    }

    async delete(id: number) {
        const result = await this.testimonalRepository.delete(id)
        if (result.affected === 0) { // affected === 0 means that no rows were found
            throw new NotFoundException('Testimonial can not deleted');
        } else {
            return true;
        }
    }

}
