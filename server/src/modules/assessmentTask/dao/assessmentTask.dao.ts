import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TenantDAO } from "src/core/dao/base-tenant.dao";
import { IAssessmentTaskDAO } from "./assessmentTask-dao.interface";
import { AssessmentTaskDTO } from "../dtos/assessmentTask.dto";
import { AssessmentTask } from "../model/assessmentTask.model";

@Injectable()
export class AssessmentTaskDAO extends TenantDAO<AssessmentTask, AssessmentTaskDTO> implements IAssessmentTaskDAO {
  constructor(
    @InjectModel(AssessmentTask.name) private readonly AuditModel: Model<AssessmentTask>
  ) {
    super(AuditModel, AssessmentTaskDTO);
  }

  protected modelToDTO(model: AssessmentTask | null): AssessmentTaskDTO | null {
    if (!model) return null;
  
    const auditDTO = new AssessmentTaskDTO();
    auditDTO.department = model.department;
    auditDTO.deviceRefName = model.deviceRefName;
    auditDTO.deviceType = model.deviceType;
    auditDTO.id = model._id.toString();
    auditDTO.ipAddress = model.ipAddress
    auditDTO.createdBy = model.createdBy;
    auditDTO.createDtTime = model.createDtTime;
    auditDTO.primaryAEStakeholderId = model.primaryAEStakeholderId;
    auditDTO.primaryAEStakeholder = model.primaryAEStakeholder;
    auditDTO.questionnaire = model.questionnaire;
    auditDTO.__v = model.__v;
    auditDTO.projectId = model.projectId;
    auditDTO.evidences = model.evidences;
    auditDTO.emailSent = model.emailSent;
    return auditDTO;
  }
  
  protected modelToDTOArray(models: AssessmentTask[]): AssessmentTaskDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }
  
  protected dtoToModel(dto: Partial<AssessmentTaskDTO>): Partial<AssessmentTask> {
    if (!dto) return {};
  console.log("dto testing", dto);
    const auditModel: Partial<AssessmentTask> = {};
  
    if (dto.department !== undefined) auditModel.department = dto.department;
    if (dto.deviceRefName !== undefined) auditModel.deviceRefName = dto.deviceRefName;
    if (dto.deviceType !== undefined) auditModel.deviceType = dto.deviceType;
    if (dto.questionnaire !== undefined) auditModel.questionnaire = dto.questionnaire;
   
    if (dto.primaryAEStakeholderId !== undefined) {
      auditModel.primaryAEStakeholderId = dto.primaryAEStakeholderId;
    }
    if (dto.primaryAEStakeholder !== undefined) {
      auditModel.primaryAEStakeholder = dto.primaryAEStakeholder;
    }
    if(dto.createDtTime !== undefined) auditModel.createDtTime = dto.createDtTime;
    if (dto.ipAddress !== undefined) auditModel.ipAddress = dto.ipAddress;
    if (dto.projectId !== undefined) auditModel.projectId = dto.projectId;
    if (dto.evidences) auditModel.evidences = dto.evidences;
    if (dto.emailSent !== undefined) auditModel.emailSent = dto.emailSent;
    return auditModel;
  }

  protected isTenantEntity(): boolean {
    return true;
  }
  
  protected isSharedEntity(): boolean{
    return false;
  }
  
  protected isSystemEntity(): boolean {
    return false;
  }

}

