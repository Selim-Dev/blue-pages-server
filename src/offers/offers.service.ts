import { OfferIdsDto } from './dto/offer-ids.dto';
import { OfferImageDto } from './dto/offer-image.dto';
import { OfferImages } from './offer-image.entity';
import { OfferVideosService } from './../offer-videos/offer-videos.service';
import { User } from './../auth/models/user.entity';
import { UpdateOfferDto } from './dto/update-offer-dto';
import { GetOffersFilterDto } from './dto/get-offers-filter.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { CreateOfferDto } from './dto/create-offer-dto';
import { S3Service } from 'src/s3-service/s3-service.service';
import { UsersService } from './../users/users.service';
import { CitiesService } from './../cities/cities.service';
import { CountriesService } from './../countries/countries.service';
import { Category } from './../categories/category.entity';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity';
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';


@Injectable()
export class OffersService {
	constructor(
		@InjectRepository(Offer) private readonly offerRepository: Repository<Offer>,
		@InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
		@InjectRepository(OfferImages) private readonly offerImagesRepository: Repository<OfferImages>,
		private readonly companiesService: CompaniesService,
		private readonly countriesService: CountriesService,
		private readonly citiesService: CitiesService,
		@Inject(forwardRef(() => OfferVideosService)) private readonly videoService: OfferVideosService,
		private readonly usersService: UsersService,
		private readonly s3Service: S3Service,
		@InjectRepository(User) private readonly userRepository: Repository<User>,

		// @Inject('MomentWrapper') private momentWrapper: moment.Moment
	) { }

	async findAll(filterDto: GetOffersFilterDto) {
		const { search, categories, companyId, cityId, userId, countryId, country, city, user, company } = filterDto;

		const query = this.offerRepository.createQueryBuilder('offers')

		if (companyId) {
			query.andWhere('offers.companyId=:companyId', { companyId });
		}
		if (cityId) {
			query.andWhere('offers.cityId=:cityId', { cityId });
		}
		if (userId) {
			query.andWhere('offers.userId=:userId', { userId })
		}
		if (countryId) {
			query.andWhere('offers.countryId=:countryId', { countryId })
		}
		if (!!country === true) {
			query.leftJoinAndSelect("offers.country", "country")
		}
		if (!!city === true) {
			query.leftJoinAndSelect("offers.city", "city")
		}
		if (!!user === true) {
			query.leftJoinAndSelect("offers.user", "user")
		}
		if (!!company === true) {
			query.leftJoinAndSelect("offers.company", "company")
		}
		query.leftJoinAndSelect("offers.categories", "categories")
		if (categories?.length) {
			query.andWhere("categories.id IN (:...categoryIds)", { categoryIds: categories })
		}

		if (search) {
			query.andWhere(
				'(LOWER(offers.name_en) LIKE :search OR LOWER(offers.description_en) LIKE :search OR LOWER(offers.description_ar) LIKE :search OR LOWER(offers.name_ar) LIKE :search OR LOWER(categories.name_en) LIKE :search OR LOWER(categories.name_ar) LIKE :search)',
				{ search: `%${search.toLowerCase()}%` },
			);
		}

		query.leftJoinAndSelect("offers.videos", "videos")
		query.leftJoinAndSelect("offers.images", "images")

		try {
			return await query.getMany();
		} catch (e) {

			throw new NotFoundException('thare is no categories');
		}
	}
	async getUserOffers(user: User) {
		const query = this.offerRepository.createQueryBuilder('offers')
			.orderBy('offers.updatedAt', 'DESC')
			.leftJoinAndSelect("offers.videos", "videos")
			.leftJoinAndSelect("offers.categories", "categories")
			.leftJoinAndSelect("offers.images", "images")
			.where("offers.userId= :userId", { userId: Number(user.id) })
		try {
			const offer = await query.getMany();
			if (!offer) {
				throw new NotFoundException('offer is not found');
			}
			return offer
		} catch (e) {
			throw new NotFoundException('offer is not found');
		}
	}
	async findOne(id: number) {
		const query = this.offerRepository.createQueryBuilder('offers')
			.leftJoinAndSelect("offers.company", "company")
			.leftJoinAndSelect("offers.country", "country")
			.leftJoinAndSelect("offers.city", "city")
			.leftJoinAndSelect("offers.user", "user")
			.leftJoinAndSelect("offers.videos", "videos")
			.leftJoinAndSelect("offers.categories", "categories")
			.leftJoinAndSelect("offers.images", "images")
			.where("offers.id= :offerId", { offerId: Number(id) })
		try {
			const offer = await query.getOne();
			if (!offer) {
				throw new NotFoundException('offer is not found');
			}
			return offer
		} catch (e) {
			throw new NotFoundException('offer is not found');
		}
	}


	async create(createOfferDto: CreateOfferDto): Promise<any> {
		const { categories: categoryIds = [],logoFile, images = [], videos = [], companyId, countryId, cityId, userId, name_en, name_ar, description_en, description_ar, address_en, address_ar, on_sale, sale_amount, sale_type, paid, endAt } = createOfferDto;
		console.log({ paid })
		try {
			const company = await this.companiesService.findOne(companyId)
			if (!company) {
				throw new NotFoundException("company not found")
			}
		} catch (e) {
			throw new NotFoundException("company not found")
		}

		const country = await this.countriesService.findOne(countryId)
		if (!country) {
			throw new NotFoundException("country not found")
		}
		const city = await this.citiesService.findOne(cityId)
		if (!city) {
			throw new NotFoundException("city not found")
		}
		const user = await this.usersService.findOne(Number(userId));
		if (!user) {
			throw new NotFoundException("user not found")
		}
		let logo;
		let logo_key;
		if (logoFile) {
			const { Location, Key } = await this.s3Service.s3UploadFile(logoFile)
			logo = Location
			logo_key = Key
		}
		let categoriesData = [];
		if (categoryIds.length) {
			categoriesData = await this.categoryRepository.createQueryBuilder("categories")
				.where("categories.id IN (:...categoryIds)", { categoryIds })
				.getMany();
		}
		const offer = this.offerRepository.create({ companyId, countryId, cityId, userId, name_en, name_ar, description_en, description_ar, address_en, address_ar,logo,logo_key, on_sale: on_sale === 'false' ? false : true, sale_amount, sale_type, paid: paid === "true", endAt: endAt ? endAt : moment().add(1, 'months').toISOString(), categories: categoriesData ,status: user.role !== 'USER'?true:false})
		try {
			const createdOffer = await this.offerRepository.save(offer);
			if (videos.length) {
				const createdPhones = await this.videoService.createOfferVideos(videos, createdOffer.id)
			}
			if (images.length) {
				const imagesUploaded = await Promise.all(images.map((i) => this.s3Service.s3UploadFile(i)));
				const savedImages = await Promise.all(imagesUploaded.map(({ Location: image, Key: image_key }) => {
					return this.offerImagesRepository.save({ image, image_key, offerId: createdOffer.id });
				}))
				console.log({ savedImages })
			}
		} catch (err) {
			console.log(err)
			if (err.code === '23505') {
				throw new ConflictException('This Offer Already Exists');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
			}
		}
		return offer;
	}
	async update(updateOfferDto: UpdateOfferDto, id: number) {
		const { companyId, countryId, cityId, userId } = updateOfferDto
		const { categories: categoryIds = [], logoFile, ...offerData } = updateOfferDto;
		if (companyId) {
			const company = await this.companiesService.findOne(companyId)
			if (!company) {
				throw new NotFoundException("company not found")
			}
		}
		if (countryId) {
			const country = await this.countriesService.findOne(countryId)
			if (!country) {
				throw new NotFoundException("country not found")
			}
		}
		if (cityId) {
			const city = await this.citiesService.findOne(cityId)
			if (!city) {
				throw new NotFoundException("city not found")
			}
		}
		if (userId) {
			const user = await this.usersService.findOne(userId);
			if (!user) {
				throw new NotFoundException("user not found")
			}
		}
		const getOffer = await this.offerRepository.findOne(id);
		if (!getOffer) {
			throw new NotFoundException("offer not found")
		}
		if (logoFile) {
			if (getOffer.logo_key) {
				const { Location, Key } = await this.s3Service.s3Replace(getOffer.logo_key, logoFile)
				const logo = Location
				const logo_key = Key
				offerData.logo = logo;
				offerData.logo_key = logo_key;
				// await this.s3Service.s3Update(getCompany.logo_key, logoFile)
			} else {
				const { Location, Key } = await this.s3Service.s3UploadFile(logoFile)
				const logo = Location
				const logo_key = Key
				offerData.logo = logo;
				offerData.logo_key = logo_key;
			}
		}

		let categoriesData = [];
		if (categoryIds.length) {
			categoriesData = await this.categoryRepository.createQueryBuilder("categories")
				.where("categories.id IN (:...categoryIds)", { categoryIds: categoryIds })
				.getMany();
		}
		if (offerData.status || offerData.paid || offerData.on_sale) {
			// @ts-ignore: Unreachable code error
			offerData.status === 'true' ? offerData.status = true : false
			// @ts-ignore: Unreachable code error
			offerData.paid === 'true' ? offerData.paid = true : false
			// @ts-ignore: Unreachable code error
			offerData.on_sale === 'true' ? offerData.on_sale = true : false
		}
		const result = await this.offerRepository.save({ ...getOffer, ...offerData, categories: categoriesData });
		return result

	}

	async deleteCat(id: number, user: User) {
		const offer = await this.offerRepository.findOne(id, { relations: ['categories'] })
		if (!offer) throw new NotFoundException('offer not found')
		offer.categories = []
		await this.offerRepository.save(offer)
		const result = await this.offerRepository.delete(id)
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('offer was not deleted');
		} else {
			return true;
		}
	}


	async increaseOfferViews(id: number) {
		const offer = await this.offerRepository.findOne(id);

		if (!offer) {
			throw new NotFoundException('Offer Not found')
		}
		try {
			const result = await this.offerRepository.update({ id }, { views: offer.views + 1 });
			if (result.affected === 0) { // affected === 0 means that no rows were found
				throw new NotFoundException('Setting can not updated');
			} else {
				return 'success';
			}
		} catch (e) {
			throw new NotFoundException("The offer can not update : " + e)
		}
	}

	async addFavoriteOffer(id: number, user: User) {

		const offer = await this.offerRepository.findOne(id)
		if (!offer) {
			throw new NotFoundException('offer not found')
		}
		try {
			user.addFavoriteOffer(offer);
			const userUpdated = await this.userRepository.save(user);
			return userUpdated;

		} catch (err) {
			console.log(err)
			throw new InternalServerErrorException();
		}

	}
	async removeFavoriteOffer(id: number, user: User) {
		const offer = await this.offerRepository.findOne(id)
		if (!offer) {
			throw new NotFoundException('offer not found')
		}
		try {
			user.removeFavoriteOffer(offer);
			const userUpdated = await this.userRepository.save(user);
			return userUpdated;

		} catch (err) {
			console.log(err)
			throw new InternalServerErrorException();
		}
	}
	async addOfferImages(offerId: number, offerImageDto: OfferImageDto) {
		const { images = [] } = offerImageDto;
		let offer;
		offer = await this.offerRepository.findOne(offerId)
		console.log({ offer })
		if (!offer) {
			throw new NotFoundException('offer not found')
		}
		if (images.length) {
			try {
				const imagesUploaded = await Promise.all(images.map((i) => this.s3Service.s3UploadFile(i)));
				const savedImages = await Promise.all(imagesUploaded.map(({ Location: image, Key: image_key }) => {
					return this.offerImagesRepository.save({ image, image_key, offerId: offerId });
				}))
				return await this.offerRepository.findOne(offerId, { relations: ['images'] });
			}
			catch (err) {
				console.log({ err })
				throw new InternalServerErrorException()
			}
		} else {
			throw new BadRequestException('Please Add Images')
		}
	}
	async removeOfferImages(id: number, offerIdsDto: OfferIdsDto) {
		const { imageIds } = offerIdsDto;
		const offer = await this.offerRepository.findOne(id)
		if (!offer) {
			throw new NotFoundException('offer not found')
		}
		const imagesData = await this.offerImagesRepository.createQueryBuilder("offer_images")
			.where("offer_images.id IN (:...imageIds)", { imageIds })
			.andWhere("offer_images.offerId = :offerId", { offerId: id })
			.getMany();

		if (!imagesData.length) {
			throw new NotFoundException('No images Found to be deleted For This Offer')
		}
		try {
			const deletedImages = await this.offerImagesRepository.remove(imagesData);
			return deletedImages;
		} catch (err) {
			console.log(err)
			throw new BadRequestException();
		}
	}
	async getOfferImages(id: number,) {
		const offer = await this.offerRepository.findOne(id)
		if (!offer) {
			throw new NotFoundException('offer not found')
		}
		try {
			const images = await this.offerImagesRepository.find({ offerId: id });
			console.log({ images })
			return images;

		} catch (err) {
			console.log(err)
			throw new InternalServerErrorException();
		}
	}
}
