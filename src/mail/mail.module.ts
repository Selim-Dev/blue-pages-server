import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { join } from 'path'

@Module({
  imports: [
    MailerModule.forRoot({
      // used mailHog as a test mail server
      transport: {
        host: '0.0.0.0',
        secure: false,
        port: 1025,
        // ⬇⏬ mailtrap.io settings for testing 
        // auth: {
        //   user: '921a04bc1b45e1',
        //   pass: '025eb69fa14b99',
        // },
      },
      defaults: {
        from: '"Sonono" <noreply@example.com>',
      },
      // template: {
      //   dir: join(__dirname, 'templates'),
      //   adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule { }
