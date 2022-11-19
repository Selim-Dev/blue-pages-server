import { imageMimeTypes } from './../../helpers/types';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { IsNotEmpty, IsOptional } from "class-validator";


export class CityDto {

    @IsNotEmpty()
    name_en: string;

    @IsOptional()
    name_ar: string;

    @IsOptional()
    image: string;

    @IsOptional()
    institution_name: string;
		@IsNotEmpty()
    countryId: number;
		@IsNotEmpty()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		file: MemoryStoredFile;
    
}