import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SharedBaseModel, TenantBaseModel } from 'src/core/model/base-model';


export enum OutboxMessageType {
  EMAIL = 'EMAIL',
  S3_UPLOAD = 'S3_UPLOAD',
  BULL_TASK = 'BULL_TASK',
  RABBITMQ_MESSAGE = 'RABBITMQ_MESSAGE',
  // Domain event type
  DOMAIN_EVENT = 'DOMAIN_EVENT'
}

export enum OutboxMessageStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum ProcessorStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Processor tracking for multiple consumers of the same event
@Schema()
export class OutboxMessageProcessor {
  @Prop({ required: true })
  processorType: string;  // 'notification', 'ai', 'audit', etc.
  
  @Prop({ required: true, enum: ProcessorStatus, default: ProcessorStatus.PENDING })
  status: ProcessorStatus;
  
  @Prop({ default: 0 })
  attempts: number;
  
  @Prop()
  lastAttempt?: Date;
  
  @Prop()
  error?: string;
  
  @Prop()
  completedAt?: Date;
  
  @Prop()
  jobId?: string;

  @Prop({ default: false })
  locked: boolean;

  @Prop()
  lockExpiresAt?: Date;
}

@Schema()
export class OutboxMessage extends TenantBaseModel {
  @Prop({ required: true, enum: OutboxMessageType })
  type: OutboxMessageType;

  @Prop({ required: true, type: Object })
  payload: Record<string, any>;

  @Prop({ required: true, enum: OutboxMessageStatus, default: OutboxMessageStatus.PENDING })
  status: OutboxMessageStatus;

  @Prop({ type: Object })
  result?: Record<string, any>;

  @Prop()
  error?: string;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ default: 5 })
  maxAttempts: number;

  @Prop({ type: Date })
  nextAttemptAt?: Date;

  @Prop({ type: Date })
  processedAt?: Date;

  @Prop({ default: 0 })
  priority: number;

  @Prop({ default: false })
  locked: boolean;

  @Prop()
  lockExpiresAt?: Date;

  @Prop()
  correlationId?: string;
  
  @Prop({ default: null })
  jobId?: string;
  
  // User context information for audit and processing
  @Prop()
  initiatingUserId?: string;
  
  @Prop({ type: Object })
  userContext?: {
    userId: string;
    roles: string[];
    permissions: string[];
    isProductAdmin: boolean;
  };

  // Domain event specific fields
  @Prop()
  eventType?: string;  // e.g., 'DocumentUploaded', 'FindingCreated'
  
  @Prop({ type: [String], default: [] })
  eventTags?: string[];
  
  // Track multiple processors for a single event
  @Prop({ type: [Object], default: [] })
  processors: OutboxMessageProcessor[];
  
  // Flag to track if event is fully processed by all processors
  @Prop({ default: false })
  fullyProcessed: boolean;
}

export type OutboxMessageDocument = OutboxMessage & Document;
export const OutboxMessageSchema = SchemaFactory.createForClass(OutboxMessage);

// Create indexes
OutboxMessageSchema.index({ status: 1, jobId: 1 }, { name: 'outbox_processor_idx' });
OutboxMessageSchema.index({ correlationId: 1 });
OutboxMessageSchema.index({ createDtTime: 1 });
OutboxMessageSchema.index({ initiatingUserId: 1 });
OutboxMessageSchema.index({ eventType: 1 });
OutboxMessageSchema.index({ 'processors.processorType': 1, 'processors.status': 1 });