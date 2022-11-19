import { CountryIdsDto } from './dto/country-ids.dto';
import { CountryImageDto } from './dto/country-image.dto';
import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/models/user.entity';
import { UpdateCountriesDto } from './dto/updateCountries.dto';
import { Repository } from 'typeorm';
import { CountriesDto } from './dto/countries.dto';
import { Country } from './country.entity';
import { GetCountriesFilterDto } from './dto/countryFilter.dto';
import { S3Service } from 'src/s3-service/s3-service.service';
import { CountryImages } from './country-image.entity';


@Injectable()
export class CountriesService {
	constructor(@InjectRepository(Country)
	private readonly countriesRepository: Repository<Country>,
		private readonly s3Service: S3Service,
		@InjectRepository(CountryImages) private readonly countryImagesRepository: Repository<CountryImages>,

	) { }


	async findAll(filterDto: GetCountriesFilterDto) {
		const countries = await this.countriesRepository.find();
		try {
			const { status, city } = filterDto;
			const query = this.countriesRepository.createQueryBuilder('countries')
			if (status) {
				query.andWhere('countries.status=:status', { status });
			}
			if (!!city === true) {
				query.leftJoinAndSelect("countries.cities", "city")
			}
			query.leftJoinAndSelect("countries.images", "images")
			return await query.getMany();
		} catch (e) {
			throw new NotFoundException('no countries found');
		}
	}

	async findOne(id: number) {
		try {
			return await this.countriesRepository.findOne(id,{relations:['images']});
		} catch (e) {
			throw new NotFoundException('countries is not found');
		}
	}

	async create(countriesDto: CountriesDto): Promise<any> {
		const { file: flag_img ,images = [], name_ar, name_en, code,title_en,subtitle_en,title_ar,subtitle_ar  } = countriesDto;

		const { Location, Key } = await this.s3Service.s3UploadFile(flag_img)
		const flag = Location
		const flag_key = Key
		console.log({ flag, flag_key })

		const countries = new Country()

		countries.name_ar = name_ar
		countries.name_en = name_en
		countries.code = code
		countries.flag = flag
		countries.flag_key = flag_key;
		countries.title_en = title_en;
		countries.subtitle_en = subtitle_en;
		countries.title_ar = title_ar;
		countries.subtitle_ar = subtitle_ar;
		try {
			const createdCompany = await this.countriesRepository.save(countries);
			if(images.length){
				const imagesUploaded = await Promise.all(images.map((i)=>this.s3Service.s3UploadFile(i)));
				const savedImages = await Promise.all(imagesUploaded.map(({Location:image,Key:image_key})=>{
					return this.countryImagesRepository.save({image,image_key,countryId:createdCompany.id});
				}))
				console.log({savedImages})
			}
			return createdCompany;
		} catch (err) {
			console.log(err)
			await this.s3Service.s3DeleteFile(flag_key)
			if (err.code === '23505') {
				throw new ConflictException('this country Already Exists');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
			}
		}

	}


	// async update(countries: UpdateCountriesDto, id: number, flag) {
	//     const country = await this.findOne(id)
	//     if (!country) throw new NotFoundException("Country Not found")
	//     if (flag) {
	//         const test = await this.s3Service.s3Update(country.flag_key, flag)
	// 				console.log({test})
	//         // countries.flag = Location
	//         // countries.flag_key = Key
	//     }
	//     // const result = await this.countriesRepository.update({ id }, { ...countries });
	//     // if (result.affected === 0) { // affected === 0 means that no rows were found
	//     //     throw new NotFoundException('categories can not deleted');
	//     // } else {
	//     //     const gitCat = await this.countriesRepository.findOne(id);
	//     //     return gitCat;
	//     // }
	// }

	// // async delete(id: number) {
	// //     const result = await this.countriesRepository.delete(id)
	// //     if (result.affected === 0) { // affected === 0 means that no rows were found
	// //         throw new NotFoundException('categories can not deleted');
	// //     } else {
	// //         return true;
	// //     }
	// // }
	async update(updateCountriesDto: UpdateCountriesDto, id: number) {
		const { file, ...countryData } = updateCountriesDto
		const getCountry = await this.countriesRepository.findOne(id);
		if (!getCountry) throw new NotFoundException('Not found country by id');
		if (file) {
			if (getCountry.flag_key) {
				// await this.s3Service.s3Update(getCountry.flag_key, file)
				// const { Location, Key } = await this.s3Service.s3UploadFile(file)
				const { Location, Key } = await this.s3Service.s3Replace(getCountry.flag_key,file)
				const flag = Location
				const flag_key = Key
				countryData.flag = flag;
				countryData.flag_key = flag_key;
			} else {
				const { Location, Key } = await this.s3Service.s3UploadFile(file)
				const flag = Location
				const flag_key = Key
				countryData.flag = flag;
				countryData.flag_key = flag_key;
			}
		}
		try {
			const result = await this.countriesRepository.save( {...getCountry,...countryData });
			return result
		} catch (e) {
			throw new NotFoundException(+ e)
		}
	}



	async addCountryImages(countryId:number, countryImageDto: CountryImageDto) {
		const {images=[]} = countryImageDto;
		let country;
		country = await this.countriesRepository.findOne(countryId)
		console.log({country})
		if(!country){
			throw new NotFoundException('country not found')
		}	
		if(images.length){
			try{
				const imagesUploaded = await Promise.all(images.map((i)=>this.s3Service.s3UploadFile(i)));
				const savedImages = await Promise.all(imagesUploaded.map(({Location:image,Key:image_key})=>{
					return this.countryImagesRepository.save({image,image_key,countryId:countryId});
				}))
				return  await this.countriesRepository.findOne(countryId,{relations:['images']});
			}
			catch(err){
				console.log({err})
				throw new InternalServerErrorException()
			}
		}else{
			throw new BadRequestException('Please Add Images')
		}
	}
	async removeCountryImages(id:number,countryIdsDto:CountryIdsDto) {
		const {imageIds} = countryIdsDto;
		const country = await this.countriesRepository.findOne(id)
		if(!country){
			throw new NotFoundException('country not found')
		}
		const imagesData = await this.countryImagesRepository.createQueryBuilder("country_images")
		.where("country_images.id IN (:...imageIds)", { imageIds })
		.andWhere("country_images.countryId = :countryId", { countryId:id })
		.getMany();

		if(!imagesData.length){
			throw new NotFoundException('No images Found to be deleted For This Country')
		}
		try{
			const deletedImages = await this.countryImagesRepository.remove(imagesData);
			return deletedImages;
		}catch (err){
			console.log(err)
			throw new BadRequestException();
		}
	}
	async getCountryImages(id:number) {
		const country = await this.countriesRepository.findOne(id)
		if(!country){
			throw new NotFoundException('country not found')
		}
		try{
			const images = await this.countryImagesRepository.find({countryId:id});
			console.log({images})
			return images;

		}catch (err){
			console.log(err)
			throw new InternalServerErrorException();
		}
	}
}
