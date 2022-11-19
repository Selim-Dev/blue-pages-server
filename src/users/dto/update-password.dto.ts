import { Roles } from './../../auth/roles.enum';
import { IsEmail, Length, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

// Validation DTO for rrgister request
export class UpdateUserPasswordDto {
    @Length(8, 30)
    @IsNotEmpty({ message: 'Old Password is required' })
    oldPassword: string;
    @Length(8, 30)
    @IsNotEmpty({ message: 'New Password is required' })
    newPassword: string;

}