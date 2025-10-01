import { Lookup } from "../model/lookup.model";
import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { LookupDTO } from "../dtos/lookup.dto";

export interface IProjectDAO extends BaseDAOInterface<Lookup, LookupDTO> {
  findByEmail(email: string): Promise<Lookup | null>;
}
