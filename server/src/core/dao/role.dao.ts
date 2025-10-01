import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role, RoleDocument } from "../model/role.model";
import { BaseDAO } from "../dao/base-dao";
import { IRoleDAO } from "../dao/role.dao.interface";
import { RoleDTO } from "../dto/Role.dto";
import { Types } from 'mongoose';
import { SharedDAO } from "./base-shared.dao";
import { MainNavMenuDTO } from "../dto/mainNavMenu.dto";
 
@Injectable()
export class RoleDAO extends SharedDAO<Role, RoleDTO> implements IRoleDAO {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {
    super(roleModel, RoleDTO);
  }
 
  async findByNames(names: string[]): Promise<RoleDTO[]> {
    return this
      .find({ name: { $in: names } });
  }  
 
 async getPermissionsForRoles(names: string[]): Promise<string[]> {
  const roles = await this.find({ name: { $in: names } });
  const permissions = roles.flatMap((role) => role.permissions);
 
  return [...new Set(permissions)];
}
 async getMenuItemsForRoles(names: string[]): Promise<MainNavMenuDTO[]> {
  const roles = await this.find({ name: { $in: names } });
  const mainNavMenu = roles.flatMap((role) => role.mainNavMenu);
 
  return [...new Set(mainNavMenu)];
}
 
 
  protected modelToDTO(model: Role | null): RoleDTO | null {
    if (!model) return null;
   
    const roleDTO = new RoleDTO();
    roleDTO.id = model._id.toString();
    roleDTO.name = model.name;
    roleDTO.permissions = model.permissions;
    roleDTO.mainNavMenu = model.mainNavMenu;
   
    return roleDTO;
  }
 
  protected modelToDTOArray(models: Role[]): RoleDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }
 
  protected dtoToModel(dto: Partial<RoleDTO>): Partial<Role> {
    if (!dto) return {};
   
    const roleModel: Partial<Role> = {};
   
    if (dto.name !== undefined) roleModel.name = dto.name;
    if (dto.permissions !== undefined) roleModel.permissions = dto.permissions;
    if (dto.mainNavMenu !== undefined) roleModel.mainNavMenu = dto.mainNavMenu;
   
    return roleModel;
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
 
  async findNamesByIds(Ids: string[]): Promise<RoleDTO[]> {
    return  await this.find({ _id: { $in: Ids } });
  }
}