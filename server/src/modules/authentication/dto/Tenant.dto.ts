import { IsString, IsEmail, IsOptional, MinLength, IsNumber } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";

export class TenantDTO extends BaseDTO {
  @IsString()
  tenantName: string;

  @IsEmail()
  tenantEmail: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  createDtTime?: Date;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  updateDtTime?: Date;

  @IsOptional()
  __v?: number;

  @IsNumber()
  tenantPhoneCountryCode: number

  @IsNumber()
  tenantPhone: number

  @IsOptional()
  id?: string;
}
