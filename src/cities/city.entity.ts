import { Offer } from './../offers/offer.entity';
import { Company } from './../companies/company.entity';
import { Exclude } from "class-transformer";
import { Country } from "../countries/country.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Directory } from '../directories/directory.entity';
import { RequestDirectory } from '../request-directory/request-directory.entity';

@Entity('city')
export class City {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name_en: string

  @Column({ unique: true })
  name_ar: string

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  image_key: string;

  @Column({ nullable: true })
  institution_name: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @ManyToOne(() => Country, country => country.cities, { onDelete: 'CASCADE', eager: false })
  // @ManyToOne(
  // 	_type => Country,
  // 	country => country.cities,
  // 	{ eager: false },
  // ) 
  //   // to exclude user object from the response
  // // @Exclude({ toPlainOnly: true })
  // // @Column()
  country: Country | number;
	@Column({ nullable: true })
	countryId: number
  @OneToMany(
    _type => Company,
    // task => task.user,
    company => company.cityId,
    // eager loading means whenever we get the user we get the tasks with it without manually doing that
    { eager: false },
  )
  companies: Company[]

	@OneToMany(
    _type => Offer,
    offer => offer.city,
    { eager: false },
  )
  offers: Offer[]

  @OneToMany(
    _type => Directory,
    directory => directory.city,
    { eager: false },
  )
  directory: Directory[]

  @OneToMany(
    _type => RequestDirectory,
    request_directory => request_directory.city,
    { eager: false },
  )
  request_directory: RequestDirectory[]
}