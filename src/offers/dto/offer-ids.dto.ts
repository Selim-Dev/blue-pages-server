import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import {  MemoryStoredFile } from 'nestjs-form-data';


export class OfferIdsDto {
		@IsNotEmpty()
		@IsArray()
		// @MaxFileSize(5e6)
		// @HasMimeType(imageMimeTypes)
		// @IsString({each:true})
		imageIds: number[];
}