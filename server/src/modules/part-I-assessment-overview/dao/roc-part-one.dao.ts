import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TenantDAO } from 'src/core/dao/base-tenant.dao';

import { RocPartOne } from '../model/roc-part-one.model';
import { RocDataPartOneDTO } from '../dtos/roc-data-part-one.dto';
import { IRocPartOneDAO } from './roc-part-one-dao.interface';

@Injectable()
export class RocPartOneDAO
  extends TenantDAO<RocPartOne, RocDataPartOneDTO>
  implements IRocPartOneDAO
{
  constructor(
    @InjectModel(RocPartOne.name)
    private readonly rocPartOneModel: Model<RocPartOne>,
  ) {
    super(rocPartOneModel, RocDataPartOneDTO);
  }

  async findByProjectId(projectId: string): Promise<RocPartOne | null> {
    return this.model.findOne({ projectId }).exec();
  }

  protected modelToDTO(model: RocPartOne | null): RocDataPartOneDTO | null {
    if (!model) return null;

    const dto = new RocDataPartOneDTO();
    dto.id = model._id.toString();
    dto.businessOverviewData = model.businessOverview;
    dto.scopeOfWorkData = model.scopeOfWork;
    dto.reviewedEnvData = model.reviewedEnv;
    dto.contactInfoData = model.contactInfo;
    dto.quarterlyScanFormData = model.quarterlyScan;
    dto.projectId = model.projectId;
    dto.createDtTime = model.createDtTime;
    dto.updateDtTime = model.updateDtTime;

    return dto;
  }

  protected dtoToModel(dto: Partial<RocDataPartOneDTO>): Partial<RocPartOne> {
    if (!dto) return {};

    const model: Partial<RocPartOne> = {};
    if (dto.id !== undefined) model._id = dto.id;
    if (dto.businessOverviewData !== undefined) model.businessOverview = dto.businessOverviewData;
    if (dto.scopeOfWorkData !== undefined) model.scopeOfWork = dto.scopeOfWorkData;
    if (dto.reviewedEnvData !== undefined) model.reviewedEnv = dto.reviewedEnvData;
    if (dto.contactInfoData !== undefined) model.contactInfo = dto.contactInfoData;
    if (dto.quarterlyScanFormData !== undefined) model.quarterlyScan = dto.quarterlyScanFormData;
    if (dto.projectId !== undefined) model.projectId = dto.projectId;

    return model;
  }

  protected isTenantEntity(): boolean {
    return true;
  }

  protected isSharedEntity(): boolean {
    return false;
  }

  protected isSystemEntity(): boolean {
    return false;
  }
}
