// dto/generate-roc.dto.ts

import { AppendixADTO } from "src/modules/appendix/dtos/appendix-a.dto";
import { AppendixCDTO } from "src/modules/appendix/dtos/appendix-c.dto";
import { AppendixEDTO } from "src/modules/appendix/dtos/appendix-e.dto";
import { RocDataPartOneDTO } from "src/modules/part-I-assessment-overview/dtos/roc-data-part-one.dto";
import { RocControlFindingDTO } from "src/modules/RocControlFinding/dtos/RocControlFinding.dto";


export class GenerateRocDto {
  projectId: string;

  partOne: RocDataPartOneDTO
  partTwo: {
    findings: RocControlFindingDTO[];
  };

  appendices: {
    appendixA: AppendixADTO;
    appendixC: AppendixCDTO;
    appendixE: AppendixEDTO;
  };
}
