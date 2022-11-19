import { Body, Controller, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserInterface } from './interfaces/register.interface';
import { RegisterDto } from './dto/register.dto';
import { ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDecorator } from './user.decorator';
import { User } from '@ngneat/falso';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    register(@Body(ValidationPipe) user: RegisterDto): Promise<any> {
        return this.authService.registrationAccount(user);
    }

    @Post('/login')
    async login(@Body() user: LoginDto, @UserDecorator() userw: User): Promise<any> {
        const { email } = user
        const getUser = await this.authService.findUserByEmail({ email })
        const { password, ...userData } = getUser
        return this.authService.login(user).pipe(map((jwt: string) => ({ token: jwt, statusCode: 200, user: userData })))
    }

}
