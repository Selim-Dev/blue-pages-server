import { SubscriptionPlanInterface } from './subscription-plan.interface';
import { SubscriptionPlanPackage } from './../subscription-plan-packages/subscription-plan-package.entity';
import { SubscriptionPlan } from './../subscription-plans/subscription-plan.entity';
import { Plans } from './plans.enum';
import { OfferImages } from './../offers/offer-image.entity';
import { CompanyImages } from './company-image.entity';
import { UserFavoriteCompany } from './../users/user-company.entity';
import { Offer } from './../offers/offer.entity';
import { Category } from '../categories/category.entity';
import { Branch } from './../branches/branches.entity';
import { City } from './../cities/city.entity';
import { Country } from './../countries/country.entity';
import { User } from '../auth/models/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Phone } from '../company_phones/phone.entity';
import { Video } from '../company_video/video.entity';


@Entity('company')
export class Company {
	@PrimaryGeneratedColumn()
	id: number
	@Column()
	name_en: string
	@Column()
	name_ar: string
	@Column({ nullable: true })
	email: string
	// @Column({
  //   type: "enum",
  //   enum: Plans,
  //   default: Plans.FREE
  // })
  // plan: Plans
	@Column()
	standard_phone: string
	@Column({ nullable: true })
	website: string
	@Column({ nullable: true })
	post_code: string
	@Column({ default: false })
	verified: boolean
	@Column({ nullable: true })
	degree: string
	@Column({ nullable: true })
	logo: string
	@Column({ nullable: true })
	logo_key: string
	@Column({ nullable: true })
	banner: string
	@Column({ nullable: true })
	banner_key: string
	@Column({ nullable: true })
	latitude: string
	@Column({ nullable: true })
	longitude: string
	@Column({ nullable: true })
	facebook: string
	@Column({ nullable: true })
	twitter: string
	@Column({ nullable: true })
	linkedin: string
	@Column({ nullable: true })
	whatsapp: string
	@Column({ nullable: true })
	snapchat: string
	@Column({ nullable: true })
	instagram: string
	@Column({ nullable: true })
	youtube_video: string
	@Column({ nullable: true })
	agent_name: string
	@Column({ default: false })
	paid_offers_status: boolean
	@Column({ nullable: true })
	hotline: string
	@Column({ nullable: true })
	building_no: string
	@Column({ nullable: true })
	street_ar: string
	@Column({ nullable: true })
	street_en: string
	@Column({ nullable: true })
	description_en: string
	@Column({ nullable: true })
	description_ar: string
	@Column({ nullable: true })
	district_en: string
	@Column({ nullable: true })
	district_ar: string
	@Column({ nullable: true })
	commercial_reg: string
	@Column({ default: 0 })
	views: number
	@ManyToOne(() => User, user => user.companies, { onDelete: 'CASCADE', eager: false })
	@JoinColumn()
	user: User | number;
	@Column({ nullable: true })
	userId: number
	@ManyToOne(() => SubscriptionPlan, subscriptionPlan => subscriptionPlan.companies, { onDelete: 'SET NULL', eager: false })
	subscriptionPlan: SubscriptionPlan | number;
	@Column({ nullable: true })
	subscriptionPlanId: number;
	@ManyToOne(() => SubscriptionPlanPackage, spp => spp.companies, { onDelete: 'SET NULL', eager: false,nullable: true })
	subscriptionPlanPackage: SubscriptionPlanPackage | number;

	@Column({ nullable: true })
	subscriptionPlanPackageId: number;

	@Column({type:'timestamptz',nullable:true})   
	packageExpiration: Date;
	@Column({
    type: 'jsonb',
		nullable:true
  })
  plan: SubscriptionPlanInterface;
	@ManyToOne(() => Country, country => country.companies, { onDelete: 'CASCADE', eager: false })
	country: Country | number;
	@Column({ nullable: true })
	countryId: number
	@ManyToOne(() => City, city => city.companies, { onDelete: 'CASCADE', eager: false })
	city: City | number;

	@Column({ nullable: true })
	cityId: number
	@Column({ default: true })
	status: boolean;
	@OneToMany(
		_type => Branch,
		// task => task.user,
		branch => branch.companyId,
		// eager loading means whenever we get the user we get the tasks with it without manually doing that
		{ eager: false },
	)
	branches: Branch[]
	@OneToMany(
		_type => Phone,
		// task => task.user,
		phone => phone.company,
		// eager loading means whenever we get the user we get the tasks with it without manually doing that
		{ eager: true },
	)
	phones: Phone[]

	@OneToMany(
		_type => Video,
		// task => task.user,
		video => video.company,
		// eager loading means whenever we get the user we get the tasks with it without manually doing that
		{ eager: true },
	)
	videos: Video[]

	@OneToMany(
    _type => Offer,
    offer => offer.company,
    { eager: false },
  )
  offers: Offer[]
	// ,category=>category.companies
	@ManyToMany(()=>Category, { eager: true, cascade: true })
	@JoinTable({name:'company_categories'})
	categories:Category[];

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })   
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })   
	updatedAt: Date;

	@ManyToMany(() => User, user => user.favorite_companies, { eager: false })
  favorite_users: User[]
	// @OneToMany(()=>UserFavoriteCompany,ufc=>ufc.company)
	// userFavoriteCompany:UserFavoriteCompany[]
	@OneToMany(
		_type => CompanyImages,
		company_image => company_image.company,
		{ eager: true }
	)
	images: CompanyImages[]

}