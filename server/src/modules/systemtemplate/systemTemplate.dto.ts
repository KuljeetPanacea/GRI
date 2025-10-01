import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { BaseDTO } from 'src/core/dto/base-dto';

export class SystemTemplateDTO extends BaseDTO {
  
  @IsString()
  type: string;
  
  @IsOptional()
  @IsString()
  subject?: string;
  
  @IsString()
  contentTemplate: string;
  
  @IsOptional()
  @IsString()
  titleTemplate?: string;
  
  @IsBoolean()
  active: boolean = true;
  
  @IsOptional()
  @IsObject()
  defaultMetadata?: Record<string, any>;
}