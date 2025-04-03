import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  sendEmailVerification(receiver: string, verificationLink: string) {
    return this.mailService.sendMail({
      to: receiver,
      subject: 'Account Verification',
      template: 'signup',
      context: { url: verificationLink },
    });
  }

  sendEmailResetPassword(receiver: string, verificationLink: string) {
    return this.mailService.sendMail({
      to: receiver,
      subject: 'Reset Password',
      template: 'reset_password',
      context: { url: verificationLink },
    });
  }
}
