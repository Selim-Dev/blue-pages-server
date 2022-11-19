import { ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/models/user.entity';
import { UpdateDirectoryDto } from './dto/updateDirectory.dto';
import { Repository } from 'typeorm';
import { DirectoryDto } from './dto/directory.dto';
import { Directory } from './directory.entity';
import { FilterDirectoryDto } from './dto/filter.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { CitiesService } from 'src/cities/cities.service';
import { S3Service } from 'src/s3-service/s3-service.service';
import { AppModule } from 'src/app.module';


@Injectable()
export class DirectoryService {
	constructor(@InjectRepository(Directory)
	private readonly directoryRepository: Repository<Directory>,
		@Inject(forwardRef(() => CitiesService)) private readonly citiesService: CitiesService,
		private readonly s3Service: S3Service,

	) { }


	async findAll(filterDirectoryDto: FilterDirectoryDto) {
		const { year, cityId } = filterDirectoryDto
		const query = this.directoryRepository.createQueryBuilder('directory')
		if (cityId) {
			query.andWhere('directory.cityId=:cityId', { cityId })
		}
		if (year) {
			query.andWhere('directory.year=:year', { year })
		}
		query.leftJoinAndSelect('directory.city', 'city')
		try {
			return query.getMany();
		} catch (e) {
			throw new NotFoundException('thare is no directory with error')
		}
	}

	async findOne(id: number) {
		try {
			const getDirectory = await this.directoryRepository.findOne(id);
			if (!getDirectory) {
				throw new NotFoundException("Directory Not found City")
			}
			return getDirectory
		} catch (e) {
			throw new NotFoundException('directory not found');
		}
	}

	async create(directoryDto: DirectoryDto): Promise<any> {
		const { pdf, year, cityId } = directoryDto
		const getCity = await this.citiesService.findOne(cityId)

		if (!getCity) {
			throw new NotFoundException("City Not found City")
		}
		const { Location, Key } = await this.s3Service.s3UploadFile(pdf)

		const directory = new Directory()
		directory.year = year
		directory.cityId = cityId
		directory.pdf = Location
		directory.pdf_key = Key

		try {
			return await this.directoryRepository.save(directory);
		} catch (e) {
			await this.s3Service.s3DeleteFile(Key)
			if (e.code === '23505') {
				throw new ConflictException('This City Already Exists');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
			}
		}
	}



	async update(updateDirectoryDto: UpdateDirectoryDto, id: number) {
		const { file, ...directoryData } = updateDirectoryDto

		const getDirectory = await this.directoryRepository.findOne(id);
		if (!getDirectory) {
			throw new NotFoundException("directory not found")
		}

		if (file) {
			if (getDirectory.pdf_key) {
				// console.log({file})
				const { Location, Key } = await this.s3Service.s3Replace(getDirectory.pdf_key, file)
				const pdf = Location
				const image_key = Key
				directoryData.pdf = pdf;
				directoryData.pdf_key = image_key;
				// await this.s3Service.s3Update(getTestimonial.pdf_key, file)
			} else {
				const { Location, Key } = await this.s3Service.s3UploadFile(file)
				const pdf = Location
				const pdf_key = Key
				directoryData.pdf = pdf;
				directoryData.pdf_key = pdf_key;
			}
		}else {
			throw new BadRequestException('please Upload File ');
		}
		try {
			const result = await this.directoryRepository.save({ ...getDirectory, ...directoryData });
			const gitCat = await this.directoryRepository.findOne(id);
			return gitCat;
		} catch (e) {
			throw new InternalServerErrorException('Directory not updated' + e);
		}
	}

	async delete(id: number) {
		const getDirectory = await this.directoryRepository.findOne(id);
		if (!getDirectory) {
			throw new NotFoundException("Directory Not deleted")
		}
		await this.s3Service.s3DeleteFile(getDirectory.pdf_key)
		const result = await this.directoryRepository.delete(id)
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('Directory can not deleted');
		} else {
			return true;
		}
	}

}
