import { SubscriptionPlanPackage } from 'src/subscription-plan-packages/subscription-plan-package.entity';
import { SubscriptionPlan } from './../subscription-plans/subscription-plan.entity';
import { CompanyImageDto } from './dto/company-image.dto';
import { CompanyIdsDto } from './dto/company-ids.dto';
import { CompanyImages } from './company-image.entity';
import { VideoService } from './../company_video/video.service';
import { PhonesService } from './../company_phones/phones.service';
import { Category } from '../categories/category.entity';
import { CreateCompanyMultipleDto } from './dto/create-company-multiple.dto';
import { S3Service } from './../s3-service/s3-service.service';
import { UsersService } from './../users/users.service';
import { CitiesService } from './../cities/cities.service';
import { CountriesService } from './../countries/countries.service';
import { Country } from './../countries/country.entity';
import { City } from './../cities/city.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Repository, getRepository } from 'typeorm';
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from '../auth/models/user.entity';
import { GetCompaniesFilterDto } from './dto/get-companies-filter.dto';
import { BranchesService } from '../branches/branches.service';
import * as moment from 'moment';

@Injectable()
export class CompaniesService {
	constructor(
		@InjectRepository(Company) private readonly companyRepository: Repository<Company>,
		@InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
		private readonly countriesService: CountriesService,
		@InjectRepository(CompanyImages) private readonly companyImagesRepository: Repository<CompanyImages>,

		// private readonly phonesService: PhonesService,
		// private readonly videoService: VideoService,
		@Inject(forwardRef(() => PhonesService)) private readonly phonesService: PhonesService,
		@Inject(forwardRef(() => VideoService)) private readonly videoService: VideoService,
		@Inject(forwardRef(() => CitiesService)) private readonly citiesService: CitiesService,
		@Inject(forwardRef(() => BranchesService)) private readonly branchesService: BranchesService,
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly usersService: UsersService,
		private readonly s3Service: S3Service,
	) { }

	async findAll(filterDto: GetCompaniesFilterDto) {
		const { search, categories, cityId, userId, countryId, country, city, user, branches,limit } = filterDto;

		const query = this.companyRepository.createQueryBuilder('companies')

		if (cityId) {
			query.andWhere('companies.cityId=:cityId', { cityId });
		}
		if (userId) {
			query.andWhere('companies.userId=:userId', { userId })
		}
		if (countryId) {
			query.andWhere('companies.countryId=:countryId', { countryId })
		}
		if (!!country === true) {
			query.leftJoinAndSelect("companies.country", "country")
		}
		if (!!city === true) {
			query.leftJoinAndSelect("companies.city", "city")
		}
		if (!!user === true) {
			query.leftJoinAndSelect("companies.user", "user")
		}
		if (!!branches === true) {
			query.leftJoinAndSelect("companies.branches", "branches")
		}
		query.leftJoinAndSelect("companies.categories", "categories") // companies.categories is name of relation & categories is table name
		query.leftJoinAndSelect("companies.subscriptionPlan", "subscriptionPlan")
		query.leftJoinAndSelect("companies.subscriptionPlanPackage", "subscriptionPlanPackage")

		if (categories?.length) {
			query.andWhere("categories.id IN (:...categoryIds)", { categoryIds: categories })
		}

		if (search) {
			query.andWhere(
				'(LOWER(companies.name_en) LIKE :search OR LOWER(companies.description_en) LIKE :search OR LOWER(companies.description_ar) LIKE :search OR LOWER(companies.name_ar) LIKE :search OR LOWER(categories.name_en) LIKE :search OR LOWER(categories.name_ar) LIKE :search)',
				{ search: `%${search.toLowerCase()}%` },
			);
		}
		if(limit && typeof(Number(limit)) ==='number'){
			query.take(Number(limit))
		}

		query.leftJoinAndSelect("companies.images", "images")
		query.orderBy('companies.updatedAt', 'DESC')
		try {
			return await query.getMany();
		} catch (e) {

			throw new NotFoundException('thare are no companies found');
		}
	}
	async getUserCompanies(user: User) {
		console.log({user})
		const query = this.companyRepository.createQueryBuilder('companies')
			.orderBy('companies.updatedAt', 'DESC')
			.leftJoinAndSelect("companies.phones", "phones")
			.leftJoinAndSelect("companies.videos", "videos")
			.leftJoinAndSelect("companies.branches", "branches")
			.leftJoinAndSelect("companies.categories", "categories")
			.leftJoinAndSelect("companies.images", "images")
			.where("companies.userId= :userId", { userId: Number(user.id) })
		try {
			const company = await query.getMany();
			if (!company) {
				throw new NotFoundException('company is not found');
			}
			return company
		} catch (e) {
			throw new NotFoundException('company is not found');
		}
	}
	async findOne(id: number, filterDto?: GetCompaniesFilterDto) {

		const query = this.companyRepository.createQueryBuilder('companies')
			.leftJoinAndSelect("companies.phones", "phones")
			.leftJoinAndSelect("companies.videos", "videos")
			.leftJoinAndSelect("companies.country", "country")
			.leftJoinAndSelect("companies.city", "city")
			.leftJoinAndSelect("companies.user", "user")
			.leftJoinAndSelect("companies.branches", "branches")
			.leftJoinAndSelect("companies.categories", "categories")
			.leftJoinAndSelect("companies.images", "images")
			.leftJoinAndSelect("companies.subscriptionPlan", "subscriptionPlan")
			.leftJoinAndSelect("companies.subscriptionPlanPackage", "subscriptionPlanPackage")
			.where("companies.id= :companyId", { companyId: Number(id) })
		// if (filterDto) {
		// 	const { country, city, user, branches } = filterDto;

		// 	if (!!country === true) {
		// 		query.leftJoinAndSelect("companies.country", "country")
		// 	}
		// 	if (!!city === true) {
		// 		query.leftJoinAndSelect("companies.city", "city")
		// 	}
		// 	if (!!user === true) {
		// 		query.leftJoinAndSelect("companies.user", "user")
		// 	}
		// 	if (!!branches === true) {
		// 		query.leftJoinAndSelect("companies.branches", "branches")
		// 	}
		// }
		// query.leftJoinAndSelect("companies.categories", "categories")
		try {
			const company = await query.getOne();
			if (!company) {
				throw new NotFoundException('company is not found');
			}
			return company
		} catch (e) {
			throw new NotFoundException('company is not found');
		}
	}

	async create(createCompanyDto: CreateCompanyDto): Promise<any> {
		const { categories: categoryIds = [], images = [], branches = [], phones = [], videos = [], logoFile, bannerFile, countryId, cityId, userId, name_en, name_ar, standard_phone, website, email, description_en, description_ar, street_en, street_ar, district_en, district_ar, building_no, post_code, degree, hotline, facebook, twitter,latitude,longitude, linkedin, whatsapp, snapchat, instagram, agent_name, commercial_reg,subscriptionPlanId=1, subscriptionPlanPackageId,verified } = createCompanyDto;

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
		let banner;
		let banner_key;
		if (bannerFile) {
			const { Location, Key } = await this.s3Service.s3UploadFile(bannerFile)
			banner = Location
			banner_key = Key
		}


		let categoriesData = [];
		if (categoryIds.length) {
			categoriesData = await this.categoryRepository.createQueryBuilder("categories")
				.where("categories.id IN (:...categoryIds)", { categoryIds })
				.getMany();
		}

	
		let plan;
		let packageExpiration;
		let planId;
		if (subscriptionPlanId!=1 && subscriptionPlanPackageId === undefined) {
			throw new BadRequestException('Please Provide Right Subscription Plan Credentials')
		} else if (subscriptionPlanId && subscriptionPlanPackageId) {
			// get plan
			const subscriptionPlan = await getRepository(SubscriptionPlan).findOne({ package_id: Number(subscriptionPlanId) })

			if (!subscriptionPlan) throw new BadRequestException('Please Provide Right Subscription Plan Credentials');
			planId=subscriptionPlan.id;
			plan = { name_en: subscriptionPlan.name_en, name_ar: subscriptionPlan.name_ar, status: subscriptionPlan.status };
			// get package
			const subscriptionPlanPackage = await getRepository(SubscriptionPlanPackage).findOne({ id: Number(subscriptionPlanPackageId) });
			if (!subscriptionPlanPackage) throw new BadRequestException('Please Provide Right Subscription Plan Credentials');
			plan = plan;
			packageExpiration = moment().add(Number(subscriptionPlanPackage.duration), 'days').toISOString();
			// .add(Number(subscriptionPlanPackage.duration), 'days')
		}else{
			// if(not provide plan and packagePlanId
			const subscriptionPlan = await getRepository(SubscriptionPlan).findOneOrFail({ package_id: 1 })
			planId=subscriptionPlan.id;
			plan = { name_en: subscriptionPlan.name_en, name_ar: subscriptionPlan.name_ar, status: subscriptionPlan.status }
			packageExpiration = moment().add(30, 'days').toISOString();
		}
		const companyVerified:boolean = verified ? verified==='true' : user.role !== 'USER'?true:false;
		// creating company
		const company = this.companyRepository.create({ countryId, cityId, userId, name_en, name_ar, standard_phone, website, email, description_en, description_ar ,latitude,longitude, street_en, street_ar, district_en, district_ar, building_no, post_code, degree, hotline, categories: categoriesData, logo, logo_key, banner, banner_key, facebook, twitter, linkedin, whatsapp, snapchat, instagram, agent_name, commercial_reg,
			 subscriptionPlanId: planId,
			 plan,
			 packageExpiration,
			 subscriptionPlanPackageId:subscriptionPlanPackageId ? Number(subscriptionPlanPackageId):null,
			verified: companyVerified,
		})
		//end creating company

		try {
			const createdCompany = await this.companyRepository.save(company);
			if (phones.length) {
				const createdPhones = await this.phonesService.createCompanyPhones(phones, createdCompany.id)
			}
			if (branches.length) {
				const createdBranches = await this.branchesService.createCompanyBranches(branches, createdCompany.id, userId)
			}
			if (videos.length) {
				const createdPhones = await this.videoService.createCompanyVideos(videos, createdCompany.id)
			}
			if (images.length) {
				const imagesUploaded = await Promise.all(images.map((i) => this.s3Service.s3UploadFile(i)));
				const savedImages = await Promise.all(imagesUploaded.map(({ Location: image, Key: image_key }) => {
					return this.companyImagesRepository.save({ image, image_key, companyId: createdCompany.id });
				}))
			}
		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('Company Name or Email Already Exists');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
			}
		}
		return company;
	}
	// create multiple
	async createMultiple(createCompanyMultipleDto: CreateCompanyMultipleDto): Promise<any> {
		const { data, countryId, cityId } = createCompanyMultipleDto;
		const country = await this.countriesService.findOne(countryId);
		if (!country) {
			throw new NotFoundException("country not found")
		}
		const city = await this.citiesService.findOne(cityId);
		if (!city) {
			throw new NotFoundException("city not found")
		}
		const subscriptionPlan = await getRepository(SubscriptionPlan).findOne({ package_id: 1 })
		if (!subscriptionPlan) throw new BadRequestException('Please Provide Right Subscription Plan Credentials');
		const plan = { name_en: subscriptionPlan.name_en, name_ar: subscriptionPlan.name_ar, status: subscriptionPlan.status }

		let mappedData = await Promise.all(data.map(async company => {
			let categoriesData = [];
			if (company.categories && company.categories.length) {
				categoriesData = await this.categoryRepository.createQueryBuilder("categories")
					.where("categories.id IN (:...categoryIds)", { categoryIds: company.categories })
					.getMany();
			}
			return { ...company, countryId, cityId, categories: categoriesData, subscriptionPlanId: 1, plan,verified:true }
		}))

		try {
			return await this.companyRepository.save(mappedData, { chunk: 4 });
		} catch (err) {
			throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
		}
	}


	async update(updateCompanyDto: UpdateCompanyDto, id: number) {
		const { categories: categoryIds = [], logoFile, bannerFile, countryId, cityId, userId, subscriptionPlanId=1, subscriptionPlanPackageId, verified,status, ...RestData } = updateCompanyDto;
		const companyData: any = RestData;
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
		const getCompany = await this.companyRepository.findOne(id);
		if (!getCompany) {
			throw new NotFoundException("company not found")
		}
		if (verified) {
			getCompany.verified = verified === "true" ? true : false
		}
		if(status){
			getCompany.status = status === "true" ? true : false
		}
		if (logoFile) {
			if (getCompany.logo_key) {
				const { Location, Key } = await this.s3Service.s3Replace(getCompany.logo_key, logoFile)
				const logo = Location
				const logo_key = Key
				companyData.logo = logo;
				companyData.logo_key = logo_key;
				// await this.s3Service.s3Update(getCompany.logo_key, logoFile)
			} else {
				const { Location, Key } = await this.s3Service.s3UploadFile(logoFile)
				const logo = Location
				const logo_key = Key
				companyData.logo = logo;
				companyData.logo_key = logo_key;
			}
		}
		if (bannerFile) {
			if (getCompany.banner_key) {
				const { Location, Key } = await this.s3Service.s3Replace(getCompany.banner_key, bannerFile)
				const banner = Location
				const banner_key = Key
				companyData.banner = banner;
				companyData.banner_key = banner_key;
				// await this.s3Service.s3Update(getCompany.banner_key, bannerFile)
			} else {
				const { Location, Key } = await this.s3Service.s3UploadFile(bannerFile)
				const banner = Location
				const banner_key = Key
				companyData.banner = banner;
				companyData.banner_key = banner_key;
			}
		}
		// subscription Plans IMPLEMENATION ***********/
		if (subscriptionPlanId!=1 && subscriptionPlanPackageId === undefined) {
			throw new BadRequestException('Please Provide Right Subscription Plan Credentials')
		} else if (subscriptionPlanId && subscriptionPlanPackageId) {
			const subscriptionPlan = await getRepository(SubscriptionPlan).findOne({ package_id: Number(subscriptionPlanId) })
			if (!subscriptionPlan) throw new BadRequestException('Please Provide Right Subscription Plan Credentials');
			console.log({ subscriptionPlan })
			const plan = { name_en: subscriptionPlan.name_en, name_ar: subscriptionPlan.name_ar, status: subscriptionPlan.status };
			const subscriptionPlanPackage = await getRepository(SubscriptionPlanPackage).findOne({ id: Number(subscriptionPlanPackageId) });
			if (!subscriptionPlanPackage) throw new BadRequestException('Please Provide Right Subscription Plan Credentials');
			companyData.subscriptionPlanId = Number(subscriptionPlanId);
			companyData.subscriptionPlanPackageId = subscriptionPlanPackageId;
			companyData.plan = plan;
			companyData.packageExpiration = moment().add(Number(subscriptionPlanPackage.duration), 'days').toISOString();
			// .add(Number(subscriptionPlanPackage.duration), 'days')
		}
		let categoriesData = [];
		if (categoryIds.length) {
			categoriesData = await this.categoryRepository.createQueryBuilder("categories")
				.where("categories.id IN (:...categoryIds)", { categoryIds: categoryIds })
				.getMany();
			const result = await this.companyRepository.save({ ...getCompany, ...companyData, categories: categoriesData });
			return result

		} else {

			const result = await this.companyRepository.save({ ...getCompany, ...companyData });
			return result
		}


	}

	async deleteCat(id: number, user: User) {
		const company = await this.companyRepository.findOne(id, { relations: ['categories'] })
		if (!company) throw new NotFoundException('company not found')
		company.categories = []
		await this.companyRepository.save(company)
		try {

			const result = await this.companyRepository.delete(id)
			if (result.affected === 0) { // affected === 0 means that no rows were found
				throw new NotFoundException('company was not deleted');
			} else {
				return true;
			}
		} catch (err) {
			console.log(err)
		}

	}
	async increaseCompanyViews(id: number) {
		const company = await this.companyRepository.findOne(id);
		if (!company) {
			throw new NotFoundException('company Not found')
		}
		try {
			const result = await this.companyRepository.update({ id }, { views: company.views + 1 });
			if (result.affected === 0) { // affected === 0 means that no rows were found
				throw new NotFoundException('Setting can not updated');
			} else {
				return 'success';
			}
		} catch (e) {
			throw new NotFoundException("The company can not update : " + e)
		}
	}

	async addFavoriteCompany(id: number, user: User) {

		const company = await this.companyRepository.findOne(id)
		if (!company) {
			throw new NotFoundException('company not found')
		}
		try {
			user.addFavoriteCompany(company);
			const userUpdated = await this.userRepository.save(user);
			return userUpdated;

		} catch (err) {
			console.log(err)
			throw new InternalServerErrorException();
		}

	}
	async removeFavoriteCompany(id: number, user: User) {
		const company = await this.companyRepository.findOne(id)
		if (!company) {
			throw new NotFoundException('company not found')
		}
		try {
			user.removeFavoriteCompany(company);
			const userUpdated = await this.userRepository.save(user);
			return userUpdated;

		} catch (err) {
			console.log(err)
			throw new InternalServerErrorException();
		}
	}



	async addCompanyImages(companyId: number, companyImageDto: CompanyImageDto) {
		const { images = [] } = companyImageDto;
		let company;
		company = await this.companyRepository.findOne(companyId)
		console.log({ company })
		if (!company) {
			throw new NotFoundException('company not found')
		}
		if (images.length) {
			try {
				const imagesUploaded = await Promise.all(images.map((i) => this.s3Service.s3UploadFile(i)));
				const savedImages = await Promise.all(imagesUploaded.map(({ Location: image, Key: image_key }) => {
					return this.companyImagesRepository.save({ image, image_key, companyId: companyId });
				}))
				return await this.companyRepository.findOne(companyId, { relations: ['images'] });
			}
			catch (err) {
				console.log({ err })
				throw new InternalServerErrorException()
			}
		} else {
			throw new BadRequestException('Please Add Images')
		}
	}
	async removeCompanyImages(id: number, companyIdsDto: CompanyIdsDto) {
		const { imageIds } = companyIdsDto;
		const company = await this.companyRepository.findOne(id)
		if (!company) {
			throw new NotFoundException('company not found')
		}
		const imagesData = await this.companyImagesRepository.createQueryBuilder("company_images")
			.where("company_images.id IN (:...imageIds)", { imageIds })
			.andWhere("company_images.companyId = :companyId", { companyId: id })
			.getMany();

		if (!imagesData.length) {
			throw new NotFoundException('No images Found to be deleted For This company')
		}
		try {
			const deletedImages = await this.companyImagesRepository.remove(imagesData);
			return deletedImages;
		} catch (err) {
			console.log(err)
			throw new BadRequestException();
		}
	}
	async getCompanyImages(id: number,) {
		const company = await this.companyRepository.findOne(id)
		if (!company) {
			throw new NotFoundException('company not found')
		}
		try {
			const images = await this.companyImagesRepository.find({ companyId: id });
			return images;

		} catch (err) {
			console.log(err)
			throw new InternalServerErrorException();
		}
	}
}
