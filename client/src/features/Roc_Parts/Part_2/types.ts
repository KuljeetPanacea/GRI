// types.ts

export interface TestingProcedure {
  id: string;
  description: string;
  reportingInstructions?: ReportingInstruction[];
}

export interface ReportingInstruction {
  id: string;
  description: string;
  evidenceReference?: string;
  testingProcedure?: string;
}

export interface AssessmentEvidenceRow {
  AEvidenceRefNo: string;
  ATitle_Evidence: string;
  ATopicsCovered: string;
  ASampleSetRefNo: string;
}

// Structure-only control
export interface ControlStructure {
  id: number;
  title: string;
  desc?:string;
  assessmentDesc?: string; 
  requirements?: string[];
  testingProcedures?: TestingProcedure[];
}

export interface SubRequirement {
  subReqId: string;
  subReqTitle: string;
  controls: ControlStructure[];
}

export interface Requirement {
  reqId: string;
  reqTitle: string;
  subReqs: SubRequirement[];
}

export interface PCIDSSStructure {
  requirements: Requirement[];
}

export interface evidence{
  name: string;
  url: string;
  evidenceCategory: string;
  refName: string;
  testingProcedure: string;
}
// Answers-only control
export interface ControlAnswer {
  controlNo?: string;
  controlAssessmentFinding?: 'In Place' | 'Not Applicable' | 'Not Tested' | 'Not in Place';
  compensatingControl?: boolean;
  customizedApproach?: boolean;
  detailed_finding?: string;
  evidences?: evidence[];
}

export interface AssessorResponseDto{
  id: number;
  comment?: string;
  evidenceCategory?: string;
  refName?: string;
  reportingInstructionId: string;
}

export interface AppendixA{
  title?: string;
  assessmentFinding?: 'In Place' | 'Not Applicable' | 'Not Tested' | 'Not in Place';
  compensatingControl?: boolean;
  customizedApproach?: boolean;
  assessmentFindingDesc?: string;
  assessorResponse?: AssessorResponseDto[];
}

export interface PCIDSSAnswers {
  findings: ControlAnswer[];
}

// Merged version (for rendering)
export type MergedControl = ControlStructure & ControlAnswer;

export type AppendixMergedControl = ControlStructure & AppendixA

export interface MergedSubRequirement {
  subReqId: number;
  subReqTitle: string;
  subReqDesc?: string;
  controls: MergedControl[];
}

export interface MergedRequirement {
  reqId: number;
  reqTitle: string;
  reqDesc?: string;
  subReq: MergedSubRequirement[];
  control: ControlStructure;
}

export interface MergedPCIDSSData {
  requirements: MergedRequirement[];
}
