import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";

// Enums for validation
export enum AssessmentFindingEnum {
  NOT_APPLICABLE = 'Not Applicable',
  IN_PLACE = 'In Place',
  NOT_IN_PLACE = 'Not in Place',
  NOT_TESTED = 'Not Tested'
}

// Base response DTO
export class AppendixResponseDto extends BaseDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  appendixType?: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;
}