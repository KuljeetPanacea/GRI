import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { CdeType, FileType } from "src/modules/s3/dtos/s3.dto";

export class cdeDocument extends BaseDTO {

   @IsString()
   fileName:string;
 
   @IsEnum(FileType)
   @IsNotEmpty()
   fileType: FileType;
 
   @IsString()
   @IsNotEmpty()
   folderName: string;
 
   @IsString()
   @IsNotEmpty()
   s3Path: string;
 
   @IsString()
   @IsNotEmpty()
   status: string;
 
   @IsDate()
   @Type(() => Date)
   uploadedAt: Date;
 
   @IsString()
   @IsNotEmpty()
   uploadedBy: string;
 
   @IsEnum(CdeType)
   @IsOptional()
   cdeType?: CdeType;
 
   @IsArray()
   @IsOptional()
   @IsString({ each: true })
   tags?: string[];

   @IsArray()
   @IsOptional()
   @IsString({ each: true })
   fileNames?: string[];
   

  
}

export class cdeDocx extends BaseDTO {
 @IsArray()
   @IsOptional()
   @IsString({ each: true })
   fileNames?: string[];
   
@IsString()
@IsNotEmpty()
projectId: string

}