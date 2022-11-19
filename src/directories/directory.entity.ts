import { RequestDirectory } from './../request-directory/request-directory.entity';
import { User } from '../auth/models/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { Company } from '../companies/company.entity';
import { City } from '../cities/city.entity';

@Entity('directory')
export class Directory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    pdf: string

    @Column()
    pdf_key: string

    @Column({ nullable: true })
    year: string
		
		@OneToMany(
			_type => RequestDirectory,
			request_directory => request_directory.directory,
			{ eager: false },
		)
		request_directory: RequestDirectory[]

    @ManyToOne(() => City, city => city.directory, { onDelete: 'CASCADE', eager: false })
    city: City | number;
    @Column({ unique: true })
    cityId: number


		@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
		createdAt: Date;
	
		@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
		updatedAt: Date;
	
}