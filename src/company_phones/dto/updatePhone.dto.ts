import { IsNotEmpty, IsOptional } from "class-validator";


export class UpdatePhoneDto {

    @IsOptional()
    phone: string;

    @IsOptional()
    companyId: number;
}