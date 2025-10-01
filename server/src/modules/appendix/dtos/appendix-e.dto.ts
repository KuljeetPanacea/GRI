
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { AppendixResponseDto } from "./common.dto";

export class AppendixEDTO extends BaseDTO {
  appendixType: string;
  @IsString()
  @IsNotEmpty()
  requirementNumber: string;

  @IsString()
  @IsNotEmpty()
  requirementDefinition: string;

  @IsString()
  @IsNotEmpty()
  customizedControlName: string;

  @IsString()
  @IsNotEmpty()
  controlDescription: string;

  @IsString()
  @IsNotEmpty()
  objectiveMeeting: string;

  @IsString()
  @IsNotEmpty()
  controlsMatrixDocumentation: string;

  @IsString()
  @IsNotEmpty()
  targetedRiskAnalysis: string;

  @IsString()
  @IsNotEmpty()
  assessorNames: string;

  @IsString()
  @IsNotEmpty()
  testingProcedure1: string;

  @IsString()
  @IsNotEmpty()
  whatTested1: string;

  @IsString()
  @IsNotEmpty()
  evidenceExamined1: string;

  @IsString()
  @IsNotEmpty()
  testingResults1: string;

  @IsString()
  @IsOptional()
  testingProcedure2?: string;

  @IsString()
  @IsOptional()
  whatTested2?: string;

  @IsString()
  @IsOptional()
  evidenceExamined2?: string;

  @IsString()
  @IsOptional()
  testingResults2?: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;
}

export class AppendixEResponseDto extends AppendixResponseDto {
  @IsString()
  requirementNumber: string;

  @IsString()
  requirementDefinition: string;

  @IsString()
  customizedControlName: string;

  @IsString()
  controlDescription: string;

  @IsString()
  objectiveMeeting: string;

  @IsString()
  controlsMatrixDocumentation: string;

  @IsString()
  targetedRiskAnalysis: string;

  @IsString()
  assessorNames: string;

  @IsString()
  testingProcedure1: string;

  @IsString()
  whatTested1: string;

  @IsString()
  evidenceExamined1: string;

  @IsString()
  testingResults1: string;

  @IsString()
  @IsOptional()
  testingProcedure2?: string;

  @IsString()
  @IsOptional()
  whatTested2?: string;

  @IsString()
  @IsOptional()
  evidenceExamined2?: string;

  @IsString()
  @IsOptional()
  testingResults2?: string;
}