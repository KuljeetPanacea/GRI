import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseModel } from "../../../core/model/base-model";

export type TenantDocument = Tenant & Document;

@Schema()
export class Tenant extends BaseModel {
  @Prop({ required: false })
  tenantId?: string;

  @Prop({ required: true })
  tenantName: string;

  @Prop({ required: true, unique: true })
  tenantEmail: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: false, type: Date, default: Date.now })
  createDtTime?: Date;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  tenantPhoneCountryCode: number;

  @Prop({ required: true })
  tenantPhone: number;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
