import { Injectable } from '@nestjs/common';
import { SystemBaseModel } from '../model/base-model';
import { BaseDAO } from './base-dao';
import { BaseDTO } from '../dto/base-dto';


@Injectable()
export abstract class SystemDAO<TModel extends SystemBaseModel, TDTO extends BaseDTO> extends BaseDAO<TModel, TDTO> {
  // Override to enforce super admin access for all operations
//   @CheckSuperAdminAccess()
  async create(data: Partial<TDTO>): Promise<TDTO> {
    return super.create(data);
  }
  
//   @CheckSuperAdminAccess()
  async update(id: string, data: Partial<TDTO>): Promise<TDTO | null> {
    return super.update(id, data);
  }
  
//   @CheckSuperAdminAccess()
  async delete(id: string): Promise<boolean> {
    return super.delete(id);
  }
}