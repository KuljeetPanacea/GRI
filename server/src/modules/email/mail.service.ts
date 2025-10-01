import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class EmailService {
  private transporter: {
    sendMail: (arg0: {
      from: string;
      to: string;
      subject: string;
      text: string;
    }) => any;
  };

  constructor(private readonly configService: ConfigService) {
  this.transporter = nodemailer.createTransport({
 host: process.env.EMAIL_HOST, // email-smtp.ap-south-1.amazonaws.com
  port: Number(process.env.EMAIL_PORT), // 587
  secure: process.env.EMAIL_SECURE === "true", // false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3", // sometimes needed for SES
    rejectUnauthorized: false, // optional for local testing
  },
});

  }

  async sendPasswordResetEmail(
    email: string,
    resetLink: string
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('FROM_EMAIL'),
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new InternalServerErrorException(
        "Could not send password reset email"
      );
    }
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. Please use it to complete your verification.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new InternalServerErrorException("Could not send OTP email");
    }
  }

  async checkIdempotencyKey(key: string) {
    return false;
  }

  async sendTemplateEmail(
    template: string,
    to: string,
    body: Record<string, any>,
    options: Record<string, any>
  ): Promise<{ success: boolean; message: string }> {
    return { success: true, message: "Template email sent successfully" };
  }

  async sendEmail(
    to: string,
    subject: string,
    body: string,
    options: Record<string, any> = {}
  ): Promise<{ success: boolean; message: string }> {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        subject,
        text: body,
        ...options, // allows HTML, attachments etc.
      };

      const info = await this.transporter.sendMail(mailOptions);

      console.log("✅ Email sent:", info.response);
      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      console.error("❌ Email sending failed:", error);
      return { success: false, message: error.message };
    }
  }
}
