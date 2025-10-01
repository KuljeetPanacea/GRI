import {
    IsString,
    IsDateString,
    IsOptional,
    IsObject,
    IsArray,
  } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { AuditEntity } from "./auditEntity.dto";
import { assignedEntity } from "./assignedEntity.dto";
  
  export class adminProjectResponse extends BaseDTO  {
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
  assignedTo?:assignedEntity[];

  }
  