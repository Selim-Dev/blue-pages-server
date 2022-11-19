import { imageMimeTypes } from './../../helpers/types';
import { IsNotEmpty, IsOptional } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class SettingDto {
    @IsNotEmpty()
    title_en: string;

    @IsNotEmpty()
    title_ar: string;

    @IsNotEmpty()
    description_en: string;

    @IsNotEmpty()
    description_ar: string;

    @IsNotEmpty()
    keywords: string;

    @IsNotEmpty()
    facebook: string;

    @IsNotEmpty()
    twitter: string;

    @IsNotEmpty()
    instagram: string;

    @IsNotEmpty()
    linkedin: string;

    @IsNotEmpty()
    snapchat: string;

    @IsNotEmpty()
    youtube: string;

    @IsOptional()
    logo: string;

    @IsOptional()
    logo_key: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    whatsapp: string;

    @IsNotEmpty()
    copyright_en: string;

    @IsNotEmpty()
    copyright_ar: string;

    @IsNotEmpty()
    location: string;

    @IsNotEmpty()
    views: string;
		@IsOptional()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		file: MemoryStoredFile;

}