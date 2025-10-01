import { Injectable, Inject } from "@nestjs/common";
import { BaseService } from "src/core/service/base.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { RocControlFindingDAO } from "../dao/RocControlFinding.DAO";
import { RocControlDataResponse, RocControlFindingDTO } from "../dtos/RocControlFinding.dto";

@Injectable()
export class RocControlFindingService extends BaseService {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.ROCControlFinding_DAO)
    private readonly rocControlFindingDao: RocControlFindingDAO,
  ) {
    super(connection);
  }

  async create(data: RocControlFindingDTO): Promise<RocControlFindingDTO> {
    const { projectId, assessmentId, controlNo } = data;   
  
    const existing = await this.rocControlFindingDao.findOne({
      projectId,
      assessmentId,
      controlNo,
    });

    if (existing) {
      return await this.rocControlFindingDao.update(existing.id,data)
    } else {
      return await this.rocControlFindingDao.create(data);
    }

  }

  async update(id: string, data: Partial<RocControlFindingDTO>): Promise<RocControlFindingDTO> {
    return await this.rocControlFindingDao.update(id, data);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
     await this.rocControlFindingDao.delete(id);
    return { success: true, message: 'RocData entry deleted successfully' };
  }

  async getRoc(control: string, assessmentId: string, projectId: string): Promise<RocControlFindingDTO | { message: string }> {
    const filter = {
      controlNo: control,
      assessmentId,
      projectId,
    };
    const result = await this.rocControlFindingDao.findOne(filter);
    return result || { "message": "Not Found" };
  }

  async getControlData(projectId, controlNo): Promise<RocControlDataResponse> {
    const result = await this.rocControlFindingDao.find({ projectId, controlNo });
    const object = {
      controlNo:result[0].controlNo,
      controlAssessmentFinding: result[0].controlAssessmentFinding,
      detailed_finding: result[0].detailed_finding,
      compensatingControl: result[0].compensatingControl,
      customizedApproach: result[0].customizedApproach,
      evidences: result[0].evidences
    }
    return object;
  }

  async getAllControlData(projectId): Promise<RocControlDataResponse[]> {
    const result = await this.rocControlFindingDao.find({ projectId });
    return result;
  }
}
