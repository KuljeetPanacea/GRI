import {
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDTO } from 'src/core/dto/base-dto';
import { ControlFinding, CustomizedEnum, ModeEnum } from '../model/RocControlFinding.model';
import { EvidenceDto } from 'src/modules/assessmentTask/dtos/assessmentTask.dto';

// export class ValidationMethodDTO {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsEnum(CustomizedEnum)
//   customized: typeof CustomizedEnum[number];

//   @IsString()
//   @IsNotEmpty()
//   customised_approach: string;

//   @IsEnum(CustomizedEnum)
//   define: typeof CustomizedEnum[number];

//   @IsString()
//   @IsNotEmpty()
//   define_approach: string;
// }

export class ModeOfAssessmentDTO {
  @IsEnum(ModeEnum)
  mode: typeof ModeEnum[number];

  @IsString()
  @IsNotEmpty()
  compensation: string;
}

export class RocControlFindingDTO extends BaseDTO {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  assessmentId: string;

  @IsString()
  @IsNotEmpty()
  controlNo: string;

  @IsEnum(ControlFinding)
  controlAssessmentFinding: ControlFinding;

  @IsString()
  @IsNotEmpty()
  detailed_finding: string;

  // @ValidateNested()
  // @Type(() => ValidationMethodDTO)
  // validationMethod: ValidationMethodDTO;

  @IsArray()
  @IsOptional()
  evidences: EvidenceDto[];

  @IsBoolean()
  @IsOptional()
  compensatingControl: boolean;

  @IsBoolean()
  @IsOptional()
  customizedApproach: boolean;

  @ValidateNested()
  @Type(() => ModeOfAssessmentDTO)
  modeOfAssessment: ModeOfAssessmentDTO;
}


export class RocControlDataResponse extends BaseDTO {
  
  @IsString()
  @IsOptional()
  controlNo: string;

  @IsEnum(ControlFinding)
  controlAssessmentFinding: ControlFinding;

  @IsString()
  @IsOptional()
  detailed_finding: string;

  @IsArray()
  @IsOptional()
  evidences: EvidenceDto[];

  @IsBoolean()
  @IsOptional()
  compensatingControl: boolean;

  @IsBoolean()
  @IsOptional()
  customizedApproach: boolean;
}