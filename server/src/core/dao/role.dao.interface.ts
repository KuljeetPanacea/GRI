import { Role } from "../model/role.model";
import { BaseDAOInterface } from "../dao/base-dao-interface";
import { RoleDTO } from "../dto/Role.dto";
import { MainNavMenuDTO } from "../dto/mainNavMenu.dto";

export interface IRoleDAO extends BaseDAOInterface<Role, RoleDTO> {
  findByNames(name: string[]): Promise<RoleDTO[] | null>;
  getPermissionsForRoles(roleName: string[]): Promise<string[]>;
  getMenuItemsForRoles(roleName: string[]): Promise<MainNavMenuDTO[]>
  findNamesByIds(Ids: string[]): Promise<RoleDTO[] | null>;
}
