import { Project } from "../model/project.model";
import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { ProjectDTO } from "../dtos/project.dto";

export interface IProjectDAO extends BaseDAOInterface<Project, ProjectDTO> {
  findByEmail(email: string): Promise<Project | null>;
}
