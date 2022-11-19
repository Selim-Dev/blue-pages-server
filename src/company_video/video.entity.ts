import { Company } from '../companies/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";

@Entity('company_videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  video: string

  @ManyToOne(() => Company, company => company.videos, { onDelete: 'CASCADE', eager: false })
  company: Company | number

  @Column()
  companyId: number
}