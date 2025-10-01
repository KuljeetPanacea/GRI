import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDAO } from 'src/core/dao/base-dao';
import { NotificationDelivery, NotificationDeliveryDocument } from '../model/notification-delivery.schema';
import { LoggerService } from 'src/core/logger';
import { NotificationDeliveryDTO } from '../dtos/notification-delivery.dto';

@Injectable()
export class NotificationDeliveryDAO extends BaseDAO<NotificationDeliveryDocument, NotificationDeliveryDTO> {
  private logger = LoggerService.getLogger('NotificationDeliveryDAO');

  constructor(@InjectModel(NotificationDelivery.name) private deliveryModel: Model<NotificationDeliveryDocument>) {
    super(deliveryModel, NotificationDeliveryDTO);
  }

  protected isTenantEntity(): boolean {
    return true; // Delivery records are tenant-specific
  }

  protected isSharedEntity(): boolean {
    return false; // Not shared across tenants
  }

  protected isSystemEntity(): boolean {
    return false; // Not a system entity
  }

  protected modelToDTO(model: NotificationDeliveryDocument | null): NotificationDeliveryDTO | null {
    if (!model) return null;
    
    const dto = new NotificationDeliveryDTO();
    dto.id = model._id.toString();
    dto.tenantId = model.tenantId;
    dto.notificationId = model.notificationId.toString();
    dto.userId = model.userId;
    dto.channel = model.channel;
    dto.status = model.status;
    dto.deliveredAt = model.deliveredAt;
    dto.readAt = model.readAt;
    dto.error = model.error;
    dto.outboxMessageId = model.outboxMessageId;
    dto.createdBy = model.createdBy;
    dto.updatedBy = model.updatedBy;
    dto.createdAt = model.createDtTime;
    dto.updatedAt = model.updateDtTime;
    
    return dto;
  }

  protected modelToDTOArray(models: NotificationDeliveryDocument[]): NotificationDeliveryDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }

  protected dtoToModel(dto: Partial<NotificationDeliveryDTO>): Partial<NotificationDeliveryDocument> {
    if (!dto) return {};
    
    const model: Partial<NotificationDeliveryDocument> = {};
    
    if (dto.tenantId !== undefined) model.tenantId = dto.tenantId;
    if (dto.notificationId !== undefined) model.notificationId = dto.notificationId as any;
    if (dto.userId !== undefined) model.userId = dto.userId;
    if (dto.channel !== undefined) model.channel = dto.channel;
    if (dto.status !== undefined) model.status = dto.status;
    if (dto.deliveredAt !== undefined) model.deliveredAt = dto.deliveredAt;
    if (dto.readAt !== undefined) model.readAt = dto.readAt;
    if (dto.error !== undefined) model.error = dto.error;
    if (dto.outboxMessageId !== undefined) model.outboxMessageId = dto.outboxMessageId;
    
    return model;
  }

  async findByNotificationId(notificationId: string): Promise<NotificationDeliveryDTO[]> {
    return this.find({ notificationId });
  }
}