import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  isString,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";
import { QuestionType } from "../model/Question.type";
import { BaseDTO } from "src/core/dto/base-dto";
import { BranchingLogic } from "../model/branching-logic.interface";

export class ChoiceDto {
  @IsString()
  value!: string;
}

export class QuestionDto {
  @IsString()
  questionnaireId!: string; // Required to associate with a questionnaire

  @IsString()
  type!: QuestionType;

  @IsOptional()
  @IsString()
  id?: string; // Mapped from _id

  @IsOptional()
  _id?: string;

  @IsString()
  text!: string;

  @IsString()
  userResponse!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices!: ChoiceDto[]; // Allow simple strings as choices instead of objects

  @IsBoolean()
  @IsOptional()
  isEditing?: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsOptional()
  requirements?: string;

  @IsOptional()
  subRequirements?: string;

  @IsOptional()
  subControl?: string;

  @IsOptional()
  alwaysGoTo?: string;

  @IsOptional()
  setting?: string;

  @IsOptional()
  branchingLogic?: BranchingLogic;

  @IsOptional()
  formBranchingLogic?: BranchingLogic[];

  @IsOptional()
  @IsString()
  evidenceReference?: string;

  @IsOptional()
  @IsString()
  testingProcedure?: string;

  @IsOptional()
  @IsObject()
  gaps?: {
    gaps?: string;
    clientComment?: string;
    status?: string;
  };
}

export class QuestionnaireDto extends BaseDTO {
  @IsOptional()
  @IsString()
  id?: string;

  // @IsOptional()
  // _id?:string;

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
  industrySize?: string;

  @IsOptional()
  @IsString()
  industryType?: string;

  @IsOptional()
  @IsString()
  phase?: string;

  @IsOptional()
  @IsString()
  deviceType?: string;

  @IsOptional()
  @IsString()
  appID?: string;

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
  currentQuestionTracker?: string;

  @IsOptional()
  @IsBoolean()
  isCompletedAllQuestions?: boolean;
  // @IsOptional()
  // @IsString()
  // createDtTime?: string; // ISO string

  // @IsOptional()
  // @IsString()
  // updateDtTime?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions!: QuestionDto[];
}

export class AddQuestionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions!: QuestionDto[];
}

export class ScopingQstnrDTO extends BaseDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title!: string;

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
  createdBy?: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsOptional()
  @IsString()
  currentQuestionTracker?: string;

  @IsOptional()
  @IsBoolean()
  isCompletedAllQuestions?: boolean;

  @IsOptional()
  @IsString()
  createDtTime?: Date; // ISO string

  @IsOptional()
  @IsString()
  updateDtTime?: Date;
}
