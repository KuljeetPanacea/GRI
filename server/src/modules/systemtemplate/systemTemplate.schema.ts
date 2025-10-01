import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SharedBaseModel } from 'src/core/model/base-model';

@Schema()
export class SystemTemplate extends SharedBaseModel { 
  @Prop({ required: true})
  type: string;
  
  @Prop()
  subject: string;
  
  @Prop({ required: true })
  contentTemplate: string;
  
  @Prop()
  titleTemplate?: string;
  
  @Prop({ default: true })
  active: boolean;
  
  @Prop({ type: Object })
  defaultMetadata?: Record<string, any>;
}

export type SystemTemplateDocument = SystemTemplate & Document;
export const SystemTemplateSchema = SchemaFactory.createForClass(SystemTemplate);