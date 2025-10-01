import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDAO } from 'src/core/dao/base-dao';
import { LoggerService } from 'src/core/logger';
import { NotificationPreference, NotificationPreferenceDocument } from '../model/notification-preference.schema';
import { NotificationPreferenceDTO } from '../dtos/notification-preference.dto';

@Injectable()
export class NotificationPreferenceDAO extends BaseDAO<NotificationPreferenceDocument, NotificationPreferenceDTO> {
  private logger = LoggerService.getLogger('NotificationPreferenceDAO');

  constructor(
    @InjectModel(NotificationPreference.name) private preferenceModel: Model<NotificationPreferenceDocument>
  ) {
    super(preferenceModel, NotificationPreferenceDTO);
  }

  protected isTenantEntity(): boolean {
    return true; // Preferences are tenant-specific
  }

  protected isSharedEntity(): boolean {
    return false; // Not shared across tenants
  }

  protected isSystemEntity(): boolean {
    return false; // Not a system entity
  }

  protected modelToDTO(model: NotificationPreferenceDocument | null): NotificationPreferenceDTO | null {
    if (!model) return null;
    
    const dto = new NotificationPreferenceDTO();
    dto.id = model._id.toString();
    dto.tenantId = model.tenantId;
    dto.userId = model.userId;
    dto.notificationType = model.notificationType;
    dto.channels = model.channels;
    dto.frequency = model.frequency;
    dto.enabled = model.enabled;
    dto.highPriorityOverride = model.highPriorityOverride;
    dto.quietHoursEnabled = model.quietHoursEnabled;
    dto.quietHoursStart = model.quietHoursStart;
    dto.quietHoursEnd = model.quietHoursEnd;
    dto.timezone = model.timezone;
    dto.createdBy = model.createdBy;
    dto.updatedBy = model.updatedBy;
    dto.createdAt = model.createDtTime;
    dto.updatedAt = model.updateDtTime;
    
    return dto;
  }

  protected modelToDTOArray(models: NotificationPreferenceDocument[]): NotificationPreferenceDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }

  protected dtoToModel(dto: Partial<NotificationPreferenceDTO>): Partial<NotificationPreferenceDocument> {
    if (!dto) return {};
    
    const model: Partial<NotificationPreferenceDocument> = {};
    
    if (dto.tenantId !== undefined) model.tenantId = dto.tenantId;
    if (dto.userId !== undefined) model.userId = dto.userId;
    if (dto.notificationType !== undefined) model.notificationType = dto.notificationType;
    if (dto.channels !== undefined) model.channels = dto.channels;
    if (dto.frequency !== undefined) model.frequency = dto.frequency;
    if (dto.enabled !== undefined) model.enabled = dto.enabled;
    if (dto.highPriorityOverride !== undefined) model.highPriorityOverride = dto.highPriorityOverride;
    if (dto.quietHoursEnabled !== undefined) model.quietHoursEnabled = dto.quietHoursEnabled;
    if (dto.quietHoursStart !== undefined) model.quietHoursStart = dto.quietHoursStart;
    if (dto.quietHoursEnd !== undefined) model.quietHoursEnd = dto.quietHoursEnd;
    if (dto.timezone !== undefined) model.timezone = dto.timezone;
    
    return model;
  }
}