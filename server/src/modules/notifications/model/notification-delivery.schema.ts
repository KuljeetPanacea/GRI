import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { TenantBaseModel } from 'src/core/model/base-model';

export enum NotificationChannel {
    EMAIL = 'EMAIL',
    IN_APP = 'IN_APP',
    WHATSAPP = 'WHATSAPP'
  }
  
  export enum DeliveryStatus {
    PENDING = 'PENDING',
    QUEUED = 'QUEUED',
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    READ = 'READ',
    FAILED = 'FAILED'
  }
  
  @Schema()
  export class NotificationDelivery extends TenantBaseModel {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true })
    notificationId: mongoose.Types.ObjectId;
    
    @Prop({ required: true })
    userId: string;
    
    @Prop({ required: true, enum: NotificationChannel })
    channel: NotificationChannel;
    
    @Prop({ required: true, enum: DeliveryStatus, default: DeliveryStatus.PENDING })
    status: DeliveryStatus;
    
    @Prop()
    deliveredAt?: Date;
    
    @Prop()
    readAt?: Date;
    
    @Prop()
    error?: string;
    
    @Prop()
    outboxMessageId?: string;
  }
  
  export type NotificationDeliveryDocument = NotificationDelivery & Document;
  export const NotificationDeliverySchema = SchemaFactory.createForClass(NotificationDelivery);