import { IsString, IsOptional, IsDate, IsEnum } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import {
  DeliveryStatus,
  NotificationChannel,
} from "../model/notification-delivery.schema";

export class NotificationDeliveryDTO extends BaseDTO {
  @IsString()
  notificationId: string;

  @IsString()
  userId: string;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;

  @IsOptional()
  @IsDate()
  deliveredAt?: Date;

  @IsOptional()
  @IsDate()
  readAt?: Date;

  @IsOptional()
  @IsString()
  error?: string;

  @IsOptional()
  @IsString()
  outboxMessageId?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  tenantId: string;
}
