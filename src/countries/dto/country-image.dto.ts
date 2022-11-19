import { imageMimeTypes } from '../../helpers/types';
import { ArrayNotEmpty, IsArray, IsNotEmpty } from "class-validator";
import {  HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';


export class CountryImageDto {
		@IsNotEmpty()
		@IsArray()
		@ArrayNotEmpty()
		@IsFile({each:true})
		// @MaxFileSize(5e6)
		@HasMimeType(imageMimeTypes,{each:true})
		images: MemoryStoredFile[];


}