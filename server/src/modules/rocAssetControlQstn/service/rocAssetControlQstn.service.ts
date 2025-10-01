import { Injectable, Inject } from "@nestjs/common";
import { BaseService } from "src/core/service/base.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { RocAssetControlQstnDTO } from "../dtos/rocAssetControlQstn.dto";
import { RocAssetControlQstnDAO } from "../dao/rocAssetControlQstn.DAO";

@Injectable()
export class RocAssetControlQstnService extends BaseService {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.RocAssetControl_DAO)
    private readonly rocDataDao: RocAssetControlQstnDAO,
  ) {
    super(connection);

  }

  async create(data: RocAssetControlQstnDTO): Promise<RocAssetControlQstnDTO> {
    return await this.rocDataDao.create(data);

  }

  async update(id: string, data: Partial<RocAssetControlQstnDTO>): Promise<RocAssetControlQstnDTO> {
    return await this.rocDataDao.update(id, data);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
     await this.rocDataDao.delete(id);
    return { success: true, message: 'RocData entry deleted successfully' };
  }

  async getQuestions(projectId,controlNo,deviceRef): Promise<RocAssetControlQstnDTO[]> {
    const filter ={
      projectId,
      controlNo,
      deviceRef
    }
    console.log(projectId,"projectid")
    console.log(controlNo,"controlNo")
    return await this.rocDataDao.find(filter);
  }

async getQuestionnaireById(
  projectId: string,
  controlNo: string,
  deviceRef: string
): Promise<{ qstnDesc: string; response: string }[]> {
  const filter = {
    projectId,
    controlNo,
    deviceRef
  };

  const data = await this.rocDataDao.find(filter);

  return data.map(item => ({
    qstnDesc: item.qstnDesc,
    response: item.response
  }));
}

}
