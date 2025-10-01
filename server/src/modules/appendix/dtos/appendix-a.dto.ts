
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { AssessmentFindingEnum, AppendixResponseDto } from "./common.dto";

export class AssessorResponseDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  evidenceCategory?: string;

  @IsString()
  @IsOptional()
  refName?: string;

  @IsString()
  @IsNotEmpty()
  reportingInstructionId: string;
}

export class AppendixAControlDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(AssessmentFindingEnum)
  @IsNotEmpty()
  assessmentFinding: AssessmentFindingEnum;

  @IsBoolean()
  @IsNotEmpty()
  compensatingControl: boolean;

  @IsBoolean()
  @IsNotEmpty()
  customizedApproach: boolean;

  @IsString()
  @IsNotEmpty()
  assessmentFindingDesc: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssessorResponseDto)
  @IsNotEmpty()
  assessorResponse: AssessorResponseDto[];
}

export class AppendixADTO extends BaseDTO {
  appendixType: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppendixAControlDto)
  @IsNotEmpty()
  controls: AppendixAControlDto[];
  @IsString()
  @IsNotEmpty()
  projectId: string;
}

export class AppendixAResponseDto extends AppendixResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppendixAControlDto)
  controls: AppendixAControlDto[];
}
