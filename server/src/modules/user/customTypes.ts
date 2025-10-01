export interface AuthenticatedRequest extends Request {
    user?: any;
  }

export enum RolesEnum {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
  QSA = "QSA",
  QA = "QA",
  AELeadership = "AELeadership",
  AEPoC = "AEPoC",
  AEStakeholder = "AEStakeholder",
}
  