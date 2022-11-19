import { Offer } from './../offers/offer.entity';
import { Company } from '../companies/company.entity';
import { Exclude } from "class-transformer";
import { Country } from "../countries/country.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('offer_videos')
export class OfferVideos {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  video: string

  @ManyToOne(() => Offer, offer => offer.videos, { onDelete: 'CASCADE', eager: false })
  offer: Offer | number

  @Column()
  offerId: number
}