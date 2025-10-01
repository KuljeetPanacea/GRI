export class LoginResponseDto {
    success: boolean;
    message: string;
    tenantId: string;
    emailOtpSent: boolean;
    phoneOtpSent: boolean;
    nextStep: string
  }
  