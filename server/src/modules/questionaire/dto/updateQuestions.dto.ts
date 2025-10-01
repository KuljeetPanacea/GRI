import {
    IsString,
    IsOptional,
    IsArray,
    ValidateNested
  } from 'class-validator';
  import { Exclude, Expose, Type } from 'class-transformer';
  import { BaseDTO } from 'src/core/dto/base-dto';
  import { QuestionDto } from './questionnaire.dto';
  
  @Exclude()
  export class UpdateQuestionsDTO extends BaseDTO {
    @Expose()
    @IsOptional()
    @IsString()
    id?: string;
  
    @Expose()
    @IsString()
    title?: string;
  
    @Expose()
    @IsOptional()
    @IsString()
    description?: string;
  
    @Expose()
    @IsOptional()
    @IsString()
    status: string;
  
    @Expose()
    @IsOptional()
    @IsString()
    tenantId?: string;
  
    @Expose()
    @IsOptional()
    @IsString()
    createdBy?: string;
  
    @Expose()
    @IsOptional()
    @IsString()
    updatedBy?: string;
  
    @Expose()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionDto)
    questions!: QuestionDto[];
  }
  