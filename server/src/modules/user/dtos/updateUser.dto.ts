import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDefined,
  IsArray,
} from "class-validator";

export class UpdateUserDto {

  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;


  @IsString()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsDefined()
  __v: number;

  @IsNumber()
  @IsOptional()
  countryCode:number;

  @IsNumber()
  @IsOptional()
  mobileNumber:number;
}
