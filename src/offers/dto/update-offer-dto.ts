import { SaleTypes } from './../sale-type.enum';
import { IsArray, IsBoolean, IsEnum, IsOptional } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { imageMimeTypes } from 'src/helpers/types';


export class UpdateOfferDto {
	@IsOptional()
	companyId: number;
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
	@IsFile()
	@MaxFileSize(5e6)
	@HasMimeType(imageMimeTypes)
	logoFile: MemoryStoredFile;
	@IsOptional()
	logo: string;
	@IsOptional()
	logo_key: string;
	@IsOptional()
	@IsArray()
	categories: number[];
	@IsOptional()
	address_ar: string;
	@IsOptional()
	address_en: string;
	@IsOptional()
	description_en: string;
	@IsOptional()
	description_ar: string;
	@IsOptional()
	on_sale: boolean
	@IsOptional()
	sale_amount: number
	@IsOptional()
	@IsEnum(SaleTypes)
	sale_type: SaleTypes
	@IsOptional()
	paid: boolean
	@IsOptional()
	endAt: Date
	@IsOptional()
	status: boolean

}