import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: String(process.env.MAIL_AUTH_USER),
          pass: String(process.env.MAIL_AUTH_PASS),
        },
      },
      defaults: {
        to: 'QuikDev <QuikDev@email.com',
        from: 'QuikDev <QuikDev@email.com',
        subject: 'New Comment',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: { strict: true },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
