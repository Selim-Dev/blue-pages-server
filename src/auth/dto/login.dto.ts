import { IsEmail, Length, IsNotEmpty } from "class-validator";

// Validation class for login request
export class LoginDto {

    @IsEmail({}, { message: 'Invalid email or password' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;

}