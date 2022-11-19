import { IsOptional } from "class-validator";


export class UpdateBranchesDto {

    @IsOptional()
    name_en: string;

    @IsOptional()
    name_ar: string;

    @IsOptional()
    address_ar: string;

    @IsOptional()
    address_en: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    description_ar: string;

    @IsOptional()
    description_en: string;

    @IsOptional()
    link: string;

    @IsOptional()
    companyId: number;

    @IsOptional()
    userId: number;


}