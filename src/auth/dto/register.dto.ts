import { IsEmail, Length, IsNotEmpty } from "class-validator";

// Validation DTO for rrgister request
export class RegisterDto {
    @Length(1, 60)
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsEmail({}, { message: 'Please enter a valid email' })
    @IsNotEmpty()
    email: string;

    @Length(8, 30)
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @Length(8, 30)
    @IsNotEmpty({ message: 'Confirm Password is required' })
    confirmPassword: string;
}