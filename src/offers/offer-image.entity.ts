import { Offer } from './offer.entity';

import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('offer_images')
export class OfferImages{
	@PrimaryGeneratedColumn()
	id: number

	@Column({nullable:true})
	image: string;

	@Column({nullable:true})
	image_key: string;

	@ManyToOne(() => Offer, offer => offer.images, { onDelete: 'CASCADE', eager: false })
	offer: Offer | number;
	@Column()
	offerId: number
	

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })   
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })   
	updatedAt: Date;

}