import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TenantDAO } from "src/core/dao/base-tenant.dao";
import { IS3DAO } from "./s3-dao.interface";
import { S3 } from "../model/s3.model";
import { CdeType, FileType, S3DTO } from "../dtos/s3.dto";

@Injectable()
export class S3DAO extends TenantDAO<S3, S3DTO> implements IS3DAO {
  constructor(
    @InjectModel(S3.name) private readonly S3Model: Model<S3>
  ) {
    super(S3Model, S3DTO);
  }

  protected modelToDTO(model: S3 | null): S3DTO | null {
    if (!model) return null;
  
    const s3DTO = new S3DTO();
    s3DTO.id = model._id.toString();
    s3DTO.projectId = model.projectId;
    s3DTO.fileName = model.fileName;
    s3DTO.fileType = model.fileType as FileType;;
    s3DTO.s3Path = model.s3Path;
    s3DTO.status = model.status;
    s3DTO.uploadedAt = new Date(model.uploadedAt);
    s3DTO.uploadedBy = model.uploadedBy;
    
    if (model.cdeType) {
      s3DTO.cdeType = model.cdeType as CdeType;;
    }
    
    if (model.tags) {
      s3DTO.tags = model.tags;
    }
    
    return s3DTO;
  }
  
  protected modelToDTOArray(models: S3[]): S3DTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }
  
  protected dtoToModel(dto: Partial<S3DTO>): Partial<S3> {
    if (!dto) return {};
  
    const s3Model: Partial<S3> = {};
  
    if (dto.projectId) {
      s3Model.projectId = dto.projectId;
    }
    
    if (dto.fileType) {
      s3Model.fileType = dto.fileType;
    }
    
    if (dto.fileName) {
      s3Model.fileName = dto.fileName;
    }
    
    if (dto.s3Path) {
      s3Model.s3Path = dto.s3Path;
    }
    
    if (dto.status) {
      s3Model.status = dto.status;
    }
    
    if (dto.uploadedAt) {
      s3Model.uploadedAt = dto.uploadedAt;
    }
    
    if (dto.uploadedBy) {
      s3Model.uploadedBy = dto.uploadedBy;
    }
    
    if (dto.cdeType) {
      s3Model.cdeType = dto.cdeType;
    }
    
    if (dto.tags) {
      s3Model.tags = dto.tags;
    }
    
    return s3Model;
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

