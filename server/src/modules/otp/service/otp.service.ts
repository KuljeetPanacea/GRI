import { Injectable, BadRequestException } from "@nestjs/common";
import { BaseService } from "src/core/service/base.service";

@Injectable()
export class OtpService extends BaseService {
  private otpStore = new Map<string, string>(); // Replace with DB/Redis in production

  generateOtp(id: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    this.otpStore.set(id, otp);
    return otp;
  }

  verifyOtp(id: string, otp: string): boolean {
    const storedOtp = this.otpStore.get(id);
    if (!storedOtp || storedOtp !== otp) {
      throw new BadRequestException("Invalid or expired OTP");
    }
    this.otpStore.delete(id); // Remove OTP after verification
    return true;
  }

  async reSendOtp(Id: string, resendFor: string): Promise<boolean> {
    return true;
  }
}
