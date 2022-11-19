import { User } from './../auth/models/user.entity';
import { OffersCronService } from './offers-cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CompaniesModule } from 'src/companies/companies.module';
import { AppModule } from 'src/app.module';
import { UsersModule } from './../users/users.module';
import { CitiesModule } from './../cities/cities.module';
import { CountriesModule } from './../countries/countries.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './../categories/category.entity';
import { Offer } from './offer.entity';
import { Module, forwardRef } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { OfferVideosModule } from 'src/offer-videos/offer-videos.module';
import * as moment from 'moment';
import { OfferImages } from './offer-image.entity';


@Module({
	imports:[TypeOrmModule.forFeature([Offer,Category,User,OfferImages]),
	CompaniesModule,
	CountriesModule,
	CitiesModule,
	UsersModule,
	forwardRef(() => OfferVideosModule),
	forwardRef(() => AppModule),
	NestjsFormDataModule,
	ScheduleModule.forRoot()
	],
  controllers: [OffersController],
  providers: [
		OffersService,{
		provide: 'MomentWrapper',
		useValue: moment
	},
	OffersCronService
],
	exports:[OffersService]
})
export class OffersModule {}
