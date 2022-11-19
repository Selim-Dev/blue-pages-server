import { IsOptional } from "class-validator";

export class IncreaseViewsDto {
    @IsOptional()
    companies: string;
    @IsOptional()
    offers: string;
    @IsOptional()
    total: string;
}