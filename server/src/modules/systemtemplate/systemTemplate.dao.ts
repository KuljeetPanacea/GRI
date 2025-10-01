import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDAO } from 'src/core/dao/base-dao';
import { LoggerService } from 'src/core/logger';
import { SystemTemplateDocument, SystemTemplate } from './systemTemplate.schema';
import { SystemTemplateDTO } from './systemTemplate.dto';


@Injectable()
export class SystemTemplateDAO extends BaseDAO<SystemTemplateDocument, SystemTemplateDTO> {
  private logger = LoggerService.getLogger('SystemTemplateDAO');

  constructor(
    @InjectModel(SystemTemplate.name) private templateModel: Model<SystemTemplateDocument>
  ) {
    super(templateModel, SystemTemplateDTO);
  }

  protected isTenantEntity(): boolean {
    return false;
  }

  protected isSharedEntity(): boolean {
    return false; 
  }

  protected isSystemEntity(): boolean {
    return false;
  }

  protected modelToDTO(model: SystemTemplateDocument | null): SystemTemplateDTO | null {
    if (!model) return null;
    
    const dto = new SystemTemplateDTO();
    dto.id = model._id.toString();
    dto.type = model.type;
    dto.subject = model.subject;
    dto.contentTemplate = model.contentTemplate;
    dto.titleTemplate = model.titleTemplate;
    dto.active = model.active;
    dto.defaultMetadata = model.defaultMetadata;
    dto.createdBy = model.createdBy;
    dto.updatedBy = model.updatedBy;
    
    return dto;
  }

  protected modelToDTOArray(models: SystemTemplateDocument[]): SystemTemplateDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }

  protected dtoToModel(dto: Partial<SystemTemplateDTO>): Partial<SystemTemplateDocument> {
    if (!dto) return {};
    
    const model: Partial<SystemTemplateDocument> = {};
    
    if (dto.type !== undefined) model.type = dto.type;
    if (dto.subject !== undefined) model.subject = dto.subject;
    if (dto.contentTemplate !== undefined) model.contentTemplate = dto.contentTemplate;
    if (dto.titleTemplate !== undefined) model.titleTemplate = dto.titleTemplate;
    if (dto.active !== undefined) model.active = dto.active;
    if (dto.defaultMetadata !== undefined) model.defaultMetadata = dto.defaultMetadata;
    
    return model;
  }
}