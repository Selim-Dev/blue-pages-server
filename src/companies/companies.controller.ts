import { CompanyImageDto } from './dto/company-image.dto';
import { CompanyIdsDto } from './dto/company-ids.dto';
import { CreateCompanyMultipleDto } from './dto/create-company-multiple.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Roles } from './../auth/roles.enum';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { RolesMeta } from '../auth/roles.decorator';
import { CompaniesService } from './companies.service';
import { UserDecorator } from '../auth/user.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from '../auth/models/user.entity';
import { GetCompaniesFilterDto } from './dto/get-companies-filter.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('companies')



export class CompaniesController {
	constructor(private companiesService: CompaniesService) { }
	// get all category 
	@Get()
	async findAll(@Query() filterDto: GetCompaniesFilterDto): Promise<any> {

		return this.companiesService.findAll(filterDto);
	}
	
	@Get('/user/get-companies')
	@RolesMeta(Roles.ADMIN,Roles.SUPERVISOR, Roles.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getUserCompanies(@UserDecorator() user: User): Promise<any> {
    return this.companiesService.getUserCompanies(user);
  }

	@Get('/:id')
	async findOne(@Param('id') id: number, filterDto: GetCompaniesFilterDto): Promise<any> {
		return this.companiesService.findOne(id, filterDto);
	}

	@Post()
	@RolesMeta(Roles.ADMIN, Roles.USER)
	@UseGuards(AuthGuard('jwt'))
	@FormDataRequest()
	async create(@Body(ValidationPipe) createCompanyDto: CreateCompanyDto): Promise<any> {
		return this.companiesService.create(createCompanyDto);
	}
	// @Post()
	// @RolesMeta(Roles.ADMIN,Roles.USER)
	// @UseGuards(AuthGuard('jwt'))
	// @FormDataRequest()
	// // @UseInterceptors(AnyFilesInterceptor())
	// // @UseInterceptors(FileInterceptor('logoFile'))
	// // @UseInterceptors(FileInterceptor('bannerFile'))
	// async create(@Body(ValidationPipe) createCompanyDto: CreateCompanyDto, @UploadedFile() logoFile: Express.Multer.File,bannerFile: Express.Multer.File): Promise<any> {
	// 		console.log({createCompanyDto})
	//     return this.companiesService.create(createCompanyDto,logoFile,bannerFile);
	// }
	@Post('multiple')
	@RolesMeta(Roles.ADMIN)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async createMultiple(@Body(ValidationPipe) createCompanyMultipleDto: CreateCompanyMultipleDto): Promise<any> {
		return this.companiesService.createMultiple(createCompanyMultipleDto);
	}
	@Put('/:id')
	@RolesMeta(Roles.ADMIN, Roles.USER)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@FormDataRequest()
	async update(@Body(ValidationPipe) updateCompanyDto: UpdateCompanyDto, @Param('id') id: number): Promise<any> {
		return this.companiesService.update(updateCompanyDto, id);
	}
	@Patch('increase-views/:id')
	@RolesMeta(Roles.ADMIN, Roles.USER)
	@UseGuards(RolesGuard)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async increaseCategoryViews(@Param('id') id: number): Promise<any> {
		return this.companiesService.increaseCompanyViews(id);
	}


	@Delete('/:id')
	@RolesMeta(Roles.ADMIN, Roles.USER)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async delete(@Param('id') id: number, @UserDecorator() user: User): Promise<any> {
		return this.companiesService.deleteCat(id, user)
	}

	@Put('/:id/add-favorite')
	@RolesMeta(Roles.ADMIN, Roles.USER, Roles.SUPERVISOR)
	@UseGuards(RolesGuard)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async addFavoriteCompany(@Param('id') id: number, @UserDecorator() user: User): Promise<any> {
		return this.companiesService.addFavoriteCompany(id, user);
	}
	@Put('/:id/remove-favorite')
	@RolesMeta(Roles.ADMIN, Roles.USER, Roles.SUPERVISOR)
	@UseGuards(RolesGuard)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async removeFavoriteCompany(@Param('id') id: number, @UserDecorator() user: User): Promise<any> {
		return this.companiesService.removeFavoriteCompany(id, user);
	}


	@Put('/:companyId/add-images')
	@RolesMeta(Roles.ADMIN, Roles.USER, Roles.SUPERVISOR)
	@UseGuards(RolesGuard)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@FormDataRequest()
	async addcompanyImages(@Param('companyId') companyId: number, @Body(ValidationPipe) companyImageDto: CompanyImageDto): Promise<any> {
		return this.companiesService.addCompanyImages(companyId, companyImageDto);
	}
	@Get('/:id/get-images')
	@RolesMeta(Roles.ADMIN, Roles.USER, Roles.SUPERVISOR)
	@UseGuards(RolesGuard)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async getcompanyImages(@Param('id') id: number,): Promise<any> {
		return this.companiesService.getCompanyImages(id);
	}
	@Delete('/:id/remove-images')
	@RolesMeta(Roles.ADMIN, Roles.USER, Roles.SUPERVISOR)
	@UseGuards(RolesGuard)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async removecompanyImages(@Param('id') id: number, @Body(ValidationPipe) companyIdsDto: CompanyIdsDto): Promise<any> {
		return this.companiesService.removeCompanyImages(id, companyIdsDto);
	}
}
