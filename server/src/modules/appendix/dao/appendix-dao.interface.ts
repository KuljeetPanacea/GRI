import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { Appendix } from "../model/appendix.model";
import { AppendixADTO } from "../dtos/appendix-a.dto";
import { AppendixCDTO } from "../dtos/appendix-c.dto";
import { AppendixEDTO } from "../dtos/appendix-e.dto";

export interface IAppendixDAO extends BaseDAOInterface<Appendix, AppendixADTO | AppendixCDTO | AppendixEDTO> {
  findByProjectIdAndType(projectId: string, appendixType: string): Promise<Appendix | null>;
  findAllByProjectId(projectId: string): Promise<Appendix[]>;
  findByAppendixType(appendixType: string): Promise<Appendix[]>;
}
