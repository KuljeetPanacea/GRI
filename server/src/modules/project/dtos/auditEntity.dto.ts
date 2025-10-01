import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuditEntity {
  @IsEmail()
  @IsNotEmpty()
  pocEmail: string;

  @IsString()
  @IsNotEmpty()
  pocName: string;

  @IsString()
  @IsNotEmpty()
  pocPhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  assessedEntityname: string;

  @IsString()
  @IsNotEmpty()
  assessedDba: string;

  @IsString()
  @IsNotEmpty()
  assessedWebsiteLink: string;
}
