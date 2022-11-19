import { IsNotEmpty, IsOptional } from "class-validator";


export class BranchesDto {

    @IsNotEmpty()
    name_en: string;

    @IsNotEmpty()
    name_ar: string;

    @IsNotEmpty()
    address_ar: string;

    @IsNotEmpty()
    address_en: string;

    @IsOptional()
    phone: string;

    @IsNotEmpty()
    description_ar: string;

    @IsNotEmpty()
    description_en: string;

    @IsOptional()
    link: string;

    @IsNotEmpty()
    companyId: number;

    @IsNotEmpty()
    userId: number;

    
}