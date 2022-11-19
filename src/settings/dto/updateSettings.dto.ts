import { imageMimeTypes } from './../../helpers/types';
import { IsOptional } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class UpdateSettingDto {
    @IsOptional()
    title_en: string;

    @IsOptional()
    title_ar: string;

    @IsOptional()
    description_en: string;

    @IsOptional()
    description_ar: string;

    @IsOptional()
    keywords: string;

    @IsOptional()
    facebook: string;

    @IsOptional()
    twitter: string;

    @IsOptional()
    instagram: string;

    @IsOptional()
    linkedin: string;

    @IsOptional()
    snapchat: string;

    @IsOptional()
    youtube: string;

    @IsOptional()
    logo_ar: string;

    @IsOptional()
    logo_ar_key: string;
    @IsOptional()
    logo_en: string;

    @IsOptional()
    logo_en_key: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    latitude: string;

    @IsOptional()
    longitude: string;

    @IsOptional()
    email: string;

    @IsOptional()
    whatsapp: string;

    @IsOptional()
    copyright_en: string;

    @IsOptional()
    copyright_ar: string;

    @IsOptional()
    location: string;

    @IsOptional()
    views: string;
    
		@IsOptional()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		logoFileAr: MemoryStoredFile;
		@IsOptional()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		logoFileEn: MemoryStoredFile;
}