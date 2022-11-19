import { imageMimeTypes } from './../../helpers/types';
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";


export class CountriesDto {

    @IsNotEmpty()
    name_en: string;

    @IsNotEmpty()
    name_ar: string;
		
		@IsNotEmpty()
    title_en: string;
    @IsNotEmpty()
    subtitle_en: string;
		@IsNotEmpty()
    title_ar: string;
    @IsNotEmpty()
    subtitle_ar: string;

    @IsNotEmpty()
    code: string;

		@IsNotEmpty()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		file: MemoryStoredFile;

		@IsNotEmpty()
		@IsArray()
		// @MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes,{each:true})
		@IsFile({each:true})
		images: MemoryStoredFile[];
}