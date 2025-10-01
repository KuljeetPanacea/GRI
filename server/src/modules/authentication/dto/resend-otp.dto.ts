import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class ResendOtpDTO {
  
  @IsString()
  @IsNotEmpty()
  tenantId: string

  @IsString()
  @IsNotEmpty()
  @IsDefined({ message: "resendFor is required and cannot be null" })
  resendFor: string
}
