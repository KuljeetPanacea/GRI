import { IsString, IsNotEmpty, IsOptional, IsDate, IsEnum, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { BaseDTO } from "src/core/dto/base-dto";

export enum FileType {
  EVIDENCE = 'evidence',
  DOCUMENT = 'document',
}

export enum CdeType {
  ASSET_INVENTORY = 'assetInventory',
  DATA_FLOW = 'dataFlow',
  NETWORK_DIAGRAM = 'networkDiagram',
}

export class S3DTO extends BaseDTO {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsEnum(FileType)
  @IsNotEmpty()
  fileType: FileType;

  @IsString()
  @IsNotEmpty()
  fileName: string;

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
}
