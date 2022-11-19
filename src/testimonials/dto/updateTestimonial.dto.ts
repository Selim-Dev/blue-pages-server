import { imageMimeTypes } from './../../helpers/types';
import { IsOptional, Max, MaxLength, Min } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";


export class UpdateTestimonialDto {

    @IsOptional()
    @MaxLength(255, { message: 'your message should be 255 characters or less' })
    name: string;

    @IsOptional()
    job: string;

    @IsOptional()
    content: string;

    @IsOptional()
    // @Min(0, { message: 'Rating should be 255 characters or less' })
    // @Max(5)
    rating: number;

    @IsOptional()
    image: string;

    @IsOptional()
    image_key: string;

		@IsOptional()
		@IsFile()
		@MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes)
		file: MemoryStoredFile;
}