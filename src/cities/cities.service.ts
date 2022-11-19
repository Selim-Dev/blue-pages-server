import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/models/user.entity';
import { CountriesService } from '../countries/countries.service';
import { Country } from '../countries/country.entity';
import { Repository } from 'typeorm';
import { CityDto } from './dto/city.dto';
import { UpdateCityDto } from './dto/updateCity.dto';
import { City } from './city.entity';
import { GetCitiesFilterDto } from './dto/get-city-filter.dto';
import { S3Service } from 'src/s3-service/s3-service.service';
// @Inject(forwardRef(() => Country)) private readonly countryRepository: Repository<Country>,


@Injectable()
export class CitiesService {
    constructor(@InjectRepository(City) private readonly cityRepository: Repository<City>,
        private readonly countriesService: CountriesService,
        private readonly s3Service: S3Service,

    ) { }


    async findCities(filterDto: GetCitiesFilterDto) {
        const { status, countryId } = filterDto;
        // const query = this.cityRepository.query(`select * from table where countryId = $1`, ['param1'])
        const query = this.cityRepository.createQueryBuilder('city')
        if (status) {
            query.andWhere('city.status=:status', { status });
        }
        if (countryId) {
            query.andWhere('city.countryId=:countryId', { countryId })
        }
        try {
            return await query.getMany();
        } catch (e) {
            throw new NotFoundException('thare is no cities');
        }
    }

    async findOne(id: number) {
        try {
            return await this.cityRepository.findOne(id);
        } catch (e) {
            throw new NotFoundException('city is not found');
        }
    }
    ////////////////////////////////////////////////
    async create(cityDto: CityDto): Promise<City> {
			const { name_ar, name_en, institution_name, countryId ,file} = cityDto;
        if (!file) throw new NotFoundException('please add image to city')

				const { Location, Key } = await this.s3Service.s3UploadFile(file)

        const image = Location
        const image_key = Key

        const country = await this.countriesService.findOne(countryId)

        if (!country) throw new NotFoundException('cant found country by country ID')

        const createdCity = this.cityRepository.create({
            name_ar,
            name_en,
            institution_name,
            image,
            image_key,
            country
        })
        try {
            await this.cityRepository.save(createdCity);
            return createdCity
        } catch (err) {
						await this.s3Service.s3DeleteFile(image_key)
            if (err.code === '23505') {
                throw new ConflictException('this city Already Exists');
            } else {
                throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
            }
        }

    }


    async update(updateCityDto: UpdateCityDto, id: number) {
			const { file,...cityData } = updateCityDto
        try {
            const getCity = await this.findOne(id)
            if (!getCity) throw new NotFoundException('Not found city by id');

            if (file) {
								if(getCity.image_key){
									await this.s3Service.s3Update(getCity.image_key, file)
								}else{
									const { Location, Key } = await this.s3Service.s3UploadFile(file)
									const image = Location
									const image_key = Key
									cityData.image = image;
									cityData.image_key = image_key;
								}
            }
            const result = await this.cityRepository.update({ id }, { ...cityData });
            if (result.affected === 0) { // affected === 0 means that no rows were found
                throw new NotFoundException('cities can not deleted');
            } else {
                const gitCat = await this.cityRepository.findOne(id);
                return gitCat;
            }
        } catch (e) {
            throw new NotFoundException("The City can not delete : " + e)
        }
    }

    async delete(id: number) {
        const getCity = await this.findOne(id)
        if (!getCity) throw new NotFoundException('Not found city by id');
        this.s3Service.s3DeleteFile(getCity.image_key)

        const result = await this.cityRepository.delete(id)
        if (result.affected === 0) { // affected === 0 means that no rows were found
            throw new NotFoundException('cities can not deleted');
        } else {
            return true;
        }
    }

}
