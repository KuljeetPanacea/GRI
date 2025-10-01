import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsBoolean,
  IsObject,
} from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import {
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from "../model/notification.schema";

export class NotificationDTO extends BaseDTO {
  @IsString()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(NotificationPriority)
  priority: NotificationPriority;

  @IsEnum(NotificationStatus)
  status: NotificationStatus;

  @IsObject()
  data: Record<string, any>;

  @IsOptional()
  @IsString()
  categoryCode?: string;

  @IsOptional()
  @IsDate()
  readAt?: Date;

  @IsOptional()
  @IsDate()
  deliveredAt?: Date;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  auditId?: string;

  @IsOptional()
  @IsString()
  documentId?: string;

  @IsOptional()
  @IsString()
  findingId?: string;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  tenantId: string;
}
