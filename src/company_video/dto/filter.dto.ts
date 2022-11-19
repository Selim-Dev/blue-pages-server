import { IsOptional } from "class-validator";


export class FilterVideoDto {
    @IsOptional()
    companyId: number;

}