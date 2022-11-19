import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Status, Type } from '../request-directory.entity'


export class RequestDirectoryDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    company_name: string;

    @IsOptional()
    @IsEnum(Status)
    status: Status;

    @IsNotEmpty()
    @IsEnum(Type)
    type: Type;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    phone: string;

    @IsOptional()
    category: string;


    @IsNotEmpty()
    cityId: number;

    @IsNotEmpty()
    userId: number;
}
