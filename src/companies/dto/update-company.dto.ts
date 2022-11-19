import { Plans } from './../plans.enum';
import { imageMimeTypes } from './../../helpers/types';
import { CompanyBranchesDto } from './company-branches.dto';
import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';


export class UpdateCompanyDto {
	@IsOptional()
	@IsArray()
	categories: number[];
	@IsOptional()
	countryId: number;
	@IsOptional()
	cityId: number;
	@IsOptional()
	userId: number;
	@IsOptional()
	name_en: string;
	@IsOptional()
	name_ar: string;
	@IsOptional()
	email: string;
	@IsOptional()
	verified: string;
	@IsOptional()
	status: string;
	@IsOptional()
	post_code: string;
	@IsOptional()
	degree: string;
	@IsOptional()
	website: string;
	@IsOptional()
	logo: string;
	@IsOptional()
	logo_key: string;
	@IsOptional()
	banner: string;
	@IsOptional()
	banner_key: string;
	@IsOptional()
	latitude: string;
	@IsOptional()
	longitude: string;
	@IsOptional()
	facebook: string;
	@IsOptional()
	twitter: string;
	@IsOptional()
	linkedin: string;
	@IsOptional()
	whatsapp: string;
	@IsOptional()
	snapchat: string;
	@IsOptional()
	instagram: string;
	@IsOptional()
	agent_name: string;
	@IsOptional()
	standard_phone: string;
	@IsOptional()
	hotline: string;
	@IsOptional()
	building_no: string;
	@IsOptional()
	street_ar: string;
	@IsOptional()
	street_en: string;
	@IsOptional()
	description_en: string;
	@IsOptional()
	description_ar: string;
	@IsOptional()
	district_en: string;
	@IsOptional()
	district_ar: string;
	@IsOptional()
	commercial_reg: string;
	@IsOptional()
	subscriptionPlanId: string;
	@IsOptional()
	subscriptionPlanPackageId: string;
	@IsOptional()
	@IsFile()
	@MaxFileSize(5e6)
	@HasMimeType(imageMimeTypes)
	logoFile: MemoryStoredFile;
	@IsOptional()
	@IsFile()
	@MaxFileSize(5e6)
	@HasMimeType(imageMimeTypes)
	bannerFile: MemoryStoredFile;

}