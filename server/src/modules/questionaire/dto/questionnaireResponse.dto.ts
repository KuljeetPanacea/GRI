import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { BaseDTO } from 'src/core/dto/base-dto';

export class QuestionnaireResponseDto extends BaseDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  complianceType?: string;

  @IsOptional()
  @IsString()
  phase?: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  status: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;
  
  @IsOptional()
  @IsString()
  isCompletedAllQuestions?: boolean
  }