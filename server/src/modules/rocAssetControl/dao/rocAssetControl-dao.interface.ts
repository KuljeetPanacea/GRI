
import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { RocAssetControlDTO } from "../dtos/rocAssetControl.dto";
import { RocAssetControl } from "../model/rocAssetControl.model";

export interface RocAssetControlDAO extends BaseDAOInterface<RocAssetControl, RocAssetControlDTO> {
  
}
