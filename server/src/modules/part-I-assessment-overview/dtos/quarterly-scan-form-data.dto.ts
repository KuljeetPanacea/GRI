import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ExternalScanDTO {
  @IsOptional() @IsString() QuarterlyASVScanDates?: string;
  @IsOptional() @IsString() ASVNamePerformingScan?: string;
  @IsOptional() @IsBoolean() VulnerabilitiesFoundFailedInitialScan_Yes?: boolean;
  @IsOptional() @IsBoolean() VulnerabilitiesFoundFailedInitialScan_No?: boolean;
  @IsOptional() @IsString() RescanDatesAfterVulnerabilitiesCorrected?: string;
}

class InternalScanDTO {
  @IsOptional() @IsString() QuarterlyInternalVulnerabilityScanDates?: string;
  @IsOptional() @IsBoolean() AuthenticatedScanPerformed_Yes?: boolean;
  @IsOptional() @IsBoolean() AuthenticatedScanPerformed_No?: boolean;
  @IsOptional() @IsBoolean() HighRiskCriticalVulnerabilitiesFound_Yes?: boolean;
  @IsOptional() @IsBoolean() HighRiskCriticalVulnerabilitiesFound_No?: boolean;
  @IsOptional() @IsString() RescanDates_CorrectedVulnerabilities?: string;
}

export class QuarterlyScanFormDataDTO {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExternalScanDTO)
  externalScans?: ExternalScanDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InternalScanDTO)
  internalScans?: InternalScanDTO[];

  @IsOptional() @IsBoolean() Initial_Assessment_Yes?: boolean;
  @IsOptional() @IsBoolean() Initial_Assessment_No?: boolean;
  @IsOptional() @IsString() QuarterlyScanDocName?: string;
  @IsOptional() @IsString() External_Scan_AssessorComments?: string;
  @IsOptional() @IsBoolean() isASVScanCompliant_Yes?: boolean;
  @IsOptional() @IsBoolean() isASVScanCompliant_No?: boolean;
  @IsOptional() @IsBoolean() Internal_InitialCompliant_Yes?: boolean;
  @IsOptional() @IsBoolean() Internal_InitialCompliant_No?: boolean;
  @IsOptional() @IsString() InternalScanPolicyDocName?: string;
  @IsOptional() @IsString() Internal_Scan_AssessorComments?: string;
}
