import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseModel } from "./base-model";
import { MainNavMenuDTO } from "../dto/mainNavMenu.dto";

export type RoleDocument = Role & Document;

@Schema()
export class Role extends BaseModel {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({type: [], default:[]})
  mainNavMenu: MainNavMenuDTO[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
