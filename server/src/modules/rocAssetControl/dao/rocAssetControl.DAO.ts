import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TenantDAO } from "src/core/dao/base-tenant.dao"; 
import { RocAssetControl } from "../model/rocAssetControl.model";
import { RocAssetControlDTO } from "../dtos/rocAssetControl.dto";

@Injectable()
export class RocAssetControlDAO extends TenantDAO<RocAssetControl, RocAssetControlDTO> implements RocAssetControlDAO {
  constructor(
    @InjectModel(RocAssetControl.name) private readonly rocAssetControlModel: Model<RocAssetControl>
  ) {
    super(rocAssetControlModel, RocAssetControlDTO);
  }

  protected modelToDTO(model: RocAssetControl | null): RocAssetControlDTO | null {
    if (!model) return null;
  
    const rocAssetControlDTO = new RocAssetControlDTO();
    rocAssetControlDTO.projectId = model.projectId;
    rocAssetControlDTO.reqNo = model.reqNo;
    rocAssetControlDTO.id = model._id.toString();
    rocAssetControlDTO.subReqNo = model.subReqNo;
    rocAssetControlDTO.controlNo = model.controlNo;
    rocAssetControlDTO.AEInternalAssessor = model.AEInternalAssessor;
    rocAssetControlDTO.deviceType = model.deviceType;
    rocAssetControlDTO.deviceRef = model.deviceRef;
    rocAssetControlDTO.qstnrID = model.qstnrID;
    rocAssetControlDTO.qstnrName = model.qstnrName;
    rocAssetControlDTO.qstnrDesc = model.qstnrDesc;
    rocAssetControlDTO.assessmentId = model.assessmentId;
    rocAssetControlDTO.identifiedGaps = model.identifiedGaps;
    rocAssetControlDTO.evidences = model.evidences;
    rocAssetControlDTO.evidenceReference = model.evidenceReference;
    rocAssetControlDTO.createDtTime = model.createDtTime;
    rocAssetControlDTO.updateDtTime = model.updateDtTime;
    rocAssetControlDTO.AIResponseSummary = model.AIResponseSummary;

    if (model.deviceRefFinding) {
      rocAssetControlDTO.deviceRefFinding = model.deviceRefFinding;
    }
    return rocAssetControlDTO;
  }
  
  protected modelToDTOArray(models: RocAssetControl[]): RocAssetControlDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }
  
  protected dtoToModel(dto: Partial<RocAssetControlDTO>): Partial<RocAssetControl> {
    if (!dto) return {};
  
    const rocAssetControl: Partial<RocAssetControl> = {};

    if (dto.projectId) {
      rocAssetControl.projectId = dto.projectId;
    }
    
    if(dto.identifiedGaps) {
      rocAssetControl.identifiedGaps = dto.identifiedGaps
    }
    if (dto.reqNo) {
      rocAssetControl.reqNo = dto.reqNo;
    }
    
    if (dto.subReqNo) {
      rocAssetControl.subReqNo = dto.subReqNo;
    }
    
    if (dto.controlNo) {
      rocAssetControl.controlNo = dto.controlNo;
    }

    if (dto.AEInternalAssessor) {
      rocAssetControl.AEInternalAssessor = dto.AEInternalAssessor;
    }
    
    if (dto.deviceType) {
      rocAssetControl.deviceType = dto.deviceType;
    }
    
    if (dto.deviceRef) {
      rocAssetControl.deviceRef = dto.deviceRef;
    }
    
    if (dto.qstnrID) {
      rocAssetControl.qstnrID = dto.qstnrID;
    }
    
    if (dto.qstnrName) {
      rocAssetControl.qstnrName = dto.qstnrName;
    }
    if (dto.qstnrDesc) {
      rocAssetControl.qstnrDesc = dto.qstnrDesc;
    }
    
    if (dto.deviceRefFinding) {
      rocAssetControl.deviceRefFinding = dto.deviceRefFinding;
    }

    if (dto.AIResponseSummary) {
      rocAssetControl.AIResponseSummary = dto.AIResponseSummary;
    }

    if (dto.identifiedGaps) {
      rocAssetControl.identifiedGaps = dto.identifiedGaps;
    }

    if (dto.evidences) {
      rocAssetControl.evidences = dto.evidences;
    }

    if (dto.assessmentId) {
      rocAssetControl.assessmentId = dto.assessmentId;
    }

    if (dto.evidenceReference) {
      rocAssetControl.evidenceReference = dto.evidenceReference;
    }
    
    if(dto.AIResponseSummary) {
      rocAssetControl.AIResponseSummary = dto.AIResponseSummary
    }
    return rocAssetControl;
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

