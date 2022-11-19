import { HttpException, HttpStatus, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/models/user.entity';
import { Repository } from 'typeorm';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { Category } from './category.entity';
import { FilterCategoryDto } from './dto/filterCategory.dto';
import { S3Service } from 'src/s3-service/s3-service.service';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    private readonly s3Service: S3Service,
    ) { }


    async findAll(filterCategory: FilterCategoryDto) {
        const { status } = filterCategory
        const query = this.categoryRepository.createQueryBuilder('category')

        if (status) {
            query.andWhere('category.status=:status', { status });
        }
        try {
            return await query.getMany();
        } catch (e) {
            throw new NotFoundException('thare is no categories');
        }
    }

    async findOne(user: User, id: number) {
        try {
            return await this.categoryRepository.findOne(id);
        } catch (e) {
            throw new NotFoundException('category is not found');
        }
    }

    async create(categoryDto: CategoryDto): Promise<CategoryDto> {

        

        const category = new Category()
        const { name_ar, name_en } = categoryDto

        category.name_ar = name_ar
        category.name_en = name_en

        this.categoryRepository.create(category)
        return await this.categoryRepository.save(category);
    }



    async updateCat(category: UpdateCategoryDto, id: number, user: User) {

        const result = await this.categoryRepository.update({ id }, { ...category });
        if (result.affected === 0) { // affected === 0 means that no rows were found
            throw new NotFoundException('categories can not deleted');
        } else {
            const gitCat = await this.categoryRepository.findOne(id);
            return gitCat;
        }
    }

    async deleteCat(id: number, user: User) {
        const category = await this.categoryRepository.findOne({id})

				if (category)
        {
					
            // await this.categoryRepository.save({...category,companies:[]});
            await this.categoryRepository.delete(id);
        }
        else
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        // if (result.affected === 0) { // affected === 0 means that no rows were found
        //     throw new NotFoundException('categories can not deleted');
        // } else {
        //     return true;
        // }
    }
		async increaseCategoryViews(id:number) {
			let result;
				try {
					const category = await this.categoryRepository.findOne(id);
					result = await this.categoryRepository.update({id}, {views:category.views+1});
					if (result.affected === 0) { // affected === 0 means that no rows were found
							throw new NotFoundException('Setting can not updated');
					} else {
							return 'success';
					}
			} catch (e) {
					throw new NotFoundException("The Category can not update : " + e)
			}
    }

}
