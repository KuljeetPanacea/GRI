import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { SharedBaseModel, TenantBaseModel } from 'src/core/model/base-model';
import { NotificationType } from './notification.schema';
import { NotificationChannel } from './notification-delivery.schema';

@Schema()
export class NotificationTemplate extends TenantBaseModel {
//   @Prop()
//   tenantId?: string; // Optional - null for system templates
  
  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;
  
  @Prop({ required: true, enum: NotificationChannel })
  channel: NotificationChannel;
  
  @Prop()
  subject?: string; // For email
  
  @Prop({ required: true })
  contentTemplate: string;
  
  @Prop()
  titleTemplate?: string;
  
  @Prop()
  whatsappTemplateName?: string; // For WhatsApp API templates
  
  @Prop({ default: true })
  active: boolean;
  
  @Prop({ type: Object })
  defaultMetadata?: Record<string, any>;
}

export type NotificationTemplateDocument = NotificationTemplate & Document;
export const NotificationTemplateSchema = SchemaFactory.createForClass(NotificationTemplate);