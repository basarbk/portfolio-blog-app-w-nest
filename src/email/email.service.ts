import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transport: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transport = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendSignUpEmail(email: string, token: string): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${this.configService.get<string>('CLIENT_HOST')}/callback?token=${token}&operation=register`,
      );
    }
    await this.transport.sendMail({
      from: 'info@my-app.com',
      to: email,
      subject: 'Finish creating your account on My App',
      html: `
            <h1>You are almost there</h1>
            <span>Click the link below to confirm your email and finish creating your My App account.</span>
            <div>
                <a href="${this.configService.get<string>('CLIENT_HOST')}/callback?token=${token}&operation=register">Create your account</a>
            </div>
        `,
    });
  }

  async sendLoginEmail(email: string, token: string): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${this.configService.get<string>('CLIENT_HOST')}/callback?token=${token}&operation=login`,
      );
    }
    await this.transport.sendMail({
      from: 'info@my-app.com',
      to: email,
      subject: 'Sign in to My App',
      html: `
            <span>Click the link below to sign in to your My App account.</span>
            <div>
                <a href="${this.configService.get<string>('CLIENT_HOST')}/callback?token=${token}&operation=login">Sign in to My App</a>
            </div>
        `,
    });
  }
}
