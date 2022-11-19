import { IsOptional } from "class-validator";


export class FilterPhoneDto {
    @IsOptional()
    companyId: number;

}