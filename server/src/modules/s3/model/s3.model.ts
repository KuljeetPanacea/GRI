import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { TenantBaseModel } from "src/core/model/base-model";

@Schema()
export class S3 extends TenantBaseModel {

  @Prop({ required: true })
  public projectId: string;

  @Prop({ required: true, enum: ['evidence', 'document'] })
  public fileType: 'evidence' | 'document';

  @Prop({ required: true,unique: true })
  public fileName: string;

  @Prop({ required: true })
  public s3Path: string;

  @Prop({ required: true })
  public status: string;

  @Prop({ required: true })
  public uploadedAt: Date;

  @Prop({ required: true })
  public uploadedBy: string;

  @Prop({ enum: ['assetInventory', 'dataFlow', 'networkDiagram'], required: false })
  public cdeType?: 'assetInventory' | 'dataFlow' | 'networkDiagram';

  @Prop({ type: [String], required: false })
  public tags?: string[];
}

export type S3Document = S3 & Document;
export const S3Schema = SchemaFactory.createForClass(S3);
