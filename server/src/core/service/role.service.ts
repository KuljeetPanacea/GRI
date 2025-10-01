import { Injectable, Inject } from "@nestjs/common";
import { Transactional } from "../decorators/transaction-decorator";
import { Role } from "../model/role.model";
import { IRoleDAO } from "../dao/role.dao.interface";
import { DATABASE_CONSTANTS } from "../database/constant";
import { BaseService } from "./base.service";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { RoleDTO } from "../dto/Role.dto";
import { MainNavMenuDTO } from "../dto/mainNavMenu.dto";

@Injectable()
export class RoleService extends BaseService {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.ROLE_DAO) private readonly roleDAO: IRoleDAO,
  ) {
    super(connection);
  }

  async getAllRoles(): Promise<RoleDTO[]> {
    return await this.roleDAO.findAll();
  }

  async getMenuItemsForRoles(roleName: string[]): Promise<MainNavMenuDTO[]> {
    return await this.roleDAO.getMenuItemsForRoles(roleName);
  }

  async getPermissionsForRoles(roleName: string[]): Promise<string[]> {
    return await this.roleDAO.getPermissionsForRoles(roleName);
  }
  
  @Transactional()
  async createRole(roleData: RoleDTO): Promise<RoleDTO> {
    return await this.roleDAO.create(roleData);
  }

  async findRoleByName(name: string[]): Promise<RoleDTO[] | null> {
    return await this.roleDAO.findByNames(name);
  }

  async findRoleNameById(Ids: string[]): Promise<RoleDTO[] | null> {
    return await this.roleDAO.findNamesByIds(Ids);
  }

  // @Transactional()
  // async updateRolePermissions(
  //   roleName: string,
  //   permissions: string[],
  // ): Promise<RoleDTO | null> {
  //   const role = await this.roleDAO.findByNames([roleName]);
  //   if (!role) return null;

  //   return await this.roleDAO.update(role._id as string, { permissions });
  // }
}
