import { NestjsFormDataModule } from 'nestjs-form-data';
import { Country } from '../countries/country.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from '../countries/countries.module';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City } from './city.entity';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
		TypeOrmModule.forFeature([City]),
		CountriesModule,
    forwardRef(() => AppModule),
		NestjsFormDataModule
		// TypeOrmModule.forFeature([Country])
    // forwardRef(() => CountriesModule),
  ],
  controllers: [CitiesController],
  providers: [CitiesService],
	exports:[CitiesService]
})
export class CitiesModule { }
