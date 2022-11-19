import { Roles } from './../../auth/roles.enum';
import { IsEmail, Length, IsNotEmpty, IsOptional } from "class-validator";

// Validation DTO for rrgister request
export class updateUserDto {
    @Length(1, 60)
    @IsOptional()
    name: string;

    @IsEmail({})
    @IsOptional()
    email: string;
		
    // @IsOptional()
    // status: boolean;
}