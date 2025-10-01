import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';
import { BaseDTO } from 'src/core/dto/base-dto';
import { EvidenceDto } from 'src/modules/assessmentTask/dtos/assessmentTask.dto';

export class RocAssetControlQstnDTO extends BaseDTO {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  controlNo: string;

  @IsString()
  @IsNotEmpty()
  deviceRef: string;

  @IsString()
  @IsNotEmpty()
  qstnID: string;

  @IsString()
  @IsNotEmpty()
  qstnDesc: string;

  @IsString()
  @IsNotEmpty()
  response: string

  @IsArray()
  @IsNotEmpty()
  evidences: EvidenceDto[]

  @IsOptional()
  @IsString()
  evidenceReference?: string;
}
