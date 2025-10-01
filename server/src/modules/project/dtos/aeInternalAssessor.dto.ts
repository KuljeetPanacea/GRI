import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class aeInternalAssessor {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  mobileNumber?: string;
  
}
