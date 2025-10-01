import {
    IsString,
    IsDateString,
    IsOptional,
    IsObject,
    IsArray,
    IsEmail,
  } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { AuditEntity } from "./auditEntity.dto";
import { device } from "./device.dto";
import { UserDTO } from "src/modules/user/dtos/User.dto";
import { assignedEntity } from "./assignedEntity.dto";
import { aeInternalAssessor } from "./aeInternalAssessor.dto";
import { cdeDocument } from "./cdeDocx";
  
  export class ProjectDTO extends BaseDTO  {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsString()
  @IsOptional()
  client: string;

  @IsString()
  description: string;

  @IsString()
  projectName: string;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsString()
  @IsOptional()
  QSA?: string;

  @IsString()
  @IsOptional()
  QA?: string;

  @IsObject()
  @IsOptional()
  auditEntity?: AuditEntity

  @IsOptional()
  @IsString()
  currentAuditStage?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsArray()
  @IsOptional()
  scopingQSTRNR?: string[];

  @IsOptional()
  clientInfo: object;

  @IsArray()
  @IsOptional()
  scopingQSTRNRData?: object[];

 
  @IsOptional()
  ScopeDocument?: object;

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

  @IsArray()
  @IsOptional()
  device?:device[];

  @IsArray()
  @IsOptional()
  AEStakeholders?:UserDTO[];

  @IsArray()
  @IsOptional()
  assignedTo?:assignedEntity[];

  @IsArray()
  @IsOptional()
  aeInternalAssessors?:aeInternalAssessor[];

  @IsArray()
  @IsOptional()
  cdeDocs?:cdeDocument[];

  @IsEmail()
  @IsOptional()
  createdByEmail?:string;

  @IsString()
  @IsOptional()
  createdByName?:string;


  }
  