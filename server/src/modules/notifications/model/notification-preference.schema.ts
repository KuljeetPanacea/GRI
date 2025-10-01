import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TenantBaseModel } from 'src/core/model/base-model';
import { NotificationType } from './notification.schema';
import { NotificationChannel } from './notification-delivery.schema';

export enum NotificationFrequency {
    IMMEDIATE = 'IMMEDIATE',
    HOURLY_DIGEST = 'HOURLY_DIGEST',
    DAILY_DIGEST = 'DAILY_DIGEST'
  }
  
  @Schema()
  export class NotificationPreference extends TenantBaseModel {
    @Prop({ required: true })
    userId: string;
    
    @Prop({ enum: NotificationType, required: true })
    notificationType: NotificationType;
    
    @Prop({ type: [String], enum: NotificationChannel, default: [NotificationChannel.EMAIL, NotificationChannel.IN_APP] })
    channels: NotificationChannel[];
    
    @Prop({ enum: NotificationFrequency, default: NotificationFrequency.IMMEDIATE })
    frequency: NotificationFrequency;
    
    @Prop({ default: true })
    enabled: boolean;
    
    @Prop({ default: true })
    highPriorityOverride: boolean;
    
    @Prop({ default: false })
    quietHoursEnabled: boolean;
    
    @Prop()
    quietHoursStart?: string; // Format: HH:MM
    
    @Prop()
    quietHoursEnd?: string; // Format: HH:MM
    
    @Prop({ default: 'UTC' })
    timezone?: string;
  }
  
  export type NotificationPreferenceDocument = NotificationPreference & Document;
  export const NotificationPreferenceSchema = SchemaFactory.createForClass(NotificationPreference);