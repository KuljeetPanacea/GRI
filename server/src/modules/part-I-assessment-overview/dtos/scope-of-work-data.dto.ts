import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ValidatedProductDTO {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() version?: string;
  @IsOptional() @IsString() standard?: string;
  @IsOptional() @IsString() listingReference?: string;
  @IsOptional() @IsString() expiryDate?: string;
}

export class ScopeOfWorkDataDTO {
  @IsOptional() @IsString() ScopeEvaluationDifference_Description?: string;
  @IsOptional() @IsString() AssessorName_ScopeAttestation?: string;
  @IsOptional() @IsString() ExcludedScopeAreas_Description?: string;
  @IsOptional() @IsString() ScopeReductionFactors_Identification?: string;
  @IsOptional() @IsString() SAQEligibilityCriteria_Description?: string;
  @IsOptional() @IsString() AssessorsValidation_AddInfo?: string;
  @IsOptional() @IsBoolean() ScopeReductionSegmentation_Yes?: boolean;
  @IsOptional() @IsBoolean() ScopeReductionSegmentation_No?: boolean;
  @IsOptional() @IsString() AssessorNetworkScope?: string;
  @IsOptional() @IsString() ImplemetedSeg_Desc?: string;
  @IsOptional() @IsString() OutOfScopeEnv_Seg?: string;
  @IsOptional() @IsString() Assessor_SegVerification?: string;
  @IsOptional() @IsBoolean() UsesValidatedPCIProducts_Yes?: boolean;
  @IsOptional() @IsBoolean() UsesValidatedPCIProducts_No?: boolean;
  @IsOptional() @IsString() AssessorName_SolutionImplementation?: string;
  @IsOptional() @IsString() AdditionalComments_Findings?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ValidatedProductDTO)
  ValidatedProducts?: ValidatedProductDTO[];
}
