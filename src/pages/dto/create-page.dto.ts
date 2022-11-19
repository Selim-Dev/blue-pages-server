import { IsNotEmpty, IsOptional } from "class-validator";


export class CreatePageDto {
    
    @IsNotEmpty()
    title_en: string;
    @IsNotEmpty()
    title_ar: string;

    @IsNotEmpty()
    slug: string;
    @IsNotEmpty()
    content: string;


}