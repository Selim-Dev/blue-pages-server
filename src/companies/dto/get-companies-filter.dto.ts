import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";


export class GetCompaniesFilterDto {

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
    branches?: boolean;

    @IsOptional()
    @IsArray()
    categories: number[];
    
    @IsOptional()
    search: string
    @IsOptional()
    limit: number
}