import { IsNotEmpty, IsOptional } from "class-validator";


export class PhoneDto {
    
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    companyId: number;


}