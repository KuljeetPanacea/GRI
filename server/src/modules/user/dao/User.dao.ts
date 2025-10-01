import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User } from "../models/user.model";
import { IUserDAO } from "./user-dao.interface";
import { UserDTO } from "../dtos/User.dto";
import bcrypt from "bcryptjs";
import { QueryOptions } from "src/core/database/query-options.interface";
import { TenantDAO } from "src/core/dao/base-tenant.dao";

@Injectable()
export class UserDAO extends TenantDAO<User, UserDTO> implements IUserDAO {
  private readonly logger = new Logger(UserDAO.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {
    super(userModel, UserDTO);
  }

  protected modelToDTO(model: User | null): UserDTO | null {
    if (!model) return null;
    
    const userDTO = new UserDTO();
    userDTO.id = model._id.toString();
    userDTO.name = model.name;
    userDTO.email = model.email;
    userDTO.countryCode = model.countryCode;
    userDTO.mobileNumber = model.mobileNumber;
    userDTO.status = model.status;
    userDTO.createDtTime = model.createDtTime;
    userDTO.updateDtTime = model.updateDtTime;
    userDTO.createdBy = model.createdBy;
    userDTO.updatedBy = model.updatedBy;
    userDTO.password = model.password;
    userDTO.tenantId = model.tenantId;
    userDTO.roles = model.roles.map(role => role.toString());
     userDTO.defaultPasswordchange = model.defaultPasswordchange;
    userDTO.__v=model.__v;
    userDTO.password =model.password
    
    return userDTO;
  }

  protected modelToDTOArray(models: User[]): UserDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }

  protected dtoToModel(dto: Partial<UserDTO>): Partial<User> {
    if (!dto) return {};
    
    const userModel: Partial<User> = {};
    
     userModel.name = dto.name;
     userModel.email = dto.email;
     userModel.username = dto.username;
     userModel.password = dto.password;
     userModel.countryCode = dto.countryCode;
     userModel.mobileNumber = dto.mobileNumber;
     userModel.tenantId = dto.tenantId;
     userModel.status = dto.status;
     userModel.createdBy = dto.createdBy;
     if(dto.roles){
      userModel.roles = dto.roles.map(role => new mongoose.Types.ObjectId(role));
     }

     if(userModel.defaultPasswordchange){
      dto.defaultPasswordchange = userModel.defaultPasswordchange || false;
     }
     if(userModel.password){
      dto.password = userModel.password;
     }
     if(dto.otp){
      userModel.otp = dto.otp;
     }
     
     userModel.__v = dto.__v;

    return userModel;
  }

  async findByEmail(email: string, options?: QueryOptions): Promise<UserDTO | null> {
    return this.findOneWithoutTenantFilter({ email }, options);
  }

  async validateCredentials(email: string, password: string): Promise<UserDTO | null> {
    // This is a special case that doesn't use tenant filtering
    const user = await this.model.findOne({ email }).exec();
    if (!user) return null;
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? this.modelToDTO(user) : null;
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
