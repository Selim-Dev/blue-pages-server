import { IsNotEmpty, IsOptional } from "class-validator";


export class CategoryDto {
    
    @IsNotEmpty()
    name_en: string;

    @IsNotEmpty()
    name_ar: string;


}