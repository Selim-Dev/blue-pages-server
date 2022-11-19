import { IsOptional } from "class-validator";

export class FilterDirectoryDto {
    @IsOptional()
    year: string;

    @IsOptional()
    cityId: number;
}