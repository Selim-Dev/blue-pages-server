import { Company } from './company.entity';

import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('company_images')
export class CompanyImages{
	@PrimaryGeneratedColumn()
	id: number

	@Column({nullable:true})
	image: string;

	@Column({nullable:true})
	image_key: string;

	@ManyToOne(() => Company, company => company.images, { onDelete: 'CASCADE', eager: false })
	company: Company | number;
	@Column()
	companyId: number
	

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })   
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })   
	updatedAt: Date;

}