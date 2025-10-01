import { BaseDAOInterface } from '../../../core/dao/base-dao-interface';
import { RocPartOne } from '../model/roc-part-one.model';
import { RocDataPartOneDTO } from '../dtos/roc-data-part-one.dto';

export interface IRocPartOneDAO extends BaseDAOInterface<RocPartOne, RocDataPartOneDTO> {
  findByProjectId(projectId: string): Promise<RocPartOne | null>;
}
