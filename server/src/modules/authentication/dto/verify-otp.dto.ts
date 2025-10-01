import { IsString } from "class-validator";

export class VerifyOtpDTO {
  
  @IsString()
  tenantId: string

  @IsString()
  phoneOtp: string
}
