import { IsNotEmpty, IsOptional } from "class-validator";


export class GetCountriesFilterDto {

    @IsNotEmpty()
    status: boolean;

    @IsNotEmpty()
    city: boolean;
}