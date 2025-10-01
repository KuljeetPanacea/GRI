import { IsBoolean, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CompanyDTO {
  @IsString() name: string;
  @IsOptional() @IsString() dba?: string;
  @IsOptional() @IsString() mailingAddress?: string;
  @IsOptional() @IsString() website?: string;
}

export class ContactDTO {
  @IsString() name: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
}

export class InternalSecurityAssessorDTO {
  @IsOptional() @IsString() name?: string;
}

export class QsaCompanyDTO {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() mailingAddress?: string;
  @IsOptional() @IsString() website?: string;
}

export class LeadAssessorDTO {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() certificateId?: string;
}

export class AssociateQSADTO{
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() mentorName?: string;
}

export class AssociateAssessorDTO {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() mentorName?: string;
  @IsOptional() @IsString() certificateId?: string;
}

export class QaReviewerDTO {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() credentials?: string;
}

export class AssessmentDatesDTO {
  @IsOptional() @IsString() reportDate?: string;
  @IsOptional() @IsString() startDate?: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() @IsString() onsiteDays?: string;
}

export class RemoteAssessmentDTO {
  @IsBoolean() performedOnsite: boolean;
  @IsBoolean() performedRemotely: boolean;
  @IsBoolean() combinationRemoteOnsite: boolean;
  @IsOptional() @IsString() justificationIfRemote?: string;
}

export class QsaServicesDTO {
  @IsBoolean() consultationProvided: boolean;
  @IsBoolean() consultationNotProvided: boolean;
  @IsOptional() @IsString() consultationDetails?: string;
  @IsOptional() @IsString() additionalServicesReviewed?: string;
  @IsOptional() @IsString() conflictMitigation?: string;
}

export class SubcontractingDTO {
  @IsBoolean() used: boolean;
  @IsBoolean() notUsed: boolean;
  @IsOptional() @IsString() description?: string;
}

export class HistoryDTO {
  @IsOptional() @IsString() consecutiveRocYears?: string;
}

export class AssessmentScopeDTO {
  @IsBoolean() fullAssessment: boolean;
  @IsBoolean() partialAssessment: boolean;
}

export class AssessmentOutcomeDTO {
  @IsBoolean() compliant: boolean;
  @IsBoolean() nonCompliant: boolean;
  @IsBoolean() legalExceptionCompliant: boolean;
}

export class AssessmentSubReqDTO {
  @IsOptional() @IsString() notApplicable?: string;
  @IsOptional() @IsString() notTested?: string;
  @IsOptional() @IsString() notInPlaceLegal?: string;
  @IsOptional() @IsString() notInPlaceNotLegal?: string;
  @IsOptional() @IsString() compensatingControl?: string;
  @IsOptional() @IsString() customizedApproach?: string;
}

export class RequirementFindingDTO {
  @IsString() finding: 'NotTested' | 'NotInPlace' | 'NotApplicable' | 'InPlace';
  @IsOptional() @IsBoolean() customizedApproach?: boolean;
  @IsOptional() @IsBoolean() compensatingControl?: boolean;
}

export class ContactInfoDataDTO {
  @ValidateNested() @Type(() => CompanyDTO) company: CompanyDTO;
  @ValidateNested() @Type(() => ContactDTO) contact: ContactDTO;
  @ValidateNested() @Type(() => InternalSecurityAssessorDTO) internalSecurityAssessor: InternalSecurityAssessorDTO;
  @ValidateNested() @Type(() => QsaCompanyDTO) qsaCompany: QsaCompanyDTO;
  @ValidateNested() @Type(() => LeadAssessorDTO) leadAssessor: LeadAssessorDTO;
  @ValidateNested() @Type(() => AssociateQSADTO) associateQSA: AssociateQSADTO;
  @ValidateNested() @Type(() => AssociateAssessorDTO) associateAssessor: AssociateAssessorDTO;
  @ValidateNested() @Type(() => QaReviewerDTO) qaReviewer: QaReviewerDTO;
  @ValidateNested() @Type(() => AssessmentDatesDTO) assessmentDates: AssessmentDatesDTO;
  @ValidateNested() @Type(() => RemoteAssessmentDTO) remoteAssessment: RemoteAssessmentDTO;
  @ValidateNested() @Type(() => QsaServicesDTO) qsaServices: QsaServicesDTO;
  @ValidateNested() @Type(() => SubcontractingDTO) subcontracting: SubcontractingDTO;
  @ValidateNested() @Type(() => HistoryDTO) history: HistoryDTO;
  @ValidateNested() @Type(() => AssessmentScopeDTO) assessmentScope: AssessmentScopeDTO;
  @ValidateNested() @Type(() => AssessmentOutcomeDTO) assessmentOutcome: AssessmentOutcomeDTO;
  @ValidateNested() @Type(() => AssessmentSubReqDTO) assessmentSubReq: AssessmentSubReqDTO;
  @IsOptional() assessmentFindings?: Record<string, RequirementFindingDTO>;
}
