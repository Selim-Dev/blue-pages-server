import { IsOptional } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";
import { imageMimeTypes } from "src/helpers/types";

export class UpdateDirectoryDto {

    @IsOptional()
    @IsFile()
    @MaxFileSize(50e6)
    @HasMimeType('application/pdf')
    file: MemoryStoredFile;

    @IsOptional()
    pdf: string;

    @IsOptional()
    pdf_key: string;

    @IsOptional()
    year: string;

    @IsOptional()
    cityId: number;


}