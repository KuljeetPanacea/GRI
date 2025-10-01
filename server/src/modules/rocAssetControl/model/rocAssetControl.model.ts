import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TenantBaseModel } from 'src/core/model/base-model';
import { EvidenceDto } from 'src/modules/assessmentTask/dtos/assessmentTask.dto';



export class IdentifiedGap {
  @Prop({ required: true })
  gapDesc: string;
 
  @Prop({ required: true })
  status: string;
 
  @Prop({ required: false })
  evidences?: EvidenceDto[];

  @Prop({ required: false })
  oldEvidence?: EvidenceDto[];

  @Prop({ required: false })
  resolutionComment?: string
}

@Schema()
export class RocAssetControl extends TenantBaseModel {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  reqNo: string;

  @Prop({ required: true })
  subReqNo: string;

  @Prop({ required: true })
  controlNo: string;

  @Prop({ required: true })
  AEInternalAssessor: string;

  @Prop({ required: true })
  deviceType: string;

  @Prop({ required: true })
  deviceRef: string;

  @Prop({ required: true })
  qstnrID: string;

  @Prop({ required: true })
  qstnrName: string;

  @Prop({ required: false })
  qstnrDesc: string;

  @Prop({ required: false })
  deviceRefFinding: string;

  @Prop({ required: false })
  AIResponseSummary: string;

  @Prop({ required: false })
  assessmentId?: string;

  @Prop({ required: false })
  identifiedGaps?: IdentifiedGap[];

  @Prop({ required: false })
  evidences: EvidenceDto[];

  @Prop({ type: String, required: false })
  evidenceReference?: string;
}

export type RocAssetControlDocument = RocAssetControl & Document;
export const RocAssetControlSchema = SchemaFactory.createForClass(RocAssetControl);
