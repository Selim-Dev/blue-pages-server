import { Offer } from './../offers/offer.entity';
import { Company } from '../companies/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name_en: string

  @Column()
  name_ar: string

  @Column({ default: true })
  status: boolean


  @Column({ default: 0 })
  views: number

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  // @ManyToMany(() => Company, company => company.categories, { eager: false })
  // // @JoinTable({ name: 'company_categories' })
  // companies: Company[]

  // @ManyToMany(() => Offer, offer => offer.categories, { eager: false })
  // // @JoinTable({ name: 'offer_categories' })
  // offers: Offer[]

}