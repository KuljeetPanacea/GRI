import {
    IsString,
    IsDateString,
    IsOptional,
    IsEmail,
    IsNumber,
    IsDefined,
    IsObject,
  } from "class-validator";
  import { BaseDTO } from "src/core/dto/base-dto";
import { AuditEntity } from "src/modules/project/dtos/auditEntity.dto";
  
  export class UpdateClientDTO extends BaseDTO {
    @IsString()
    @IsOptional()
    clientId?: string;

    @IsString()
    @IsOptional()
    clientName?: string;
   
    @IsOptional()
    status?:string
  
    @IsString()
    @IsOptional()
    businessName?: string;
  
    @IsString()
    @IsEmail()
    @IsOptional()
    pocEmailId?: string;
  
    @IsString()
    @IsOptional()
    demography?: string;
  
    @IsString()
    @IsOptional()
    industry?: string;
  
    @IsString()
    @IsOptional()
    businessEntity?: string;
  
    @IsString()
    @IsOptional()
    entitySize?: string;
  
    @IsString()
    @IsOptional()
    websiteLink?: string;
  
    @IsOptional()
    companyLogo?: string;
    
    @IsString()
    @IsOptional()
    pocName?: string;

    @IsString()
    @IsOptional()
    pocContactNumber?: string;

    @IsString()
    @IsOptional()
    leadershipName?: string;

    @IsString()
    @IsOptional()
    leadershipContactNo?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    leadershipEmailId?: string;

    @IsOptional()
    tenantId?: string;

    @IsNumber()
    @IsDefined()
    __v:number;

    @IsObject()
    @IsOptional()
    auditEntity?: AuditEntity
  }
  