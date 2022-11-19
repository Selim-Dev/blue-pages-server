import { SubscriptionPlanCronService } from './subscription-plan-cron.service';
import { CompanyImages } from './company-image.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Video } from './../company_video/video.entity';
import { Phone } from './../company_phones/phone.entity';
import { VideoModule } from './../company_video/video.module';
import { PhonesModule } from './../company_phones/phones.module';
import { Category } from '../categories/category.entity';
import { User } from './../auth/models/user.entity';
import { UsersModule } from './../users/users.module';
import { AppModule } from './../app.module';
import { Country } from './../countries/country.entity';
import { City } from './../cities/city.entity';
import { CountriesModule } from './../countries/countries.module';
import { CitiesModule } from './../cities/cities.module';
import { Company } from './company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { BranchesModule } from '../branches/branches.module';

@Module({
	imports: [TypeOrmModule.forFeature([Company, Category,User,CompanyImages]),
	forwardRef(() => CountriesModule),
	forwardRef(() => CitiesModule),
	forwardRef(() => UsersModule),
	forwardRef(() => PhonesModule),
	forwardRef(() => VideoModule),
	forwardRef(() => AppModule),
	forwardRef(() => BranchesModule),
	NestjsFormDataModule,
	],
	exports: [CompaniesService],

	controllers: [CompaniesController],
	providers: [CompaniesService,SubscriptionPlanCronService]
})
export class CompaniesModule { }
