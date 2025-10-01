import {
    IsString,
    IsDateString,
    IsOptional,
    IsEmail,
    isString,
    IsObject,
  } from "class-validator";
  import { BaseDTO } from "src/core/dto/base-dto";
import { AuditEntity } from "src/modules/project/dtos/auditEntity.dto";
  
  export class ClienResponsetDTO extends BaseDTO {
    @IsString()
    clientName: string;
   
    @IsOptional()
    status:string
  
    @IsString()
    businessName: string;
  
    @IsString()
    @IsEmail()
    pocEmailId: string;
  
    @IsString()
    demography: string;
  
    @IsString()
    industry: string;
  
    @IsString()
    businessEntity: string;
  
    @IsString()
    entitySize: string;
  
    @IsString()
    websiteLink: string;
  
    @IsString()
    pocName: string;

    @IsString()
    pocContactNumber: string;

    @IsString()
    leadershipName: string;

    @IsString()
    leadershipContactNo: string;

    @IsString()
    @IsEmail()
    leadershipEmailId: string;
//    @IsString()
//   createDtTime: Date;

//   @IsString()
//   updateDtTime: Date;


   
  }
  