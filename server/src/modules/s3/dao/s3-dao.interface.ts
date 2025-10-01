
import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { S3DTO } from "../dtos/s3.dto";
import { S3 } from "../model/s3.model";

export interface IS3DAO extends BaseDAOInterface<S3, S3DTO> {
  
}
