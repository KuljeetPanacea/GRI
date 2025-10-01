import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Lookup } from "../model/lookup.model";
import { LookupDTO } from "../dtos/lookup.dto";
import { SharedDAO } from "src/core/dao/base-shared.dao";

@Injectable()
export class LookupDAO extends SharedDAO<Lookup, LookupDTO> {
  constructor(
    @InjectModel(Lookup.name) private readonly LookupModel: Model<Lookup>
  ) {
    super(LookupModel,LookupDTO);
  }

  async findByEmail(email: string): Promise<Lookup | null> {
    return this.model.findOne({ email }).exec();
  }

  protected modelToDTO(model: Lookup | null): LookupDTO | null {
    if (!model) return null;
  
    const lookupDTO = new LookupDTO();
    lookupDTO.lookUpId = model._id.toString();
    lookupDTO.category = model.category;
    lookupDTO.values = model.values;
    lookupDTO.createdBy = model.createdBy;
    lookupDTO.__v = model.__v;
    lookupDTO.id = model._id.toString();

    lookupDTO.updateDtTime = model.updateDtTime; 
    return lookupDTO;
  }
  
  protected modelToDTOArray(models: Lookup[]): LookupDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }
  
  protected dtoToModel(dto: Partial<LookupDTO>): Partial<Lookup> {
    if (!dto) return {};
  
    const LookupModel: Partial<Lookup> = {};
  
    if (dto.lookUpId !== undefined) LookupModel.lookUpId = dto.lookUpId;
    if (dto.category !== undefined) LookupModel.category = dto.category;
    if (dto.values !== undefined) {
        LookupModel.values = dto.values;
    }
  
    return LookupModel;
  }

  protected isTenantEntity(): boolean {
    return false;
  }
  
  protected isSharedEntity(): boolean{
    return true;
  }
  
  protected isSystemEntity(): boolean {
    return false;
  }

}

