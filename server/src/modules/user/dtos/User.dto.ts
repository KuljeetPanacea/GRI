import {
  IsString,
  IsEmail,
  IsArray,
  IsOptional,
  MinLength,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";

export class UserDTO extends BaseDTO{

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8) // Example: Minimum password length of 8 characters
  @IsOptional()
  password?: string; // Add password field to store the hashed value

  @IsArray()
  roles: string[];

  @IsString()
  name: string;

  @IsOptional()
  tenantId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber()
  countryCode:number;

  @IsNumber()
  mobileNumber:number;

  @IsOptional()
  @IsBoolean()
  defaultPasswordchange?: boolean;

  @IsOptional()
  @IsString()
  otp?: string
}
