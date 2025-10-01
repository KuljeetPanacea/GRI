// core/outbox/dtos/outbox-message.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsObject, IsNumber, IsBoolean, IsDate, IsString, IsArray } from 'class-validator';
import { OutboxMessageStatus, OutboxMessageType, ProcessorStatus } from '../model/outbox-message.schema';
import { BaseDTO } from 'src/core/dto/base-dto';


export class OutboxMessageProcessorDTO {
  @IsNotEmpty()
  @IsString()
  processorType: string;
  
  @IsEnum(ProcessorStatus)
  status: ProcessorStatus;
  
  @IsNumber()
  attempts: number;
  
  @IsOptional()
  @IsDate()
  lastAttempt?: Date;
  
  @IsOptional()
  @IsString()
  error?: string;
  
  @IsOptional()
  @IsDate()
  completedAt?: Date;
  
  @IsOptional()
  @IsString()
  jobId?: string;

  @IsOptional()
  @IsBoolean()
  locked: boolean;

  @IsOptional()
  @IsDate()
  lockExpiresAt?: Date;
}

export class OutboxMessageDTO extends BaseDTO {
  @IsNotEmpty()
  @IsEnum(OutboxMessageType)
  type: OutboxMessageType;

  @IsNotEmpty()
  @IsObject()
  payload: Record<string, any>;

  @IsNotEmpty()
  @IsEnum(OutboxMessageStatus)
  status: OutboxMessageStatus;

  @IsOptional()
  @IsObject()
  result?: Record<string, any>;

  @IsOptional()
  @IsString()
  error?: string;

  @IsOptional()
  @IsNumber()
  attempts: number;

  @IsOptional()
  @IsNumber()
  maxAttempts: number;

  @IsOptional()
  @IsDate()
  nextAttemptAt?: Date;

  @IsOptional()
  @IsDate()
  processedAt?: Date;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsBoolean()
  locked: boolean;

  @IsOptional()
  @IsDate()
  lockExpiresAt?: Date;

  @IsOptional()
  @IsString()
  correlationId?: string;
  
  @IsOptional()
  @IsString()
  jobId?: string;
  
  @IsOptional()
  @IsString()
  initiatingUserId?: string;
  
  @IsOptional()
  @IsObject()
  userContext?: {
    userId: string;
    roles: string[];
    permissions: string[];
    isProductAdmin: boolean;
  };
  
  // Domain event specific fields
  @IsOptional()
  @IsString()
  eventType?: string;
  
  @IsOptional()
  @IsArray()
  eventTags?: string[];
  
  @IsOptional()
  @IsArray()
  processors: OutboxMessageProcessorDTO[];
  
  @IsOptional()
  @IsBoolean()
  fullyProcessed: boolean;
  
  @IsOptional()
  @IsString()
  tenantId: string;
}