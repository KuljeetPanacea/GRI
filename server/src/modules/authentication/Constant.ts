export enum UserRole {
    SuperAdmin = "SuperAdmin",
    ClientPOC= "ClientPoC",
    TENANT_ADMIN = "TENANT_ADMIN",
    PRODUCT_ADMIN = "PRODUCT_ADMIN",
    AEStakeholder = "AEStakeholder",
    ProjectManager = "ProjectManager",
    Auditor = "Auditor"
  }

  export enum UserStatus {
    Active = "active",
    InActive = "Inactive",
    InProgress = "In-Progress",
  }

  export enum ProjectStatus {
    DRAFT = 'Draft',
    InProgress = 'In-Progress',
    COMPLETED = 'completed',
    WITHDRAWN = 'Withdrawn',
    YetToStart = "yetToStart",
  }

  export enum ProjectAuditStage {
    PRE_SCOPING = 'preScoping',
    SCOPING = 'scoping',
    DEVICE_IDENTIFICATION = 'deviceIdentification',
    ASSESSMENT = 'assessment',
    GAP_AND_REMEDIATION = 'gapAndRemediation',
    COMPLIANCE_REPORT = 'complianceReport',
  }
  