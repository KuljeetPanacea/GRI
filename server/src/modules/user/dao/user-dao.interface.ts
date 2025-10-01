import { User } from "../models/user.model";
import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { QueryOptions } from "src/core/database/query-options.interface";
import { UserDTO } from "../dtos/User.dto";

export interface IUserDAO extends BaseDAOInterface<User, UserDTO> {
  findByEmail(email: string, options?: QueryOptions): Promise<UserDTO | null>
  findOneWithoutTenantFilter(filter: any, options?: QueryOptions);
}
