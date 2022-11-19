import { RolesMeta } from './../auth/roles.decorator';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, SetMetadata, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from '../auth/user.decorator';
import { User } from '../auth/models/user.entity';
import { CityDto } from './dto/city.dto';
import { UpdateCityDto } from './dto/updateCity.dto';
import { Roles } from '../auth/roles.enum';
import { GetCitiesFilterDto } from './dto/get-city-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('cities')

@UseGuards(AuthGuard('jwt'))

export class CitiesController {

  constructor(private cityService: CitiesService) { }

  // get all city 
  @Get()
  @RolesMeta(Roles.ADMIN, Roles.USER)
  @UseGuards(RolesGuard)
  async findAll(@Query() filterDto: GetCitiesFilterDto): Promise<any> {
    return this.cityService.findCities(filterDto);
  }

  @Get('/:id')
  @RolesMeta(Roles.ADMIN, Roles.USER)
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: number): Promise<any> {
    return this.cityService.findOne( id);
		
  }

  @Post()
  @RolesMeta(Roles.ADMIN)
  @UseGuards(RolesGuard)
	@FormDataRequest()
  async create(@Body(ValidationPipe) city: CityDto): Promise<any> {
    return this.cityService.create(city);
  }

  @Put('/:id')
  @RolesMeta(Roles.ADMIN)
  @UseGuards(RolesGuard)
	@FormDataRequest()
  async update(@Body(ValidationPipe) city: UpdateCityDto, @Param('id') id: number,): Promise<any> {
    // console.log(file, "kkkkkk", city, id);
    return this.cityService.update(city, id);
  }

  @Delete('/:id')
  @RolesMeta(Roles.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: number): Promise<any> {
    return this.cityService.delete(id)
  }


}
