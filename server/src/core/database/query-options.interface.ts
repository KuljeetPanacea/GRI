// core/database/interfaces/query-options.interface.ts
export interface QueryOptions {
  page?: number; // Should be optional and a number, not `any`
  readPreference?:
    | "primary"
    | "secondary"
    | "primaryPreferred"
    | "secondaryPreferred"
    | "nearest";
  populate?: string | string[] | PopulateOptions | PopulateOptions[];
  sort?: Record<string, 1 | -1 | "asc" | "desc">;
  limit?: number;
  skip?: number;
  select?: string | string[] | Record<string, 0 | 1>;
  lean?: boolean;
}

export interface PopulateOptions {
  path: string;
  select?: string;
  model?: string;
  match?: any;
  options?: any;
  populate?: string | PopulateOptions | PopulateOptions[];
}
export interface FilterOptions extends QueryOptions {
  industry?: string;
  entitySize?: string;
  status?: string;
  createDtTime?: string;
  clientName?: string;
  projectStage?: string;
  ongoingProjects?: string;
  qsa?: string;
  projectStatus?: string;
  currentAuditStage?: string;
  roles?: string[];
  name?: string;
  mobileNumber?: number;
  projectName?: string;
}

export const DEFAULT_QUERY_OPTIONS: QueryOptions = {
  limit: 10,
  sort: { createdAt: -1 },
  readPreference: "primary",
  page: 1,
};
