import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Transactional } from "src/core/decorators/transaction-decorator";
import { BaseService } from "src/core/service/base.service";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { RocPartOneDAO } from "../dao/roc-part-one.dao";
import { RocDataPartOneDTO } from "../dtos/roc-data-part-one.dto";
import { ContactInfoDataDTO } from "../dtos/contact-info-data.dto";
import { BusinessOverviewDataDTO } from "../dtos/business-overview-data.dto";
import { ScopeOfWorkDataDTO } from "../dtos/scope-of-work-data.dto";
import { ReviewedEnvDataDTO } from "../dtos/reviewed-env-data.dto";
import { QuarterlyScanFormDataDTO } from "../dtos/quarterly-scan-form-data.dto";
import { RocPartOne } from "../model/roc-part-one.model";

type RocPartType = 'contactInfo' | 'scopeOfWork' | 'reviewedEnv' | 'businessOverview' | 'quarterlyScanForm';

@Injectable()
export class RocDataPartOneService extends BaseService {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.ROC_DATA_PART_ONE_DAO)
    private readonly rocPartOneDAO: RocPartOneDAO
  ) {
    super(connection);
  }

  // Create full Part One entry
  @Transactional()
  async createRocDataPartOne(dto: RocDataPartOneDTO) {
    const created = await this.rocPartOneDAO.create(dto);
    return {
      message: "ROC Part One created successfully",
      data: created,
    };
  }
  
  @Transactional()
async createContactInfo(dto: Partial<RocDataPartOneDTO>) {
  return this.upsertSection(dto.projectId, { contactInfoData: dto.contactInfoData });
}

@Transactional()
async createBusinessOverview(dto: Partial<RocDataPartOneDTO>) {
  return this.upsertSection(dto.projectId, { businessOverviewData: dto.businessOverviewData });
}

@Transactional()
async createScopeOfWork(dto: Partial<RocDataPartOneDTO>) {
  return this.upsertSection(dto.projectId, { scopeOfWorkData: dto.scopeOfWorkData });
}

@Transactional()
async createReviewedEnv(dto: Partial<RocDataPartOneDTO>) {
  return this.upsertSection(dto.projectId, { reviewedEnvData: dto.reviewedEnvData });
}

@Transactional()
async createQuarterlyScanForm(dto: Partial<RocDataPartOneDTO>) {
  return this.upsertSection(dto.projectId, { quarterlyScanFormData: dto.quarterlyScanFormData });
}

  // Get full Part One by projectId
  async getByProjectId(projectId: string): Promise<RocDataPartOneDTO> {
    const result = await this.rocPartOneDAO.findOne({ projectId });
    if (!result) {
      throw new NotFoundException(
        `No ROC Part One found for project ID ${projectId}`
      );
    }
    return result;
  }

  // Update only contact info
  @Transactional()

  async updateContactInfo(
    projectId: string,
    contactInfoData: Partial<ContactInfoDataDTO>
  ) {
    return this.updateSection(projectId, {
  contactInfoData: contactInfoData as ContactInfoDataDTO,
});
  }

  // Update only business overview
  @Transactional()
  async updateBusinessOverview(
    projectId: string,
    businessOverviewData: Partial<BusinessOverviewDataDTO>
  ) {
    return this.updateSection(projectId, { businessOverviewData });
  }

  // Update only scope of work
  @Transactional()
  async updateScopeOfWork(
    projectId: string,
    scopeOfWorkData: Partial<ScopeOfWorkDataDTO>
  ) {
    return this.updateSection(projectId, { scopeOfWorkData });
  }

  // Update only reviewed env
  @Transactional()
  async updateReviewedEnv(
    projectId: string,
    reviewedEnvData: ReviewedEnvDataDTO
  ) {
    return this.updateSection(projectId, { reviewedEnvData });
  }

  // Update only quarterly scan form
  @Transactional()
  async updateQuarterlyScanForm(
    projectId: string,
    quarterlyScanFormData: Partial<QuarterlyScanFormDataDTO>
  ) {
    return this.updateSection(projectId, { quarterlyScanFormData });
  }

  // General helper for all partial updates
  private async updateSection(
    projectId: string,
    updatePayload: Partial<RocDataPartOneDTO>
  ) {
    const existing = await this.rocPartOneDAO.findOne({ projectId });

    if (!existing) {
      throw new NotFoundException("ROC Part One not found for update");
    }

    const updated = await this.rocPartOneDAO.update(existing.id, updatePayload);
    return {
      message: "ROC Part One section updated successfully",
      data: updated,
    };
  }

  async getTypeInfo(type: string, projectId: string) {
  const mapping: Record<RocPartType, keyof RocPartOne> = {
    contactInfo: 'contactInfo',
    scopeOfWork: 'scopeOfWork',
    reviewedEnv: 'reviewedEnv',
    businessOverview: 'businessOverview',
    quarterlyScanForm: 'quarterlyScan',
  };

  const field = mapping[type];
  if (!field) {
    throw new Error(`Invalid type: ${type}`);
  }

  const doc = await this.rocPartOneDAO.findByProjectId(projectId);
  return doc?.[field];
}

private async upsertSection(
  projectId: string,
  sectionData: Partial<RocDataPartOneDTO>
) {
  const existing = await this.rocPartOneDAO.findOne({ projectId });

  if (existing) {
    // Merge and update the section
    await this.rocPartOneDAO.update( existing.id , sectionData);
    return {
      message: "ROC Part One updated successfully",
      data: await this.rocPartOneDAO.findOne({ projectId }),
    };
  } else {
    // Create new document with section + projectId
    const created = await this.rocPartOneDAO.create({
      ...sectionData,
      projectId,
    });
    return {
      message: "ROC Part One created successfully",
      data: created,
    };
  }
}


}
