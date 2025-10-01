import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { TenantBaseModel } from 'src/core/model/base-model';
import { NotificationFrequency } from './notification-preference.schema';

@Schema()
export class NotificationDigestQueue extends TenantBaseModel {
  @Prop({ required: true })
  userId: string;
  
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Notification', default: [] })
  notifications: mongoose.Types.ObjectId[];
  
  @Prop({ required: true, enum: NotificationFrequency })
  digestType: NotificationFrequency;
  
  @Prop({ required: true })
  scheduledFor: Date;
  
  @Prop({ default: false })
  processed: boolean;
}

export type NotificationDigestQueueDocument = NotificationDigestQueue & Document;
export const NotificationDigestQueueSchema = SchemaFactory.createForClass(NotificationDigestQueue);