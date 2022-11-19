import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, forwardRef, Inject, Post } from '@nestjs/common';

import { PasswordService } from './password.service';
import { AuthService } from '../auth/auth.service';



@Controller('password')
export class PasswordController {

    constructor(
        private passwordService: PasswordService,
        private mailerService: MailerService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService
    ) { }

    // creat token in database and send email to user
    @Post('/forgot')
    async forgot(@Body('email') email: string): Promise<object> {
        return this.passwordService.create({ email });
    }

    // update password in database
    @Post('/reset')
    async reset(
        @Body('token') token: string,
        @Body('password') password: string,
        @Body('passwordConfirm') passwordConfirm: string,): Promise<object> {
        return this.passwordService.update({ token, password, passwordConfirm });
    }


}
