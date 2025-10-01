import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDAO } from 'src/core/dao/base-dao';
import { NotificationDigestQueue, NotificationDigestQueueDocument } from '../model/notification-digest-queue.schema';
import { LoggerService } from 'src/core/logger';
import { NotificationDigestQueueDTO } from '../dtos/notification-digest-queue.dto';

@Injectable()
export class NotificationDigestQueueDAO extends BaseDAO<NotificationDigestQueueDocument, NotificationDigestQueueDTO> {
  private logger = LoggerService.getLogger('NotificationDigestQueueDAO');

  constructor(
    @InjectModel(NotificationDigestQueue.name) private digestQueueModel: Model<NotificationDigestQueueDocument>
  ) {
    super(digestQueueModel, NotificationDigestQueueDTO);
  }

  protected isTenantEntity(): boolean {
    return true; // Digest queues are tenant-specific
  }

  protected isSharedEntity(): boolean {
    return false; // Not shared across tenants
  }

  protected isSystemEntity(): boolean {
    return false; // Not a system entity
  }

  protected modelToDTO(model: NotificationDigestQueueDocument | null): NotificationDigestQueueDTO | null {
    if (!model) return null;
    
    const dto = new NotificationDigestQueueDTO();
    dto.id = model._id.toString();
    dto.tenantId = model.tenantId;
    dto.userId = model.userId;
    dto.notifications = model.notifications.map(id => id.toString());
    dto.digestType = model.digestType;
    dto.scheduledFor = model.scheduledFor;
    dto.processed = model.processed;
    dto.createdBy = model.createdBy;
    dto.updatedBy = model.updatedBy;
    dto.createdAt = model.createDtTime;
    dto.updatedAt = model.updateDtTime;
    
    return dto;
  }

  protected modelToDTOArray(models: NotificationDigestQueueDocument[]): NotificationDigestQueueDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }

  protected dtoToModel(dto: Partial<NotificationDigestQueueDTO>): Partial<NotificationDigestQueueDocument> {
    if (!dto) return {};
    
    const model: Partial<NotificationDigestQueueDocument> = {};
    
    if (dto.tenantId !== undefined) model.tenantId = dto.tenantId;
    if (dto.userId !== undefined) model.userId = dto.userId;
    if (dto.notifications !== undefined) model.notifications = dto.notifications as any;
    if (dto.digestType !== undefined) model.digestType = dto.digestType;
    if (dto.scheduledFor !== undefined) model.scheduledFor = dto.scheduledFor;
    if (dto.processed !== undefined) model.processed = dto.processed;
    
    return model;
  }

  async findDueDigests(): Promise<NotificationDigestQueueDTO[]> {
    return this.find({
      scheduledFor: { $lte: new Date() },
      processed: false
    });
  }

  async addNotificationToDigest(digestId: string, notificationId: string): Promise<boolean> {
    const result = await this.model.updateOne(
      { _id: digestId },
      { $addToSet: { notifications: notificationId } }
    );
    
    return result.modifiedCount > 0;
  }
}