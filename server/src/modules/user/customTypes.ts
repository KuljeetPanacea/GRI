export interface AuthenticatedRequest extends Request {
    user?: any;
  }

export enum RolesEnum {
  SuperAdmin = "SuperAdmin",
  ProjectManager = "ProjectManager",
  Auditor = "Auditor",
  QA = "QA",
  AELeadership = "AELeadership",
  ClientPoC = "ClientPoC",
  AEStakeholder = "AEStakeholder",
}
  