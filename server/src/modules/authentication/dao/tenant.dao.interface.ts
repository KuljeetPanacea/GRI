import { Tenant } from "../model/tenant.models";
import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { TenantDTO } from "../dto/Tenant.dto";
import { QueryOptions } from "src/core/database/query-options.interface";

export interface ITenantDAO extends BaseDAOInterface<Tenant, TenantDTO> {
  findByEmail(name: string): Promise<TenantDTO | null>;
}
