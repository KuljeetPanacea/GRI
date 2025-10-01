// core/database/tenant.dao.ts
import { Injectable } from '@nestjs/common';
import { BaseDAO } from './base-dao';
import { TenantBaseModel } from '../model/base-model';
import { BaseDTO } from '../dto/base-dto';


@Injectable()
export abstract class TenantDAO<TModel extends TenantBaseModel, TDTO extends BaseDTO> extends BaseDAO<TModel, TDTO> {
  
}