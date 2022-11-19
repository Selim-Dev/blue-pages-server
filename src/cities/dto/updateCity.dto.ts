import { imageMimeTypes } from './../../helpers/types';
import { IsNotEmpty, IsOptional } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";


export class UpdateCityDto {

    @IsOptional()
    name_en: string;

    @IsOptional()
    name_ar: string;

    @IsOptional()
    image: string;

    @IsOptional()
    image_key: string

    @IsOptional()
    institution_name: string;
		@IsOptional()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		file: MemoryStoredFile;

}