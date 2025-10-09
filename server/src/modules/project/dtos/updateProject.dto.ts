import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDefined,
  IsDateString,
  IsObject,
  IsArray,
} from "class-validator";
import { AuditEntity } from "./auditEntity.dto";
import { device } from "./device.dto";
import { UserDTO } from "src/modules/user/dtos/User.dto";
import { assignedEntity } from "./assignedEntity.dto";
import { aeInternalAssessor } from "./aeInternalAssessor.dto";

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  projectName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsOptional()
  @IsString()
  client?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  __v: number;

  @IsOptional()
  @IsArray()
  scopingQSTRNR?: string[];

  @IsOptional()
  @IsArray()
  scopingQSTRNRData?: object[];

  @IsOptional()
  @IsString()
  currentAuditStage?: string;

  @IsOptional()
  clientInfo?: object;

  @IsOptional()
  @IsString()
  clientDBA?: string;

  @IsOptional()
  @IsString()
  clientWebsiteLink?: string;

  @IsOptional()
  @IsString()
  clientPocName?: string;

  @IsOptional()
  @IsString()
  clientContactNumber?: string;

  @IsOptional()
  @IsString()
  clientEmailAddress?: string;

  @IsObject()
  @IsOptional()
  auditEntity?: AuditEntity;

  @IsString()
  @IsOptional()
  Auditor?: string;

  @IsString()
  @IsOptional()
  QA?: string;

  @IsArray()
  @IsOptional()
  device?: device[];

  @IsArray()
  @IsOptional()
  AEStakeholders?: UserDTO[];

  @IsArray()
  @IsOptional()
  assignedTo?: assignedEntity[];

  @IsArray()
  @IsOptional()
  aeInternalAssessors?: aeInternalAssessor[];

  
}

export class userResponseDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsArray()
  @IsOptional()
  choiceValue?: string[];  

  @IsString()
  @IsOptional()
  assessmentId?: string;

}

export class gapCommentDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  gapComment: string;

  @IsString()
  @IsOptional()
  clientComment?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  assessmentId?: string;
}


