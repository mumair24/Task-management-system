import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('APP_EMAIL'),
        pass: this.configService.get<string>('APP_PASSWORD'),
      },
    });
  }

  private getResetPasswordTemplate(resetLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; text-align: center; }
              .header { font-size: 24px; font-weight: bold; color: #333; }
              .message { font-size: 16px; color: #555; margin: 20px 0; }
              .btn { display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; background: #007bff; text-decoration: none; border-radius: 5px; font-weight: bold; }
              .btn:hover { background: #0056b3; }
              .footer { margin-top: 20px; font-size: 12px; color: #999; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">Reset Your Password</div>
              <p class="message">We received a request to reset your password. Click the button below to set a new password.</p>
              <a href="${resetLink}" class="btn">Reset Password</a>
              <p class="message">If you didn't request a password reset, please ignore this email. This link will expire in 30 minutes.</p>
              <div class="footer">&copy; 2024 Your Company. All rights reserved.</div>
          </div>
      </body>
      </html>
    `;
  }

  async sendResetPasswordEmail(to: string, resetToken: string) {
    const resetLink = `${resetToken}`;
    const emailHtml = this.getResetPasswordTemplate(resetLink);

    const mailOptions = {
      from: this.configService.get<string>('APP_EMAIL'),
      to,
      subject: 'Reset Your Password',
      html: emailHtml,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Reset password email sent:', info.response);
      return info;
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw error;
    }
  }
}
