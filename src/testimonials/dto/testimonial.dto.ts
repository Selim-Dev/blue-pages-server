import { imageMimeTypes } from './../../helpers/types';
import { IsNotEmpty, MaxLength } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class TestimonialsDto {

    @IsNotEmpty()
    @MaxLength(255, { message: 'The content should be 255 characters or less' })
    name: string;

    @IsNotEmpty()
    job: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    rating: number;
		@IsNotEmpty()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		file: MemoryStoredFile;
}