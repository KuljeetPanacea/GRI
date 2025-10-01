import { Injectable, Inject } from "@nestjs/common";
import { BaseService } from "src/core/service/base.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Transactional } from "src/core/decorators/transaction-decorator";
import { ClientDTO } from "../dto/client.dto";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { UserStatus } from "src/modules/authentication/Constant";
import { ClientDAO } from "../dao/Client.dao";
import { UpdateClientDTO } from "../dto/updateClient.dto";
import { ClientServiceInterface } from "./client.interface";
import {
  DEFAULT_QUERY_OPTIONS,
  FilterOptions,
  QueryOptions,
} from "src/core/database/query-options.interface";
import { ClienResponsetDTO } from "../dto/responseClient.dto";
import { UserService } from "src/modules/user/services/user.service";
@Injectable()
export class ClientService
  extends BaseService
  implements ClientServiceInterface
{
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.CLIENT_DAO) 
    private readonly clientDao: ClientDAO,
     private readonly userService: UserService,
  ) {
    super(connection);
  }

  @Transactional()
  async createClient(
    clientData: ClientDTO
  ): Promise<{ message: string; success: boolean }> {
    if (!clientData.status) {
      clientData.status = UserStatus.Active;
    }
    const leadershipData = {
      "email": clientData.leadershipEmailId,
      "name": clientData.leadershipName,
      "mobileNumber": Number(clientData.leadershipContactNo),
      "roles": ["AELeadership"],
      "username": clientData.leadershipEmailId,
      "countryCode": 91,
    }
await this.userService.createUser(leadershipData)
    await this.clientDao.create(clientData);

    return { message: "Client Created Succesfully" , success: true};
  }

  async updateClient(id: string, clientData: UpdateClientDTO) {
     await this.clientDao.update(id, clientData);
    return { message: "Client Updated successfully" , success: true};
  }

  @Transactional()
  async deleteClient(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const deleted: ClientDTO = await this.clientDao.update(id, {
      status: UserStatus.InActive,
    });
    if (deleted) {
      return {
        success: true,
        message: "Client deleted successfully.",
      };
    }
  }

  async allClient(options: FilterOptions): Promise<{
    clients: ClienResponsetDTO[];
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
    industry?:string;
    entitySize?:string;
    status?:string;
    createDtTime?:string
    clientName?:string
    leadershipContactNo?: string;
    leadershipName?:string;
    leadershipEmailId?:string;
  }> {
    console.log("options",options);
    const isPaginated = options.limit !== undefined || options.page !== undefined;
  
    const limit = options.limit ?? DEFAULT_QUERY_OPTIONS.limit!;
    const page = options.page ?? 1;
    const skip = options.skip ?? ((page - 1) * limit);
   const filter: any = {};

if (options.industry) {
  filter.industry = options.industry;
}
if (options.entitySize) {
  filter.entitySize = options.entitySize;
}
if (options.status) {
  filter.status = options.status;
}

if (options.clientName && options.clientName.trim() !== "") {
  filter.clientName = { $regex: options.clientName.trim(), $options: "i" };
}

if (options.createDtTime === 'lastWeek') {
  const now = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(now.getDate() - 7);
  filter.createDtTime = { $gte: lastWeek, $lte: now };
} else if (options.createDtTime === 'lastMonth') {
  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(now.getMonth() - 1);
  filter.createDtTime = { $gte: lastMonth, $lte: now };
} else if (options.createDtTime === 'last6Months') {
  const now = new Date();
  const last6Months = new Date();
  last6Months.setMonth(now.getMonth() - 6);
  filter.createDtTime = { $gte: last6Months, $lte: now };
} else if (options.createDtTime) {
  filter.createDtTime = options.createDtTime;
}

 console.log("filter",filter);
    const mergedOptions: QueryOptions = {
      ...DEFAULT_QUERY_OPTIONS,
      ...options,
      limit: isPaginated ? limit : undefined,
      skip: isPaginated ? skip : undefined,
      sort: { createDtTime: -1, _id: -1 },
       select: [
      'clientName',
      'status',
      'businessName',
      'pocEmailId',
      'demography',
      'industry',
      'businessEntity',
      'entitySize',
      'websiteLink',
      'pocName',
      'pocContactNumber',
      'createDtTime',      
      'updateDtTime',
      'leadershipName',
      'leadershipContactNo',
      'leadershipEmailId',
    ],
    };
  
    const [clients, totalCount] = await Promise.all([
      this.clientDao.find(filter,mergedOptions),
    this.clientDao.count(filter), 
    ]);
    if (!isPaginated) {
      return { clients };
    }
  
    const totalPages = Math.ceil(totalCount / limit);
    return {
      clients,
      currentPage: page,
      totalPages,
      totalCount,
    };
  }
  

  async getClientById(id: string): Promise<ClientDTO> {
    return await this.clientDao.findById(id);
  }

  async getAssessedEntity(id: string) {
    return await this.clientDao.findById(id);
  }
}
