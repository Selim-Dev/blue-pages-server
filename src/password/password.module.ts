import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PasswordController } from './password.controller'
import { PasswordService } from './password.service'
import { PasswordEntity } from './models/password.entity'
import { MailerModule } from '@nestjs-modules/mailer'
import { AuthModule } from '../auth/auth.module'
import { MailModule } from '../mail/mail.module'
import { JobService } from './cronJobDelete/cronJobDeleteToken'

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordEntity]),
    // used forwordRef to get access to AuthModule and prevent circular dependency
    forwardRef(() => AuthModule),
    forwardRef(() => MailModule),

  ],
  controllers: [PasswordController],
  providers: [PasswordService,JobService],
})
export class PasswordModule {}
