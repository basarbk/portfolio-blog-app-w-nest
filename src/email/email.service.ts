import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transport: nodemailer.Transporter;

  constructor() {
    this.transport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'virginia.thompson43@ethereal.email',
        pass: 'AKTPfSQqPtqKd3JHjb',
      },
    });
  }

  async sendSignUpEmail(email: string, token: string): Promise<void> {
    await this.transport.sendMail({
      from: 'info@my-app.com',
      to: email,
      subject: 'Finish creating your account on My App',
      html: `
            <h1>You are almost there</h1>
            <span>Click the link below to confirm your email and finish creating your My App account.</span>
            <div>
                <a href="http://localhost:5173/callback?token=${token}&operation=register">Create your account</a>
            </div>
        `,
    });
  }
}
