import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { ClientDTO } from "../dto/client.dto";
import { Client } from "../models/client.model";

export interface IClientDAO extends BaseDAOInterface<Client, ClientDTO> {
  findByEmail(email: string): Promise<Client | null>;
}
