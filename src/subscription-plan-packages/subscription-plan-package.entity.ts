import { SubscriptionPlan } from './../subscription-plans/subscription-plan.entity';
import { Offer } from './../offers/offer.entity';
import { Company } from '../companies/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm";

@Entity('subscription_plan_packages')
export class SubscriptionPlanPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title_en: string;

  @Column()
  title_ar: string;

  @Column()
  duration: number;

  @Column()
  price: number;


  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

	@ManyToOne(() => SubscriptionPlan, subscriptionPlan => subscriptionPlan.subscriptionPlanPackages, { onDelete: 'SET NULL', eager: false })
	subscriptionPlan: SubscriptionPlan | number;

	@Column({ nullable: true })
	subscriptionPlanId: number;

  @OneToMany(() => Company, company => company.subscriptionPlanPackage, { eager: false })
  // @JoinTable({ name: 'company_categories' })
  companies: Company[]

}