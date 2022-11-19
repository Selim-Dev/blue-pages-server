import { Roles } from './../../auth/roles.enum';
import { IsEmail, Length, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

// Validation DTO for rrgister request
export class createUserDto {
		@ApiProperty({
			description: 'The name of user',
			example:'John Doe'
		})
    @Length(1, 60)
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

		@ApiProperty({
			description: 'The email of user',
			example:'user@user.com'
		})
    @IsEmail({}, { message: 'Please enter a valid email' })
    @IsNotEmpty()
    email: string;

		@ApiProperty({
			description: 'The Password of user',
			example:'password'
		})
    @Length(8, 30)
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

		@ApiProperty({
			description: 'The Password confirmation of user',
			example:'password'
		})
    @Length(8, 30)
    @IsNotEmpty({ message: 'Confirm Password is required' })
    confirmPassword: string;
		
		@ApiProperty({
			description: 'The Role of user',
			example:'USER'
		})
		@IsOptional()
		role:Roles
}