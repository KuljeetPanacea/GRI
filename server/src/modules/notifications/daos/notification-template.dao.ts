import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDAO } from 'src/core/dao/base-dao';
import { NotificationTemplate, NotificationTemplateDocument } from '../model/notification-template.schema';
import { LoggerService } from 'src/core/logger';
import { NotificationTemplateDTO } from '../dtos/notification-template.dto';

@Injectable()
export class NotificationTemplateDAO extends BaseDAO<NotificationTemplateDocument, NotificationTemplateDTO> {
  private logger = LoggerService.getLogger('NotificationTemplateDAO');

  constructor(
    @InjectModel(NotificationTemplate.name) private templateModel: Model<NotificationTemplateDocument>
  ) {
    super(templateModel, NotificationTemplateDTO);
  }

  protected isTenantEntity(): boolean {
    return true; // Templates can be tenant-specific or system-wide
  }

  protected isSharedEntity(): boolean {
    return false; // Templates can be shared (system templates)
  }

  protected isSystemEntity(): boolean {
    return false; // Not a system entity
  }

  protected modelToDTO(model: NotificationTemplateDocument | null): NotificationTemplateDTO | null {
    if (!model) return null;
    
    const dto = new NotificationTemplateDTO();
    dto.id = model._id.toString();
    dto.tenantId = model.tenantId;
    dto.type = model.type;
    dto.channel = model.channel;
    dto.subject = model.subject;
    dto.contentTemplate = model.contentTemplate;
    dto.titleTemplate = model.titleTemplate;
    dto.whatsappTemplateName = model.whatsappTemplateName;
    dto.active = model.active;
    dto.defaultMetadata = model.defaultMetadata;
    dto.createdBy = model.createdBy;
    dto.updatedBy = model.updatedBy;
    dto.createdAt = model.createDtTime;
    dto.updatedAt = model.updateDtTime;
    
    return dto;
  }

  protected modelToDTOArray(models: NotificationTemplateDocument[]): NotificationTemplateDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }

  protected dtoToModel(dto: Partial<NotificationTemplateDTO>): Partial<NotificationTemplateDocument> {
    if (!dto) return {};
    
    const model: Partial<NotificationTemplateDocument> = {};
    
    if (dto.tenantId !== undefined) model.tenantId = dto.tenantId;
    if (dto.type !== undefined) model.type = dto.type;
    if (dto.channel !== undefined) model.channel = dto.channel;
    if (dto.subject !== undefined) model.subject = dto.subject;
    if (dto.contentTemplate !== undefined) model.contentTemplate = dto.contentTemplate;
    if (dto.titleTemplate !== undefined) model.titleTemplate = dto.titleTemplate;
    if (dto.whatsappTemplateName !== undefined) model.whatsappTemplateName = dto.whatsappTemplateName;
    if (dto.active !== undefined) model.active = dto.active;
    if (dto.defaultMetadata !== undefined) model.defaultMetadata = dto.defaultMetadata;
    
    return model;
  }
}