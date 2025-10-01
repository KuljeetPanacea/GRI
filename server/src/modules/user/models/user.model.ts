import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { TenantBaseModel } from "src/core/model/base-model";
import { Role } from "src/core/model/role.model";

@Schema()
export class User extends TenantBaseModel  {
  @Prop({ required: true, unique: true })
  public email: string;

  @Prop({ required: true })
  public username: string;

  @Prop({ required: true })
  public password: string;

  @Prop()
  public name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: mongoose.Types.ObjectId[] | Role[];

  @Prop({ required: true })
  public tenantId: string;

  @Prop({required: true})
  public countryCode:number;

  @Prop({required: true})
  public mobileNumber:number;

  @Prop({ required: false, default: 'active'})
  public status: string;

  @Prop({required: true})
  public createdBy: string;

  @Prop()
  public defaultPasswordchange?: boolean;

  @Prop()
  public otp?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
