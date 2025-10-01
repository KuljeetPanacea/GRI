import { Injectable, Inject } from "@nestjs/common";
import { BaseService } from "src/core/service/base.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { LookupDAO } from "../dao/lookup.dao";
import { LookupDTO } from "../dtos/lookup.dto";
import { LookupResponseDTO } from "../dtos/lookup-response.dto";

@Injectable()
export class LookupService extends BaseService {

  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.LOOKUP_DAO) private readonly lookupDAO: LookupDAO,
  ) {
    super(connection);
  }

  async createLookup(lookupData: LookupDTO): Promise<LookupResponseDTO> {
    const response = await this.lookupDAO.create(lookupData)
    if(response)
    {
        return { message: "Lookup Inserted successfully", lookupId: response.id}
    }
  }

  async getLookupByCategory(category:string): Promise< LookupDTO[]> {
    const filter = {
        category:category
    }
    return await this.lookupDAO.find(filter)
  }
}
