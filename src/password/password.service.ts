import { MailerService } from '@nestjs-modules/mailer'
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthService } from '../auth/auth.service'
import { Repository } from 'typeorm'
import { PasswordEntity } from './models/password.entity'
import bcryptjs from 'bcryptjs'

import { MailService } from './../mail/mail.service'

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(PasswordEntity)
    private readonly passwordRepository: Repository<PasswordEntity>,
    private mailerService: MailerService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private mailService: MailService,
  ) { }

  // creat token in database and send email to user
  async create(body: any): Promise<object> {
    const user = await this.authService.findByEmail({ email: body.email })
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    const token = Math.random().toString(20).substring(2, 12)
    const url = `http://localhost:3003/reset-password/${token}`

    await this.passwordRepository.save({ email: body.email, token })

    // await this.mailService.sendUserConfirmation(
    //   {
    //     email: 'zoz@gmail.com',
    //     name: 'ali sleem',
    //   },
    //   token,
    // )
    await this.mailerService.sendMail({ 
      from: 'Zoz <ezz@gmail.com>',
      to: body.email,
      subject: 'Reset password',
      text: `Click on the link to reset your password: ${url}`,
    })
    return { message: 'Please check your email' }
  }
  // update password in database
  async update(body: any): Promise<object> {
    // check if password and passwordConfirm match
    if (body.password !== body.passwordConfirm) {
      throw new BadRequestException('Password and confirm password is not match')
    }
    // check if token is valid and not expired
    const passwordReset = await this.passwordRepository.findOne({
      token: body.token,
    })
    if (!passwordReset) {
      throw new BadRequestException('invalid link please send email again')
    }
    const user = await this.authService.findByEmail({ email: passwordReset.email })
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    const hashedPassword = await bcryptjs.hash(body.password, 10)
    await this.authService.updatee(user.id, { password: hashedPassword })

    return { message: 'Password has been reset' }
  }
}
