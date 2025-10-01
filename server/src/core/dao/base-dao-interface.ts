import { ClientSession } from "mongoose";
import { BaseModel } from "../model/base-model";
import { QueryOptions } from "../database/query-options.interface";

export interface BaseDAOInterface<TModel extends BaseModel, TDTO>  {
  create(data: Partial<TDTO>): Promise<TDTO>;
  update(id: string, data: Partial<TDTO>): Promise<TDTO | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string, options?: QueryOptions): Promise<TDTO | null>;
  findOne(filter?: any, options?: QueryOptions): Promise<TDTO | null>;
  findAll(options?: QueryOptions): Promise<TDTO[]>;
  find(filter?: any, options?: QueryOptions): Promise<TDTO[]>;
  count(filter?: any): Promise<number>;
  exists(filter: any): Promise<boolean>;
  aggregate(pipeline: any[], options?: QueryOptions): Promise<any[]>;
  createWithoutTenantFilter(data: Partial<TDTO>): Promise<TDTO>;
}

// export type UpdateData<T> = Partial<T> & {
//   updateDtTime: Date; // Add updateDtTime as optional
//   __v: number; // Add version (__v) as optional
// };
