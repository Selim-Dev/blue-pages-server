import { Company } from '../companies/company.entity';
import { Exclude } from "class-transformer";
import { Country } from "../countries/country.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('company_phones')
export class Phone {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  phone: string

  @ManyToOne(() => Company, company => company.phones, { onDelete: 'CASCADE', eager: false })
  company: Company | number

  @Column()
  companyId: number
}