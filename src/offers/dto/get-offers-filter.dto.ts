import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class GetOffersFilterDto {

    @IsOptional()
    @IsString()
    companyId: string;

    @IsOptional()
    @IsString()
    countryId: string;

    @IsOptional()
    @IsString()
    cityId?: string;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    country: boolean;

    @IsOptional()
    @IsBoolean()
    city?: boolean;

    @IsOptional()
    @IsBoolean()
    user?: boolean;

    @IsOptional()
    @IsBoolean()
    company?: boolean;

    @IsOptional()
    @IsArray()
    categories?: number[]

    @IsOptional()
    search: string
}