import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class MailService implements OnModuleInit {
  constructor(private mail: MailerService) {}

  onModuleInit() {
    const message = 'QuikDev: Up in the air!';

    this.mail.sendMail({
      subject: message,
      text: message,
      html: message,
    });
  }

  sendEmailToUser({ name, email, comment }: any) {
    return this.mail.sendMail({
      to: `${name} <${email}>`,
      template: 'NewComment',
      context: { name, comment },
    });
  }
}
