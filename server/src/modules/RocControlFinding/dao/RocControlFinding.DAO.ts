import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TenantDAO } from "src/core/dao/base-tenant.dao"; 
import { RocControlFinding } from "../model/RocControlFinding.model";
import { RocControlFindingDTO } from "../dtos/RocControlFinding.dto";

@Injectable()
export class RocControlFindingDAO extends TenantDAO<RocControlFinding, RocControlFindingDTO> implements RocControlFindingDAO {
  constructor(
    @InjectModel(RocControlFinding.name) private readonly RocModel: Model<RocControlFinding>
  ) {
    super(RocModel, RocControlFindingDTO);
  }

  protected modelToDTO(model: RocControlFinding | null): RocControlFindingDTO | null {
    if (!model) return null;
  
    const rocControlFindingDTO = new RocControlFindingDTO();
    rocControlFindingDTO.projectId = model.projectId;
    rocControlFindingDTO.controlNo = model.controlNo;
    rocControlFindingDTO.controlAssessmentFinding = model.controlAssessmentFinding;
    rocControlFindingDTO.detailed_finding = model.detailed_finding;
    rocControlFindingDTO.compensatingControl = model.compensatingControl;
    rocControlFindingDTO.customizedApproach = model.customizedApproach;
    rocControlFindingDTO.modeOfAssessment = model.modeOfAssessment;
    rocControlFindingDTO.assessmentId = model.assessmentId;
    rocControlFindingDTO.id = model._id.toString();
    rocControlFindingDTO.evidences = model.evidences;
    
    return rocControlFindingDTO;
  }
  
  protected modelToDTOArray(models: RocControlFinding[]): RocControlFindingDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }
  
  protected dtoToModel(dto: Partial<RocControlFindingDTO>): Partial<RocControlFinding> {
    if (!dto) return {};
  
    const RocControlFinding: Partial<RocControlFinding> = {};

    if (dto.projectId) {
      RocControlFinding.projectId = dto.projectId;
    }

    if (dto.controlNo) {
      RocControlFinding.controlNo = dto.controlNo;
    }

    if (dto.controlAssessmentFinding) {
      RocControlFinding.controlAssessmentFinding = dto.controlAssessmentFinding;
    }

    if (dto.detailed_finding) {
      RocControlFinding.detailed_finding = dto.detailed_finding;
    }

if (dto.customizedApproach !== undefined) {
  RocControlFinding.customizedApproach = dto.customizedApproach;
}

if (dto.compensatingControl !== undefined) {
  RocControlFinding.compensatingControl = dto.compensatingControl;
}

if (dto.evidences) {
  RocControlFinding.evidences = dto.evidences;
}
if (dto.modeOfAssessment) {
      RocControlFinding.modeOfAssessment = dto.modeOfAssessment;
    }

if (dto.assessmentId) {
      RocControlFinding.assessmentId = dto.assessmentId;
    }

    return RocControlFinding;
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

