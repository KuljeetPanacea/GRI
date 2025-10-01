import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IClientDAO } from "./client-dao.interface";
import { ClientDTO } from "../dto/client.dto";
import { Client } from "../models/client.model";
import { TenantDAO } from "src/core/dao/base-tenant.dao";

@Injectable()
export class ClientDAO extends TenantDAO<Client, ClientDTO> implements IClientDAO {
  constructor(
    @InjectModel(Client.name) private readonly ClientModel: Model<Client>
  ) {
    super(ClientModel,ClientDTO);
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.model.findOne({ email }).exec();
  }

  protected modelToDTO(model: Client | null): ClientDTO | null {
    if (!model) return null;
    const clientDTO = new ClientDTO();
    clientDTO.clientName = model.clientName;
    clientDTO.businessName = model.businessName;
    clientDTO.clientId = model._id.toString();
    clientDTO.createdBy = model.createdBy;
    clientDTO.tenantId = model.tenantId;
    clientDTO.pocEmailId = model.pocEmailId;
    clientDTO.status = model.status;
    clientDTO.demography=model.demography;
    clientDTO.industry=model.industry;
    clientDTO.businessEntity=model.businessEntity;
    clientDTO.entitySize=model.entitySize;
    clientDTO.websiteLink=model.websiteLink;
    clientDTO.companyLogo=model.companyLogo;
    clientDTO.pocName=model.pocName;
    clientDTO.pocContactNumber=model.pocContactNumber;
    clientDTO.updateDtTime=model.updateDtTime
    clientDTO.createDtTime= model.createDtTime;
    clientDTO.auditEntity = model.auditEntity;
    clientDTO.leadershipContactNo = model.leadershipContactNo;
    clientDTO.leadershipEmailId = model.leadershipEmailId;
    clientDTO.leadershipName = model.leadershipName;
    clientDTO.__v = model.__v;
  
    return clientDTO;
  }
  
  protected modelToDTOArray(models: Client[]): ClientDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }
  
  protected dtoToModel(dto: Partial<ClientDTO>): Partial<Client> {
    if (!dto) return {};
    const clientModel: Partial<Client> = {};
  
    if (dto.clientName !== undefined) clientModel.clientName = dto.clientName;
    if (dto.status !== undefined) clientModel.status = dto.status;
    if (dto.createdBy !== undefined) clientModel.createdBy = dto.createdBy;
    if (dto.businessName !== undefined) clientModel.businessName = dto.businessName;
    if (dto.pocEmailId !== undefined) clientModel.pocEmailId = dto.pocEmailId;
    if (dto.demography !== undefined) clientModel.demography = dto.demography;
    if (dto.industry !== undefined) clientModel.industry = dto.industry;
    if (dto.businessEntity !== undefined) clientModel.businessEntity = dto.businessEntity;
    if (dto.entitySize !== undefined) clientModel.entitySize = dto.entitySize;
    if (dto.websiteLink !== undefined) clientModel.websiteLink = dto.websiteLink;
    if (dto.pocName !== undefined) clientModel.pocName = dto.pocName;
    if (dto.leadershipEmailId !== undefined) clientModel.leadershipEmailId = dto.leadershipEmailId;
    if (dto.leadershipName !== undefined) clientModel.leadershipName = dto.leadershipName;
    if (dto.leadershipContactNo !== undefined) clientModel.leadershipContactNo = dto.leadershipContactNo;
    if (dto.pocContactNumber !== undefined) clientModel.pocContactNumber = dto.pocContactNumber;
    if (dto.companyLogo !== undefined) clientModel.companyLogo = dto.companyLogo;
    if (dto.auditEntity !== undefined) {
      clientModel.auditEntity = dto.auditEntity;
    }
    //if (dto.tenantId !== undefined) clientModel.tenantId = dto.tenantId;
    
  
    return clientModel;
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

