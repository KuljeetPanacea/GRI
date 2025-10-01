import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsBoolean,
  IsArray,
} from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { NotificationFrequency } from "../model/notification-preference.schema";

export class NotificationDigestQueueDTO extends BaseDTO {
  @IsString()
  userId: string;

  @IsArray()
  notifications: string[];

  @IsEnum(NotificationFrequency)
  digestType: NotificationFrequency;

  @IsDate()
  scheduledFor: Date;

  @IsBoolean()
  processed: boolean = false;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  tenantId: string;
}
