import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDAO } from 'src/core/dao/base-dao';
import { LoggerService } from 'src/core/logger';
import { NotificationDocument, NotificationStatus, Notification } from '../model/notification.schema';
import { NotificationDTO } from '../dtos/notification.dto';

@Injectable()
export class NotificationDAO extends BaseDAO<NotificationDocument, NotificationDTO> {
  private logger = LoggerService.getLogger('NotificationDAO');

  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {
    super(notificationModel, NotificationDTO);
  }

  protected isTenantEntity(): boolean {
    return true; // Notification is tenant-specific
  }

  protected isSharedEntity(): boolean {
    return false; // Not shared across tenants
  }

  protected isSystemEntity(): boolean {
    return false; // Not a system entity
  }

  protected modelToDTO(model: NotificationDocument | null): NotificationDTO | null {
    if (!model) return null;
    
    const dto = new NotificationDTO();
    dto.id = model._id.toString();
    dto.userId = model.userId;
    dto.tenantId = model.tenantId;
    dto.type = model.type;
    dto.title = model.title;
    dto.content = model.content;
    dto.priority = model.priority;
    dto.status = model.status;
    dto.data = model.data;
    dto.categoryCode = model.categoryCode;
    dto.readAt = model.readAt;
    dto.deliveredAt = model.deliveredAt;
    dto.expiresAt = model.expiresAt;
    dto.correlationId = model.correlationId;
    dto.auditId = model.auditId;
    dto.documentId = model.documentId;
    dto.findingId = model.findingId;
    dto.taskId = model.taskId;
    dto.createdBy = model.createdBy;
    dto.updatedBy = model.updatedBy;
    dto.createdAt = model.createDtTime;
    dto.updatedAt = model.updateDtTime;
    
    return dto;
  }

  protected modelToDTOArray(models: NotificationDocument[]): NotificationDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }

  protected dtoToModel(dto: Partial<NotificationDTO>): Partial<NotificationDocument> {
    if (!dto) return {};
    
    const model: Partial<NotificationDocument> = {};
    
    if (dto.userId !== undefined) model.userId = dto.userId;
    if (dto.tenantId !== undefined) model.tenantId = dto.tenantId;
    if (dto.type !== undefined) model.type = dto.type;
    if (dto.title !== undefined) model.title = dto.title;
    if (dto.content !== undefined) model.content = dto.content;
    if (dto.priority !== undefined) model.priority = dto.priority;
    if (dto.status !== undefined) model.status = dto.status;
    if (dto.data !== undefined) model.data = dto.data;
    if (dto.categoryCode !== undefined) model.categoryCode = dto.categoryCode;
    if (dto.readAt !== undefined) model.readAt = dto.readAt;
    if (dto.deliveredAt !== undefined) model.deliveredAt = dto.deliveredAt;
    if (dto.expiresAt !== undefined) model.expiresAt = dto.expiresAt;
    if (dto.correlationId !== undefined) model.correlationId = dto.correlationId;
    if (dto.auditId !== undefined) model.auditId = dto.auditId;
    if (dto.documentId !== undefined) model.documentId = dto.documentId;
    if (dto.findingId !== undefined) model.findingId = dto.findingId;
    if (dto.taskId !== undefined) model.taskId = dto.taskId;
    
    return model;
  }

  async getUnreadCount(userId: string, tenantId: string): Promise<number> {
    return this.count({
      userId,
      tenantId,
      readAt: null
    });
  }

  async markAllAsRead(userId: string, tenantId: string): Promise<number> {
    return this.updateMany(
      {
        userId,
        tenantId,
        readAt: null
      },
      {
        readAt: new Date(),
        status: NotificationStatus.READ
      }
    );
  }
}