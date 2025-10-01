
import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { RocAssetControlQstnDTO } from "../dtos/rocAssetControlQstn.dto";
import { RocAssetControlQstn } from "../model/rocAssetControlQstn.model";

export interface RocAssetControlDAO extends BaseDAOInterface<RocAssetControlQstn, RocAssetControlQstnDTO> {
  
}
