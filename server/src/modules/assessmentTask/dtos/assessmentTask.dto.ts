import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { QuestionnaireDto } from "src/modules/questionaire/dto/questionnaire.dto";

export class EvidenceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsOptional()
  evidenceCategory?: string;

  @IsString()
  @IsOptional()
  qstnrId: string;  

  @IsString()
  @IsOptional()
  refName?: string;

  @IsDate()
  @IsOptional()
  uploadedAt?: Date;

  @IsString()
  @IsOptional()
  testingProcedure?: string;
}

export class AssessmentTaskDTO extends BaseDTO{
  @IsString()
  @IsNotEmpty()
  deviceRefName: string;

  @IsString()
  @IsNotEmpty()
  deviceType: string;

  @IsString()
  questionnaireId: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  primaryAEStakeholder?: string;
  

  @IsString()
  @IsOptional()
  primaryAEStakeholderId?: string;
  
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsObject()
  @IsOptional()
  questionnaire?: QuestionnaireDto;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsBoolean()
  @IsOptional()
  emailSent?: boolean;

  @IsArray()
  @IsOptional()
  evidences?: EvidenceDto[];
}
