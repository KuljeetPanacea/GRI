
import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { RocControlFindingDTO } from "../dtos/RocControlFinding.dto";
import { RocControlFinding } from "../model/RocControlFinding.model";

export interface RocDAO extends BaseDAOInterface<RocControlFinding, RocControlFindingDTO> {
  
}
