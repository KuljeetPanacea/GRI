import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';
import { BaseDTO } from 'src/core/dto/base-dto';
import { EvidenceDto } from 'src/modules/assessmentTask/dtos/assessmentTask.dto';

export class IdentifiedGapDTO {
  @IsString()
  gapDesc: string;

  @IsString()
  status: string;

  @IsArray()
  evidences?: EvidenceDto[];

  @IsArray()
  oldEvidence?: EvidenceDto[];

  @IsString()
  resolutionComment?: string
}

export class RocAssetControlDTO extends BaseDTO {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  reqNo: string;

  @IsString()
  @IsNotEmpty()
  subReqNo: string;

  @IsString()
  @IsNotEmpty()
  controlNo: string;

  @IsString()
  @IsNotEmpty()
  AEInternalAssessor: string;

  @IsString()
  @IsNotEmpty()
  deviceType: string;

  @IsString()
  @IsNotEmpty()
  deviceRef: string;

  @IsString()
  @IsNotEmpty()
  qstnrID: string;

  @IsString()
  @IsNotEmpty()
  qstnrName: string;

  @IsString()
  @IsNotEmpty()
  qstnrDesc: string;

  @IsString()
  @IsNotEmpty()
  deviceRefFinding: string

  @IsString()
  @IsNotEmpty()
  AIResponseSummary: string;

  @IsArray()
  @IsOptional()
  identifiedGaps?: IdentifiedGapDTO[];

  @IsArray()
  evidences: EvidenceDto[];

  @IsString()
  @IsOptional()
  assessmentId?: string;

  @IsOptional()
  @IsString()
  evidenceReference?: string;
}
