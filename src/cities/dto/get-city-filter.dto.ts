import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class GetCitiesFilterDto {

    @IsNotEmpty()
    status?: boolean;

    @IsOptional()
    @IsString() 
    countryId?: number;
}