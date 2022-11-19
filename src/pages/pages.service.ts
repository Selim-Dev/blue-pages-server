import { UpdatePageDto } from './dto/update-page.dto';
import { Video } from './../company_video/video.entity';
import { Page } from './page.entity';
import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';

@Injectable()
export class PagesService {
	constructor(@InjectRepository(Page) private readonly pagesRepository: Repository<Page>,
		//  private readonly pagesService: PagesService
	) { }



	async findAll() {
		const query = this.pagesRepository.createQueryBuilder('pages')
		try {
			return query.getMany();
		} catch (e) {
			throw new InternalServerErrorException('something went wrong')
		}
	}

	async findOne(id: number) {
		try {
			const page = await this.pagesRepository.findOne(id)
			if(!page) 	throw new NotFoundException('page is not found');
			return  page;
		} catch (e) {
			throw new NotFoundException('page is not found');
		}
	}

	async create(createPageDto: CreatePageDto): Promise<any> {
		try {
			const { title_en,title_ar, slug,content } = createPageDto
			const page = this.pagesRepository.create({ title_en,title_ar, slug,content })
			console.log({page})
			return await this.pagesRepository.save(page);
		} catch (err) {
			throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
		}
	}
	

	async update( updatePageDto: UpdatePageDto, id: number,) {

		const result = await this.pagesRepository.update({ id }, { ...updatePageDto });
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('page not edited Successfully');
		} else {
			const gitCat = await this.pagesRepository.findOne(id);
			return gitCat;
		}
	}

	async delete(id: number,) {

		const result = await this.pagesRepository.delete(id)
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('page not deleted');
		} else {
			return true;
		}
	}

}
