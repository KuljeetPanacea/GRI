import { Injectable, NotFoundException } from "@nestjs/common";
import { AppendixService } from "src/modules/appendix/service/appendix.service";
import { RocDataPartOneService } from "src/modules/part-I-assessment-overview/service/roc-data-part-one.service";
import { RocControlFindingService } from "src/modules/RocControlFinding/service/rocControlFinding.service";
import { RocControlDataResponse } from "src/modules/RocControlFinding/dtos/RocControlFinding.dto";
import { AppendixADTO } from "src/modules/appendix/dtos/appendix-a.dto";
import { AppendixCDTO } from "src/modules/appendix/dtos/appendix-c.dto";
import { AppendixEDTO } from "src/modules/appendix/dtos/appendix-e.dto";

export interface RocData {
  projectId: string;
  partOneData: any | null;
  controlFindings: RocControlDataResponse[];
  appendixData: [AppendixADTO | null, AppendixCDTO | null, AppendixEDTO | null];
}

@Injectable()
export class RocDataFetcher {
  constructor(
    private readonly partOneService: RocDataPartOneService,
    private readonly controlFindingService: RocControlFindingService,
    private readonly appendixService: AppendixService
  ) {}

  async fetch(projectId: string): Promise<RocData> {
    const [partOne, findings, appendixList] = await Promise.all([
      this.partOneService.getByProjectId(projectId),
      this.controlFindingService.getAllControlData(projectId),
      this.appendixService.getAppendixByProjectId(projectId),
    ]);

    const noData =
      !partOne &&
      (!findings || findings.length === 0) &&
      (!appendixList || appendixList.length === 0);

    if (noData) {
      throw new NotFoundException(`No ROC data found for project: ${projectId}`);
    }

    // Map appendix list into tuple [AppendixADTO|null, AppendixCDTO|null, AppendixEDTO|null]
    const appendixMap: Record<string, AppendixADTO | AppendixCDTO | AppendixEDTO | null> = {
      "appendix-a": null,
      "appendix-c": null,
      "appendix-e": null,
    };

    for (const item of appendixList || []) {
      if (item.appendixType in appendixMap) {
        // Ensure the object matches the required DTO by copying properties and setting appendixType as required
        appendixMap[item.appendixType] = {
          ...item,
          appendixType: item.appendixType ?? "", // fallback to empty string if undefined
        } as AppendixADTO | AppendixCDTO | AppendixEDTO;
      }
    }

    return {
      projectId,
      partOneData: partOne || null,
      controlFindings: findings || [],
      appendixData: [
        appendixMap["appendix-a"] as AppendixADTO | null,
        appendixMap["appendix-c"] as AppendixCDTO | null,
        appendixMap["appendix-e"] as AppendixEDTO | null,
      ],
    };
  }
}
