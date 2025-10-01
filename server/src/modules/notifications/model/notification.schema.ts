import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TenantBaseModel } from 'src/core/model/base-model';

export enum NotificationType {
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  AUDIT_MILESTONE = 'AUDIT_MILESTONE',
  FINDING_CREATED = 'FINDING_CREATED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  CreateProject = 'CreateProject',
  RegisterTenant='RegisterTenant',
  AEPOCCreated = 'AEPOCCreated',
}

export enum NotificationPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
  FAILED = 'FAILED'
}

@Schema()
export class Notification extends TenantBaseModel {
  @Prop({ required: true })
  userId: string;
  
  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;
  
  @Prop({ required: true })
  title: string;
  
  @Prop({ required: true })
  content: string;
  
  @Prop({ required: true, enum: NotificationPriority, default: NotificationPriority.MEDIUM })
  priority: NotificationPriority;
  
  @Prop({ enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;
  
  @Prop({ type: Object })
  data: Record<string, any>;
  
  @Prop()
  categoryCode?: string;
  
  @Prop()
  readAt?: Date;
  
  @Prop()
  deliveredAt?: Date;
  
  @Prop()
  expiresAt?: Date;
  
  @Prop()
  correlationId?: string;
  
  @Prop()
  auditId?: string;
  
  @Prop()
  documentId?: string;
  
  @Prop()
  findingId?: string;
  
  @Prop()
  taskId?: string;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Create indexes
NotificationSchema.index({ userId: 1, readAt: 1 });
NotificationSchema.index({ tenantId: 1, type: 1 });
NotificationSchema.index({ correlationId: 1 });