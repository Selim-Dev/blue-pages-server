import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { BranchesDto } from "../../branches/dto/branches.dto";
 
export class CompanyInsertInterface {
	@IsString()
	@IsNotEmpty()
	name_en: string;
	@IsString()
	@IsNotEmpty()
	name_ar: string;
	@IsEmail()
	@IsNotEmpty()
	email: string;
	@IsString()
	@IsNotEmpty()
	standard_phone: string;
	@IsString()
	@IsNotEmpty()
	website: string;
	@IsArray()
	@IsOptional()
	categories: number[];
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
}

export class CreateCompanyMultipleDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompanyInsertInterface)
	data: CompanyInsertInterface[];
	@IsNotEmpty()
	countryId: number;
	@IsNotEmpty()
	cityId: number;
}