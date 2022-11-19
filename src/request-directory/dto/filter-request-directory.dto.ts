import {IsOptional } from "class-validator";
import { Status,Type } from '../request-directory.entity'


export class FilterRequestDirectoryDto {
    @IsOptional()
    status: Status;

    @IsOptional()
    type: Type;

    @IsOptional()
    userId: Type;
}