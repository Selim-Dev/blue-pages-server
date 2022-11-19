import { UserFavoriteCompany } from './../../users/user-company.entity';
import { Offer } from '../../offers/offer.entity';
import { Company } from './../../companies/company.entity';
import { Languages } from './../languages.enum';
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Roles } from "../roles.enum";
import { Branch } from '../../branches/branches.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RequestDirectory } from '../../request-directory/request-directory.entity';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @ApiProperty({ description: 'Primary key ', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The name of user',
    example: 'John Doe'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The email of user',
    example: 'user@user.com'
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'The Hashed Password of user',
    example: 'password'
  })
  @Column() //{ select: false }
	@Exclude({ toPlainOnly: true })
  password: string;
	
  @ApiProperty({
    description: 'The Role of user',
    example: 'USER'
  })
  @Column({
    type: "enum",
    enum: Roles,
    default: Roles.USER
  })
  role: Roles

  @ApiProperty({
    description: 'The Created at Date',
    example: 'Tue, 20 Sep 2022 22:29:45 GMT'
  })
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @ApiProperty({
    description: 'The Updated at Date',
    example: 'Tue, 20 Sep 2022 22:29:45 GMT'
  })
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @ApiProperty({
    description: 'The default user language [AR,EN]',
    example: 'AR'
  })
  @Column({
    type: "enum",
    enum: Languages,
    default: Languages.AR
  }) //{ select: false }
  default_language: Languages;
  // @OneToMany(() => City, city => city.country)

  @ApiProperty({
    description: 'The user companies',
    example: 'AR'
  })
  @OneToMany(
    _type => Company,
    // task => task.user,
    company => company.user,
    // eager loading means whenever we get the user we get the tasks with it without manually doing that
    { eager: false },
  )
	@JoinColumn()
  companies: Company[]


  @ApiProperty({
    description: 'The user status',
    example: 'true'
  })
  @Column({ default: true })
  status: boolean;


  @OneToMany(
    _type => Branch,
    // task => task.user,
    branch => branch.userId,
    // eager loading means whenever we get the user we get the tasks with it without manually doing that
    { eager: false },
  )
  branch: Branch[]

  @OneToMany(
    _type => Offer,
    offer => offer.user,
    { eager: false },
  )
  offers: Offer[]

  @ManyToMany(() => Company, company => company.favorite_users, { eager: true, cascade: true, orphanedRowAction: 'delete' })
  @JoinTable({ name: 'user_companies' })
  favorite_companies: Company[];
  addFavoriteCompany(company: Company) {
    if (this.favorite_companies == null) {
      this.favorite_companies = new Array<Company>();
    }
    this.favorite_companies.push(company)
  }
  removeFavoriteCompany(company: Company) {
    if (this.favorite_companies.length) {
      this.favorite_companies = this.favorite_companies.filter((com) => com.id !== company.id)
    }
  }

  @ManyToMany(() => Offer, offer => offer.favorite_users, { eager: true, cascade: true, orphanedRowAction: 'delete' })
  @JoinTable({ name: 'user_offers' })
  favorite_offers: Offer[];
  addFavoriteOffer(offer: Offer) {
    if (this.favorite_offers == null) {
      this.favorite_offers = new Array<Offer>();
    }
    this.favorite_offers.push(offer)
  }
  removeFavoriteOffer(offer: Offer) {
    if (this.favorite_offers.length) {
      this.favorite_offers = this.favorite_offers.filter((o) => o.id !== offer.id)
    }
  }

  @OneToMany(
    _type => RequestDirectory,
    request_directory => request_directory.user,
    { eager: false },
  )
  request_directory: RequestDirectory[]
}