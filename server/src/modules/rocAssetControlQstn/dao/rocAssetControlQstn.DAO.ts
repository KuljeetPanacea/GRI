import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TenantDAO } from "src/core/dao/base-tenant.dao"; 
import { RocAssetControlQstn } from "../model/rocAssetControlQstn.model";
import { RocAssetControlQstnDTO } from "../dtos/rocAssetControlQstn.dto";

@Injectable()
export class RocAssetControlQstnDAO extends TenantDAO<RocAssetControlQstn, RocAssetControlQstnDTO> implements RocAssetControlQstnDAO {
  constructor(
    @InjectModel(RocAssetControlQstn.name) private readonly rocAssetControlQstnModel: Model<RocAssetControlQstn>
  ) {
    super(rocAssetControlQstnModel, RocAssetControlQstnDTO);
  }

  protected modelToDTO(model: RocAssetControlQstn | null): RocAssetControlQstnDTO | null {
    if (!model) return null;
  
    const rocAssetControlDTO = new RocAssetControlQstnDTO();
    rocAssetControlDTO.projectId = model.projectId;
    rocAssetControlDTO.controlNo = model.controlNo;
    rocAssetControlDTO.deviceRef = model.deviceRef;
    rocAssetControlDTO.qstnID = model.qstnID;
    rocAssetControlDTO.qstnDesc = model.qstnDesc;
    rocAssetControlDTO.response = model.response;
    rocAssetControlDTO.evidences = model.evidences;
    rocAssetControlDTO.evidenceReference = model.evidenceReference;

    return rocAssetControlDTO;
  }
  
  protected modelToDTOArray(models: RocAssetControlQstn[]): RocAssetControlQstnDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }
  
  protected dtoToModel(dto: Partial<RocAssetControlQstnDTO>): Partial<RocAssetControlQstn> {
    if (!dto) return {};
  
    const rocAssetControl: Partial<RocAssetControlQstn> = {};

    if (dto.projectId) {
      rocAssetControl.projectId = dto.projectId;
    }
    
    if (dto.controlNo) {
      rocAssetControl.controlNo = dto.controlNo;
    }
    
    if (dto.deviceRef) {
      rocAssetControl.deviceRef = dto.deviceRef;
    }
    
    if (dto.qstnID) {
      rocAssetControl.qstnID = dto.qstnID;
    }
    
    if (dto.qstnDesc) {
      rocAssetControl.qstnDesc = dto.qstnDesc;
    }
    
    if (dto.response) {
      rocAssetControl.response = dto.response;
    }

    if (dto.evidences) {
      rocAssetControl.evidences = dto.evidences;
    }

    if (dto.evidenceReference) {
      rocAssetControl.evidenceReference = dto.evidenceReference;
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

