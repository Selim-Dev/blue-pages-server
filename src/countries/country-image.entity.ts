import { Country } from './country.entity';

import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('country_images')
export class CountryImages{
	@PrimaryGeneratedColumn()
	id: number

	@Column({nullable:true})
	image: string;

	@Column({nullable:true})
	image_key: string;



	@ManyToOne(() => Country, country => country.images, { onDelete: 'CASCADE', eager: false })
	country: Country | number;
	@Column()
	countryId: number
	

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })   
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })   
	updatedAt: Date;

}