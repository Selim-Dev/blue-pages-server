import { IsNotEmpty, IsOptional } from "class-validator";


export class UpdateCategoryDto {

    @IsOptional()
    name_en: string;

    @IsOptional()
    name_ar: string;
}