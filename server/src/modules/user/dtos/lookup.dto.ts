import { IsBoolean, IsString, IsObject, IsArray } from "class-validator";

export class LookupValueDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class LookupDataDto {
  @IsString()
  category: string;

  @IsArray()
  values: LookupValueDto[];
}

export class LookupResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;

  @IsObject()
  data: LookupDataDto;

  @IsString()
  nextStep: string;
}
