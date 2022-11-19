import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { PasswordModule } from './password/password.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { CategoriesModule } from './categories/categories.module';
import { CountriesModule } from './countries/countries.module';
import { CitiesModule } from './cities/cities.module';
import { CompaniesModule } from './companies/companies.module';
import { S3Service } from './s3-service/s3-service.service';
import { UsersModule } from './users/users.module';
import { BranchesModule } from './branches/branches.module';
import { PhonesModule } from './company_phones/phones.module';
import { VideoModule } from './company_video/video.module';
import { OffersModule } from './offers/offers.module';
import { OfferVideosModule } from './offer-videos/offer-videos.module';
import { SettingsModule } from './settings/settings.module';
import { TestimonialModule } from './testimonials/testimonial.module';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';
import { RequestDirectoryModule } from './request-directory/request-directory.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { DirectoryModule } from './directories/directory.module';
import { SubscriptionPlansModule } from './subscription-plans/subscription-plans.module';
import { SubscriptionPlanPackagesModule } from './subscription-plan-packages/subscription-plan-packages.module';
import { PagesModule } from './pages/pages.module';


@Module({
  imports: [
		NestjsFormDataModule,
		ConfigModule.forRoot({ 
			isGlobal: true,
			envFilePath:[`.env.${process.env.STAGE}`]
		}),
		ScheduleModule.forRoot(),
		TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    PasswordModule,
    MailModule,
    CategoriesModule,
    CountriesModule,
    CitiesModule,
    CompaniesModule,
    UsersModule,
    OffersModule,
    BranchesModule,
    PhonesModule,
    OfferVideosModule,
    VideoModule,
    SettingsModule,
    TestimonialModule,
    PrivacyPolicyModule,
    RequestDirectoryModule,
    DirectoryModule,
    SubscriptionPlansModule,
    SubscriptionPlanPackagesModule,
    PagesModule
  ],
  exports: [S3Service],
  controllers: [AppController],
  providers: [AppService, S3Service],
})
export class AppModule { }
