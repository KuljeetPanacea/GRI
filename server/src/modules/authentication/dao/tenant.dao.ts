import { Injectable } from "@nestjs/common";
import { BaseDAO } from "src/core/dao/base-dao";
import { Tenant, TenantDocument } from "../model/tenant.models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { TenantDTO } from "../dto/Tenant.dto";

@Injectable()
export class TenantDAO extends BaseDAO<Tenant, TenantDTO> {
  constructor(
    @InjectModel(Tenant.name)
    private readonly tenantModel: Model<TenantDocument>
  ) {
    super(tenantModel, TenantDTO);
  }
  async findByEmail(email: string): Promise<Tenant | null> {
    return this.model.findOne({ email }).exec();
  }

  protected modelToDTO(model: Tenant | null): TenantDTO | null {
    if (!model) return null;
    const tenantDTO = new TenantDTO();
    tenantDTO.id = model._id.toString();
    tenantDTO.tenantName = model.tenantName;
    tenantDTO.tenantEmail = model.tenantEmail;
    tenantDTO.password = model.password;
    tenantDTO.createDtTime = model.createDtTime;
    tenantDTO.updateDtTime = model.updateDtTime;
    tenantDTO.status = model.status;
    tenantDTO.__v = model.__v;
    tenantDTO.tenantPhoneCountryCode = model.tenantPhoneCountryCode;
    tenantDTO.tenantPhone = model.tenantPhone;
  
    return tenantDTO;
  }
  
  protected modelToDTOArray(models: Tenant[]): TenantDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }
  
  protected dtoToModel(dto: Partial<TenantDTO>): Partial<Tenant> {
    if (!dto) return {};
  
    const tenantModel: Partial<Tenant> = {};
  
    if (dto.tenantName !== undefined) tenantModel.tenantName = dto.tenantName;
    if (dto.tenantEmail !== undefined) tenantModel.tenantEmail = dto.tenantEmail;
    if (dto.password !== undefined) tenantModel.password = dto.password;
    if (dto.createDtTime !== undefined) tenantModel.createDtTime = dto.createDtTime;
    if (dto.updateDtTime !== undefined) tenantModel.updateDtTime = dto.updateDtTime;
    if (dto.status !== undefined) tenantModel.status = dto.status;
    if (dto.__v !== undefined) tenantModel.__v = dto.__v;
    if (dto.tenantPhoneCountryCode !== undefined) tenantModel.tenantPhoneCountryCode = dto.tenantPhoneCountryCode;
    if (dto.tenantPhone !== undefined) tenantModel.tenantPhone = dto.tenantPhone;
  
    return tenantModel;
  }

  protected isTenantEntity(): boolean {
    return false;
  }
  
  protected isSharedEntity(): boolean{
    return false;
  }
  
  protected isSystemEntity(): boolean {
    return false;
  }
  
  
}
