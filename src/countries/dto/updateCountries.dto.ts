import { imageMimeTypes } from './../../helpers/types';
import { IsNotEmpty, IsOptional } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";


export class UpdateCountriesDto {

    @IsOptional()
    name_en: string;

    @IsOptional()
    name_ar: string;

    @IsOptional()
    code: string;

		@IsOptional()
    title_en: string;
    @IsOptional()
    subtitle_en: string;
		@IsOptional()
    title_ar: string;
    @IsOptional()
    subtitle_ar: string;

    @IsOptional()
    status: boolean;

    @IsOptional()
    flag: string;

    @IsOptional()
    flag_key: string;
		@IsOptional()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		file: MemoryStoredFile;
}