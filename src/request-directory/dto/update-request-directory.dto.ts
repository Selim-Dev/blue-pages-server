import { IsEnum, IsNotEmpty, IsOptional, NotEquals } from "class-validator";
import { Status, Type } from '../request-directory.entity'


export class UpdateRequestDirectoryDto {

    @IsOptional()
    name: string;

    @IsOptional()
    company_name: string;

    @IsOptional()
    @IsEnum(Status)
    @NotEquals(Status[Status.pending])
    status: Status;

    @IsOptional()
    @IsEnum(Type)
    type: Type;

    @IsOptional()
    email: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    cityId: number;
}