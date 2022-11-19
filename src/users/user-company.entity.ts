import { User } from './../auth/models/user.entity';
import { Company } from './../companies/company.entity';

import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { ApiProperty } from '@nestjs/swagger';

@Entity('favorite_companies')
export class UserFavoriteCompany {
  @ApiProperty({ description: 'Primary key ', example: 1 })
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  companyId: number;


  @ApiProperty({
    description: 'The Created at Date',
    example: 'Tue, 20 Sep 2022 22:29:45 GMT'
  })
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

	// @ManyToOne(()=>User,user=>user.userFavoriteCompany,{primary:true,cascade:true})
	// @JoinColumn({name:'userId'})
	// user:User;

	// @ManyToOne(()=>Company,company=>company.userFavoriteCompany,{primary:true,cascade:true})
	// @JoinColumn({name:'companyId'})
	// company:Company;
 

  // @OneToMany(
  //   _type => Company,
  //   // task => task.user,
  //   company => company.userId,
  //   // eager loading means whenever we get the user we get the tasks with it without manually doing that
  //   { eager: false },
  // )
  // companies: Company[]


	// @ManyToMany(()=>Company,company=>company.favorite_users, { eager: true, cascade: true , orphanedRowAction: 'delete'})
	// @JoinTable({name:'user_companies' })
	// favorite_companies:Company[];

	// @ManyToMany(()=>Offer,offer=>offer.favorite_users, { eager: true, cascade: true , orphanedRowAction: 'delete'})
	// @JoinTable({name:'user_offers' })
	// favorite_offers:Offer[];
}