import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Appendix } from "../model/appendix.model";
import { IAppendixDAO } from "./appendix-dao.interface";
import { AppendixADTO } from "../dtos/appendix-a.dto";
import { AppendixCDTO } from "../dtos/appendix-c.dto";
import { AppendixEDTO } from "../dtos/appendix-e.dto";
import { TenantDAO } from "src/core/dao/base-tenant.dao";

@Injectable()
export class AppendixDAO extends TenantDAO<Appendix, AppendixADTO | AppendixCDTO | AppendixEDTO> implements IAppendixDAO {
  constructor(
    @InjectModel(Appendix.name) private readonly AppendixModel: Model<Appendix>
  ) {
    super(AppendixModel, AppendixADTO);
  }

  async findByProjectIdAndType(projectId: string, appendixType: string): Promise<Appendix | null> {
    return this.model.findOne({ projectId, appendixType }).exec();
  }

  async findAllByProjectId(projectId: string): Promise<Appendix[]> {
    return this.model.find({ projectId }).exec();
  }

  async findByAppendixType(appendixType: string): Promise<Appendix[]> {
    return this.model.find({ appendixType }).exec();
  }

  protected modelToDTO(model: Appendix | null): AppendixADTO | AppendixCDTO | AppendixEDTO | null {
    if (!model) return null;

    switch (model.appendixType) {
      case 'appendix-a':
        return this.modelToAppendixADTO(model);
      case 'appendix-c':
        return this.modelToAppendixCDTO(model);
      case 'appendix-e':
        return this.modelToAppendixEDTO(model);
      default:
        return null;
    }
  }

  private modelToAppendixADTO(model: Appendix): AppendixADTO {
    const dto = new AppendixADTO();
    dto.controls = model.controls || [];
    dto.projectId = model.projectId;
    dto._id = model.id;
    dto.__v = model.__v;
    dto.id = model._id.toString();
    dto.createDtTime = model.createDtTime;
    dto.updateDtTime = model.updateDtTime;
    dto.createdBy = model.createdBy;
    dto.appendixType = model.appendixType;
    return dto;
  }

  private modelToAppendixCDTO(model: Appendix): AppendixCDTO {
    const dto = new AppendixCDTO();
    dto.requirementNumber = model.requirementNumber || '';
    dto.requirementDefinition = model.requirementDefinition || '';
    dto.constraints = model.constraints || '';
    dto.compensatingControlsDefinition = model.compensatingControlsDefinition || '';
    dto.originalObjective = model.originalObjective || '';
    dto.compensatingObjective = model.compensatingObjective || '';
    dto.identifiedRisk = model.identifiedRisk || '';
    dto.validationMethod = model.validationMethod || '';
    dto.maintenanceProcess = model.maintenanceProcess || '';
    dto.projectId = model.projectId;
    dto._id = model.id;
    dto.__v = model.__v;
    dto.id = model._id.toString();
    dto.createDtTime = model.createDtTime;
    dto.updateDtTime = model.updateDtTime;
    dto.createdBy = model.createdBy;
    dto.appendixType = model.appendixType;
    return dto;
  }

  private modelToAppendixEDTO(model: Appendix): AppendixEDTO {
    const dto = new AppendixEDTO();
    dto.requirementNumber = model.requirementNumber || '';
    dto.requirementDefinition = model.requirementDefinition || '';
    dto.customizedControlName = model.customizedControlName || '';
    dto.controlDescription = model.controlDescription || '';
    dto.objectiveMeeting = model.objectiveMeeting || '';
    dto.controlsMatrixDocumentation = model.controlsMatrixDocumentation || '';
    dto.targetedRiskAnalysis = model.targetedRiskAnalysis || '';
    dto.assessorNames = model.assessorNames || '';
    dto.testingProcedure1 = model.testingProcedure1 || '';
    dto.whatTested1 = model.whatTested1 || '';
    dto.evidenceExamined1 = model.evidenceExamined1 || '';
    dto.testingResults1 = model.testingResults1 || '';
    dto.testingProcedure2 = model.testingProcedure2;
    dto.whatTested2 = model.whatTested2;
    dto.evidenceExamined2 = model.evidenceExamined2;
    dto.testingResults2 = model.testingResults2;
    dto.projectId = model.projectId;
    dto._id = model.id;
    dto.__v = model.__v;
    dto.id = model._id.toString();
    dto.createDtTime = model.createDtTime;
    dto.updateDtTime = model.updateDtTime;
    dto.createdBy = model.createdBy;
    dto.appendixType = model.appendixType;
    return dto;
  }

  protected modelToDTOArray(models: Appendix[]): (AppendixADTO | AppendixCDTO | AppendixEDTO)[] {
    return models.map(model => this.modelToDTO(model)!).filter(dto => dto !== null);
  }

  protected dtoToModel(dto: Partial<AppendixADTO | AppendixCDTO | AppendixEDTO>): Partial<Appendix> {
    if (!dto) return {};

    const appendixModel: Partial<Appendix> = {};

    // Common fields
    if (dto.projectId !== undefined) appendixModel.projectId = dto.projectId;
    if (dto.createdBy !== undefined) appendixModel.createdBy = dto.createdBy;

    // Type-specific field mapping
    if (this.isAppendixADTO(dto)) {
      appendixModel.appendixType = 'appendix-a';
      if (dto.controls !== undefined) appendixModel.controls = dto.controls;
    } else if (this.isAppendixCDTO(dto)) {
      appendixModel.appendixType = 'appendix-c';
      if (dto.requirementNumber !== undefined) appendixModel.requirementNumber = dto.requirementNumber;
      if (dto.requirementDefinition !== undefined) appendixModel.requirementDefinition = dto.requirementDefinition;
      if (dto.constraints !== undefined) appendixModel.constraints = dto.constraints;
      if (dto.compensatingControlsDefinition !== undefined) appendixModel.compensatingControlsDefinition = dto.compensatingControlsDefinition;
      if (dto.originalObjective !== undefined) appendixModel.originalObjective = dto.originalObjective;
      if (dto.compensatingObjective !== undefined) appendixModel.compensatingObjective = dto.compensatingObjective;
      if (dto.identifiedRisk !== undefined) appendixModel.identifiedRisk = dto.identifiedRisk;
      if (dto.validationMethod !== undefined) appendixModel.validationMethod = dto.validationMethod;
      if (dto.maintenanceProcess !== undefined) appendixModel.maintenanceProcess = dto.maintenanceProcess;
    } else if (this.isAppendixEDTO(dto)) {
      appendixModel.appendixType = 'appendix-e';
      if (dto.requirementNumber !== undefined) appendixModel.requirementNumber = dto.requirementNumber;
      if (dto.requirementDefinition !== undefined) appendixModel.requirementDefinition = dto.requirementDefinition;
      if (dto.customizedControlName !== undefined) appendixModel.customizedControlName = dto.customizedControlName;
      if (dto.controlDescription !== undefined) appendixModel.controlDescription = dto.controlDescription;
      if (dto.objectiveMeeting !== undefined) appendixModel.objectiveMeeting = dto.objectiveMeeting;
      if (dto.controlsMatrixDocumentation !== undefined) appendixModel.controlsMatrixDocumentation = dto.controlsMatrixDocumentation;
      if (dto.targetedRiskAnalysis !== undefined) appendixModel.targetedRiskAnalysis = dto.targetedRiskAnalysis;
      if (dto.assessorNames !== undefined) appendixModel.assessorNames = dto.assessorNames;
      if (dto.testingProcedure1 !== undefined) appendixModel.testingProcedure1 = dto.testingProcedure1;
      if (dto.whatTested1 !== undefined) appendixModel.whatTested1 = dto.whatTested1;
      if (dto.evidenceExamined1 !== undefined) appendixModel.evidenceExamined1 = dto.evidenceExamined1;
      if (dto.testingResults1 !== undefined) appendixModel.testingResults1 = dto.testingResults1;
      if (dto.testingProcedure2 !== undefined) appendixModel.testingProcedure2 = dto.testingProcedure2;
      if (dto.whatTested2 !== undefined) appendixModel.whatTested2 = dto.whatTested2;
      if (dto.evidenceExamined2 !== undefined) appendixModel.evidenceExamined2 = dto.evidenceExamined2;
      if (dto.testingResults2 !== undefined) appendixModel.testingResults2 = dto.testingResults2;
    }

    return appendixModel;
  }

  // Type guard methods
  private isAppendixADTO(dto: Partial<AppendixADTO | AppendixCDTO | AppendixEDTO>): dto is Partial<AppendixADTO> {
    return 'controls' in dto;
  }

  private isAppendixCDTO(dto: Partial<AppendixADTO | AppendixCDTO | AppendixEDTO>): dto is Partial<AppendixCDTO> {
    return 'compensatingControlsDefinition' in dto;
  }

  private isAppendixEDTO(dto: Partial<AppendixADTO | AppendixCDTO | AppendixEDTO>): dto is Partial<AppendixEDTO> {
    return 'customizedControlName' in dto;
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