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

export class ResponseUserDTO extends BaseDTO{

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsArray()
  roles: string[];

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber()
  mobileNumber:number;

}
