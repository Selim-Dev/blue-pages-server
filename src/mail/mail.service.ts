import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { User } from './user.interface'
@Injectable()
export class MailService {
  constructor (private mailerService: MailerService) {}
// 
  async sendUserConfirmation (user: User, token: string): Promise<any> {
    const url = `example.com/auth/confirm?token=${token}`

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      text: `Please confirm your email by clicking on the link: ${url}`,
      // template: './confirmation', // `.hbs` extension is appended automatically
      // context: {
      //   // ✏️ filling curly brackets with content
      //   name: user.name,
      //   url,
      // },
    })
  }
}
