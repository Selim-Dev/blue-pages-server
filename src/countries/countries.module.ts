import { CountryImages } from './country-image.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country } from './country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country,CountryImages]),
    forwardRef(() => AppModule),
		NestjsFormDataModule,
  ],
  controllers: [CountriesController],
  exports: [CountriesService],
  providers: [CountriesService]
})
export class CountriesModule {}
