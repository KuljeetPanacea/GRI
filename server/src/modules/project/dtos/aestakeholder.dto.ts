import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class aestakeholder {
  @IsEmail()
  @IsNotEmpty()
  pocEmail: string;

  @IsString()
  @IsNotEmpty()
  pocName: string;

  @IsString()
  @IsNotEmpty()
  pocPhoneNumber: string;
}
