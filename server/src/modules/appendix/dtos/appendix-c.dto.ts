import { IsNotEmpty, IsString } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { AppendixResponseDto } from "./common.dto";

export class AppendixCDTO extends BaseDTO {
  appendixType: string;
  @IsString()
  @IsNotEmpty()
  requirementNumber: string;

  @IsString()
  @IsNotEmpty()
  requirementDefinition: string;

  @IsString()
  @IsNotEmpty()
  constraints: string;

  @IsString()
  @IsNotEmpty()
  compensatingControlsDefinition: string;

  @IsString()
  @IsNotEmpty()
  originalObjective: string;

  @IsString()
  @IsNotEmpty()
  compensatingObjective: string;

  @IsString()
  @IsNotEmpty()
  identifiedRisk: string;

  @IsString()
  @IsNotEmpty()
  validationMethod: string;

  @IsString()
  @IsNotEmpty()
  maintenanceProcess: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;
}

export class AppendixCResponseDto extends AppendixResponseDto {
  @IsString()
  requirementNumber: string;

  @IsString()
  requirementDefinition: string;

  @IsString()
  constraints: string;

  @IsString()
  compensatingControlsDefinition: string;

  @IsString()
  originalObjective: string;

  @IsString()
  compensatingObjective: string;

  @IsString()
  identifiedRisk: string;

  @IsString()
  validationMethod: string;

  @IsString()
  maintenanceProcess: string;
}