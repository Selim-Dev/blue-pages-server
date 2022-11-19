import { imageMimeTypes } from './../../helpers/types';
import { CompanyBranchesDto } from './company-branches.dto';
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { BranchesDto } from "src/branches/dto/branches.dto";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';


export class CreateCompanyDto {
		@IsNotEmpty()
		countryId: number;
		@IsNotEmpty()
		cityId: number;
		@IsNotEmpty()
		userId: number;
    @IsNotEmpty()
    name_en: string;
    @IsNotEmpty()
    name_ar: string;
    @IsNotEmpty()
    email: string;
		@IsNotEmpty()
    standard_phone: string;
		@IsNotEmpty()
    website: string;
		@IsOptional()
    description_en: string;
    @IsOptional()
    description_ar: string;
		// optional
    @IsOptional()
    district_en: string;
    @IsOptional()
    district_ar: string;
    @IsOptional()
    street_ar: string;
    @IsOptional()
    street_en: string;
		@IsOptional()
    building_no: string;
    @IsOptional()
    post_code: string;
		@IsOptional()
    hotline: string;
    @IsOptional()
    commercial_reg: string;
		// 
    @IsOptional()
    degree: string;
    @IsOptional()
    verified: string;
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
    latitude: string;
    @IsOptional()
    longitude: string;
		// subscription
		@IsOptional()
		subscriptionPlanId: string;
		@IsOptional()
		subscriptionPlanPackageId: string;
		// 
		@IsOptional()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		logoFile: MemoryStoredFile;
    @IsOptional()
    logo: string;
    @IsOptional()
    logo_key: string;
		@IsOptional()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		bannerFile: MemoryStoredFile;
		@IsOptional()
    banner: string;
    @IsOptional()
    banner_key: string;
		@IsOptional()
    @IsArray()
    categories: number[];
    @IsOptional()
    @IsArray()
    phones: string[];
    @IsOptional()
    @IsArray()
    videos: string[];
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CompanyBranchesDto)
    branches: CompanyBranchesDto[];
		@IsOptional()
		@IsArray()
		// @MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes,{each:true})
		@IsFile({each:true})
		images: MemoryStoredFile[];
}