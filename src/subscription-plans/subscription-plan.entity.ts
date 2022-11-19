import { SubscriptionPlanPackage } from './../subscription-plan-packages/subscription-plan-package.entity';
import { Offer } from './../offers/offer.entity';
import { Company } from '../companies/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm";


@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name_en: string

  @Column()
  name_ar: string
  @Column({nullable:true})
  package_id: number

  @Column({ default: true })
  status: boolean;



  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @OneToMany(() => Company, company => company.subscriptionPlan, { eager: false })
  // @JoinTable({ name: 'company_categories' })
  companies: Company[]

  @OneToMany(() => SubscriptionPlanPackage, spp => spp.subscriptionPlan, { eager: true })
  // @JoinTable({ name: 'company_categories' })
  subscriptionPlanPackages: SubscriptionPlanPackage[]



}