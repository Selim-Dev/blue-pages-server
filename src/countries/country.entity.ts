import { Offer } from './../offers/offer.entity';
import { Company } from './../companies/company.entity';
import { City } from "../cities/city.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { CountryImages } from './country-image.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name_en: string;

  @Column({ unique: true })
  name_ar: string;

  @Column()
  code: string;

	@Column({nullable:true})
	title_en: string;
	@Column({nullable:true})
	title_ar: string;
	@Column({nullable:true})
	currency_en: string;
	@Column({nullable:true})
	currency_ar: string;
	@Column({nullable:true})
	subtitle_en: string;
	@Column({nullable:true})
	subtitle_ar: string;

	
  @Column({ default: true })
  status: boolean;

  @Column()
  flag: string

  @Column({ nullable: true })
  flag_key: string

  @OneToMany(
    _type => City,
    city => city.country,
    { eager: true },
  )
  cities: City[]
  
  @OneToMany(
    _type => Company,
    // task => task.user,
    company => company.countryId,
    // eager loading means whenever we get the user we get the tasks with it without manually doing that
    { eager: false },
  )
  companies: Company[]

  @OneToMany(
    _type => Offer,
    offer => offer.country,
    { eager: false },
  )
  offers: Offer[]

	@OneToMany(
		_type => CountryImages,
		country_image => country_image.country,
		{ eager: true }
	)
	images: CountryImages[]
}
