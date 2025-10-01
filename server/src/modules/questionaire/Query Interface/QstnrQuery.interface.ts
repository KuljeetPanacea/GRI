import { title } from "process";
import { QueryOptions } from "src/core/database/query-options.interface";

export interface QstnrQueryOptions extends QueryOptions{
    industrySize?: string;
    complianceType?: string;
    industryType?: string;
    phase?: string;
    status?: boolean;
    search?: string;
    createdStartDate?: string;
    createdEndDate?: string;
    appID?: string;
    isDeleted?: boolean;
    deviceType?: string;
  }

  export function buildQuestionnaireFilters(options: QstnrQueryOptions): Record<string, any> {
    const filter: Record<string, any> = {
      isDeleted: options.isDeleted ?? false,
    };

    if (options.industrySize) filter.industrySize = options.industrySize;
    if (options.complianceType) filter.complianceType = options.complianceType;
    if (options.industryType) filter.industryType = options.industryType;
    if (options.phase) filter.phase = options.phase;
    if (options.appID) filter.appID = options.appID;
    if (options.status !== undefined) filter.status = options.status;
    if (options.deviceType !== undefined) filter.deviceType = options.deviceType;
  
    if (options.createdStartDate || options.createdEndDate) {
      filter.createDtTime = {};
      if (options.createdStartDate) {
        filter.createDtTime.$gte = new Date(options.createdStartDate);
      }
      if (options.createdEndDate) {
        filter.createDtTime.$lte = new Date(options.createdEndDate);
      }
    }
  
   if (options.search) {
    filter.$or = [
      { title: { $regex: options.search, $options: 'i' } },
    ];
  }
  
    return filter;
  }