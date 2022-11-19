import { CountryIdsDto } from './dto/country-ids.dto';
import { Roles } from './../auth/roles.enum';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Body, Controller, Delete, Query, Get, Param, Post, Put, UseGuards, UseInterceptors, ValidationPipe, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from '../auth/user.decorator';
import { User } from '../auth/models/user.entity';
import { CountriesService } from './countries.service';
import { CountriesDto } from './dto/countries.dto';
import { UpdateCountriesDto } from './dto/updateCountries.dto';
import { RolesMeta } from '../auth/roles.decorator';
import { GetCountriesFilterDto } from './dto/countryFilter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { CountryImageDto } from './dto/country-image.dto';

@Controller('countries')

export class CountriesController {

	constructor(private countriesService: CountriesService) { }

	// get all countries 
	@Get()
	async findAll(@Query() filterDto: GetCountriesFilterDto): Promise<any> {
		return this.countriesService.findAll(filterDto);
	}

	@Get('/:id')
	async findOne(@Param('id') id: number): Promise<any> {
		return this.countriesService.findOne(id);
	}

	@Post()
	@RolesMeta(Roles.ADMIN)
	@UseGuards(AuthGuard('jwt'),RolesGuard)
	@FormDataRequest()
	// @UseInterceptors(FileInterceptor('flag'))
	async create(@Body(ValidationPipe) countries: CountriesDto): Promise<any> {
		return this.countriesService.create(countries);
	}

	@Put('/:id')
	@RolesMeta(Roles.ADMIN)
	@UseGuards(AuthGuard('jwt'),RolesGuard)
	@FormDataRequest()
	async update(@Body(ValidationPipe) countries: UpdateCountriesDto, @Param('id') id: number): Promise<any> {
		return this.countriesService.update(countries, id);
	}
	@Put('/:countryId/add-images')
	@RolesMeta(Roles.ADMIN,  Roles.SUPERVISOR)
	@UseGuards(RolesGuard)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@FormDataRequest()
	async addCountryImages(@Param('countryId') countryId: number, @Body(ValidationPipe) countryImageDto: CountryImageDto): Promise<any> {
		return this.countriesService.addCountryImages(countryId, countryImageDto);
	}
	@Get('/:id/get-images')
	async getCountryImages(@Param('id') id: number,): Promise<any> {
		return this.countriesService.getCountryImages(id);
	}
	@Delete('/:id/remove-images')
	@RolesMeta(Roles.ADMIN, Roles.SUPERVISOR)
	@UseGuards(RolesGuard)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async removeCountryImages(@Param('id') id: number, @Body(ValidationPipe) countryIdsDto:CountryIdsDto): Promise<any> {
		return this.countriesService.removeCountryImages(id, countryIdsDto);
	}



}
