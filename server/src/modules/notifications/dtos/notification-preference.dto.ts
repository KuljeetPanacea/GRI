import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsBoolean,
  IsArray,
} from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { NotificationType } from "../model/notification.schema";
import { NotificationChannel } from "../model/notification-delivery.schema";
import { NotificationFrequency } from "../model/notification-preference.schema";

export class NotificationPreferenceDTO extends BaseDTO {
  @IsString()
  userId: string;

  @IsEnum(NotificationType)
  notificationType: NotificationType;

  @IsArray()
  channels: NotificationChannel[];

  @IsEnum(NotificationFrequency)
  frequency: NotificationFrequency;

  @IsBoolean()
  enabled: boolean;

  @IsBoolean()
  highPriorityOverride: boolean;

  @IsBoolean()
  quietHoursEnabled: boolean;

  @IsOptional()
  @IsString()
  quietHoursStart?: string;

  @IsOptional()
  @IsString()
  quietHoursEnd?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  tenantId: string;
}
