import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TenantBaseModel } from 'src/core/model/base-model';
import { EvidenceDto } from 'src/modules/assessmentTask/dtos/assessmentTask.dto';



@Schema()
export class RocAssetControlQstn extends TenantBaseModel {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  controlNo: string;

  @Prop({ required: true })
  deviceRef: string;

  @Prop({ required: true })
  qstnID: string;

  @Prop({ required: true })
  qstnDesc: string;

  @Prop({ required: true })
  response: string;

  @Prop({ required: false })
  evidences?: EvidenceDto[];

  @Prop({ type: String, required: false })
  evidenceReference?: string;
}

export type RocAssetControlQstnDocument = RocAssetControlQstn & Document;
export const RocAssetControlQstnSchema = SchemaFactory.createForClass(RocAssetControlQstn);
