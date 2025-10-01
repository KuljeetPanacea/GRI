import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
export class device {
  @IsString()
  @IsNotEmpty()
  deviceRefName: string;

  @IsString()
  @IsNotEmpty()
  deviceType: string;

  @IsObject()
  @IsOptional()
  questionnaireId: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsArray()
  @IsOptional()
  primaryAEStakeholderId?: string;
  
  @IsString()
  @IsOptional()
  ipAddress: string;

  @IsString()
  @IsOptional()
  id: string
}
