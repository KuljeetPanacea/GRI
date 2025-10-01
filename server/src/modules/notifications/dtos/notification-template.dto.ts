import { IsString, IsOptional, IsDate, IsEnum, IsBoolean, IsObject } from 'class-validator';
import { BaseDTO } from 'src/core/dto/base-dto';
import { NotificationType } from '../model/notification.schema';
import { NotificationChannel } from '../model/notification-delivery.schema';

export class NotificationTemplateDTO extends BaseDTO {
  @IsOptional()
  @IsString()
  tenantId?: string;
  
  @IsEnum(NotificationType)
  type: NotificationType;
  
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;
  
  @IsOptional()
  @IsString()
  subject?: string;
  
  @IsString()
  contentTemplate: string;
  
  @IsOptional()
  @IsString()
  titleTemplate?: string;
  
  @IsOptional()
  @IsString()
  whatsappTemplateName?: string;
  
  @IsBoolean()
  active: boolean = true;
  
  @IsOptional()
  @IsObject()
  defaultMetadata?: Record<string, any>;
  
  @IsOptional()
  @IsDate()
  createdAt?: Date;
  
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}