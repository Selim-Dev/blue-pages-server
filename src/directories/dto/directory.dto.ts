import { IsNotEmpty, IsOptional } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";
import { imageMimeTypes } from "src/helpers/types";


export class DirectoryDto {

    @IsNotEmpty()
    @IsFile()
    @MaxFileSize(50e6)
    @HasMimeType('application/pdf')
    pdf: MemoryStoredFile;


    @IsOptional()
    year: string;

    @IsNotEmpty()
    cityId: number;
}