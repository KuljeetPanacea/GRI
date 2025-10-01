
import { BaseDAOInterface } from "../../../core/dao/base-dao-interface";
import { AssessmentTaskDTO } from "../dtos/assessmentTask.dto";
import { AssessmentTask } from "../model/assessmentTask.model";

export interface IAssessmentTaskDAO extends BaseDAOInterface<AssessmentTask, AssessmentTaskDTO> {
  
}
