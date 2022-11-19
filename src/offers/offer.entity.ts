import { OfferVideos } from './../offer-videos/offer-video.entity';
import { Category } from './../categories/category.entity';
import { Company } from './../companies/company.entity';
import { User } from './../auth/models/user.entity';
import { City } from './../cities/city.entity';
import { Country } from './../countries/country.entity';
import { SaleTypes } from './sale-type.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OfferImages } from './offer-image.entity';

@Entity()
export class Offer{
	@PrimaryGeneratedColumn()
	id: number
	@Column()
	name_en: string
	@Column()
	name_ar: string

	@Column({nullable:true})
	address_en: string
	@Column({nullable:true})
	address_ar: string

	@Column({ nullable: true })
	description_en: string

	@Column({ nullable: true })
	description_ar: string;

	@Column({ default: false })
	on_sale: boolean;

	@Column({default:0})
	sale_amount: number;

	@Column({default:0})
	price: number;
	@Column({default:0})
	price_after_sale: number;



  @Column({
    type: "enum",
    enum: SaleTypes,
    default: SaleTypes.PERCENTAGE
  })
  sale_type: SaleTypes

	@Column({ default: false })
	paid: boolean;

	@Column({ default: true })
	status: boolean;
	@Column({ nullable: true })
	logo: string
	@Column({ nullable: true })
	logo_key: string

	@ManyToOne(() => User, user => user.offers, { onDelete: 'CASCADE', eager: false })
	@JoinColumn()
	user: User | number;
	@Column({ nullable: true })
	userId: number
	@ManyToOne(() => Country, country => country.offers, { onDelete: 'CASCADE', eager: false })
	country: Country | number;
	@Column()
	countryId: number
	@ManyToOne(() => City, city => city.offers, { onDelete: 'CASCADE', eager: false })
	city: City | number;
	@Column()
	cityId: number;
	@ManyToOne(() => Company, company => company.offers, { onDelete: 'CASCADE', eager: false, nullable: true  })
	company: Company | number;
	@Column({nullable:true})
	companyId: number;
	@Column({ default: 0 })
	views: number
	@OneToMany(
		_type => OfferVideos,
		// task => task.user,
		video => video.offer,
		// eager loading means whenever we get the user we get the tasks with it without manually doing that
		{ eager: true },
	)
	videos: OfferVideos[]
	// ,category=>category.offers
	@ManyToMany(()=>Category, { eager: true, cascade: true , orphanedRowAction: 'delete'})
	@JoinTable({name:'offer_categories' })
	categories:Category[];

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })   
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })   
	updatedAt: Date;

	@Column({type:'timestamptz',nullable:true})   
	endAt: Date;

	@ManyToMany(() => User, user => user.favorite_offers, { eager: false })
  favorite_users: User[];

	@OneToMany(
		_type => OfferImages,
		offer_image => offer_image.offer,
		{ eager: true }
	)
	images: OfferImages[]
	// removeImages(offerImages:OfferImages[]){
	// 	if(this.images.length){
	// 		const ids = offerImages.map((i)=>i.id)
	// 		this.images = this.images.filter((oi)=>{
	// 			console.log({ImageId:oi.id,ids})
	// 			return !ids.includes(oi.id);
	// 		})
	// 	}
	// }

}