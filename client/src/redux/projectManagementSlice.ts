import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import {
  cdeDocument,
  deleteProjects,
  fetchProjectsOfLoginUser,
  getProjects,
} from "../api/project";
import { User } from "./userManagementSlice";
import { NextQuestion } from "./DigitalAvatarSlice";

export interface auditEntity {
  pocEmail?: string;
  pocName: string;
  pocPhoneNumber?: string;
  assessedEntityname?: string;
  assessedDba?: string;
  assessedWebsiteLink?: string;
}

export interface assignedEntity {
  id: string;
  role: string;
  name: string;
}

export interface aeInternalAssessor {
  name: string;
  email: string;
  role: string;
  department: string;
  mobileNumber: string;
  // assignedDevice: string;
}

interface SelectedClient {
  clientId?: string;
  clientName?: string;
  businessName?: string;
  pocEmailId?: string;
  pocContactNumber?: string;
  pocName?: string;
  websiteLink?: string;
  leadershipName?:string;
  leadershipContactNo?: string;
  leadershipEmailId?:string;
}

export interface scopingQSTRNR {
  id?: string;
  title?: string;
  description?: string;
  default?: boolean;
  createDtTime?: string;
  createdBy?: string;
  updateDtTime?: string;
  complianceType?: string;
  status?: string;
  questions?: NextQuestion[];
  createdByName?: string;
  phase?:string; // Added phase field
  currentQuestionTracker?: string;
  hasAllUserResponses?: boolean;
  isCompletedAllQuestions?: boolean;
  gaps?: string;
}

interface taskEvidence {
   fileName: string;
  fileType: string;
  s3Path: string;
  uploadedAt: Date;
  uploadedBy: string;
  questionId: string;
}
export interface device {
  deviceRefName?: string;
  deviceType?: string;
  questionnaireId?: string;
  department?: string;
  primaryAEStakeholderId?: string;
  ipAddress?: string;
  selectedDeviceVersion?: number;
  projectId?: string;
  questionnaire?: scopingQSTRNR;
  createDtTime?: string;
  evidences?: taskEvidence[];
  hasAllUserResponses?: boolean;
  id?: string;
  _id?:string;
  identifiedGaps?: [];
  assessmentId?:string
  deviceRef?:string
}

export interface Project {
  clientInfo?: SelectedClient;
  _id?: string;
  projectName: string;
  description?: string;
  currentAuditStage?: string;
  updateDtTime: string;
  status?: string;
  tenantId?: string;
  auditEntity?: auditEntity;
  client?: string;
  scopingQSTRNRData?: scopingQSTRNR[];
  device?: device[];
  __v?: number;
  AEStakeholders?: User[];
  assignedTo?: assignedEntity[];
  createDtTime?: string;
  createdByName?: string;
  createdByEmail?: string;
  aeInternalAssessors?: aeInternalAssessor[];
  cdeDocs?: cdeDocument[];
  ScopeDocument?: object;
  scopingQSTRNR?:string[];
}

export interface PaginatedProjectResponse {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface ProjectFilter {
  search: string;
  projectStatus: string;
  projectStage: string;
  ongoingProjects: string;
  qsa: string;
  complianceType: string;
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  totalCount: number;
  selectedRows: string[];
  selectedReviseQstnId: string;
  viewMode: "list" | "grid";
  projects: Project[];
  editingProject: Project | null;
  loading: boolean;
  error: string | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
  selectedQstnr?: scopingQSTRNR | null;
  draftStatus?: "" | "started" | "inprogress";
  ScopeDocument?: object; 
  selectedTask?: device; 
  readOnlyViewQuestion?: NextQuestion[]


}
const initialState: ProjectFilter = {
  search: "",
  projectStatus: "",
  projectStage: "All",
  ongoingProjects: "",
  qsa: "All",
  complianceType: "",
  currentPage: 1,
  rowsPerPage: 5,
  totalPages: 1,
  totalCount: 0,
  selectedRows: [],
  viewMode: "list",
  projects: [],
  editingProject: null,
  loading: false,
  error: null,
  selectedQstnr: null,
  deleteStatus: "idle",
  deleteError: null,
  draftStatus: "",
  ScopeDocument: {}, // <-- Added this line
  selectedReviseQstnId: "",
  readOnlyViewQuestion: []
};


// **🔹 Fetch Projects from API**
export const fetchProjects = createAsyncThunk<
  PaginatedProjectResponse,
  { 
    axiosInstance: AxiosInstance;
    page?: number; 
    limit?: number;
    projectStatus?: string;
    projectStage?: string;
    ongoingProjects?: string;
    qsa?: string;
    search?: string;
  }
>(
  "projectManagement/fetchProjects",
  async ({ 
    axiosInstance, 
    page, 
    limit,
    projectStatus,
    projectStage,
    ongoingProjects,
    qsa,
    search
   }, { rejectWithValue }) => {
    try {
      const response = await getProjects(
        axiosInstance, 
        page, 
        limit,
        projectStatus,
        projectStage,
        ongoingProjects,
        qsa,
        search
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchProjectById = createAsyncThunk<
  PaginatedProjectResponse,
  {
    axiosInstance: AxiosInstance;
    userId: string;
    role: string[];
    page?: number;
    limit?: number;
    projectStatus?: string;
    ongoingProjects?: string;
    search?:string;
  }
>(
  "projectManagement/fetchProjectById",
  async ({ axiosInstance, userId, role, page, limit, projectStatus, ongoingProjects, search }, { rejectWithValue }) => {
    try {
      const response = await fetchProjectsOfLoginUser(
        axiosInstance,
        userId,
        role,
        page,
        limit,
        projectStatus,
        ongoingProjects,
        search
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// **🔹 Delete Project Thunk**
export const deleteProjectThunk = createAsyncThunk<
  { projectId: string },
  { axiosInstance: AxiosInstance; projectId: string }
>(
  "projectManagement/deleteProject",
  async ({ axiosInstance, projectId }, { rejectWithValue }) => {
    try {
      await deleteProjects(axiosInstance, projectId);
      return { projectId };
    } catch (error: unknown) {
      // Axios error: extract backend message if available
      let backendMessage =
        "An unknown error occurred while deleting the project";
      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        backendMessage =
          err?.response?.data?.message || err?.message || backendMessage;
      }
      return rejectWithValue(backendMessage);
    }
  }
);

const projectManagementSlice = createSlice({
  name: "projectManagement",
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<"list" | "grid">) => {
      state.viewMode = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.currentPage = 1;
    },
    setSelectedQSTNR: (state, action: PayloadAction<scopingQSTRNR | null>) => {
      state.selectedQstnr = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<device>) => {
    
      state.selectedTask = action.payload;
    },
    
   setReadOnlyViewQuestion: (state, action: PayloadAction<NextQuestion[]>) => {
        state.readOnlyViewQuestion = action.payload;
      },
    clearSelectedQSTNR: (state) => {
      state.selectedQstnr = null;
    },
    setProjectStatusFilter: (state, action: PayloadAction<string>) => {
      state.projectStatus = action.payload;
      state.currentPage = 1;
    },
    setScope_document: (state, action: PayloadAction<object>) => {
      state.ScopeDocument = action.payload;

    },
    setProjectStageFilter: (state, action: PayloadAction<string>) => {
      state.projectStage = action.payload;
      state.currentPage = 1;
    },
    setOngoingProjectsFilter: (state, action: PayloadAction<string>) => {
      state.ongoingProjects = action.payload;
      state.currentPage = 1;
    },
    setQsaFilter: (state, action: PayloadAction<string>) => {
      state.qsa = action.payload;
      state.currentPage = 1;
    },
    setComplianceTypeFilter: (state, action: PayloadAction<string>) => {
      state.complianceType = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
    },
    setSelectedRows: (state, action: PayloadAction<string[]>) => {
      state.selectedRows = action.payload;
    },
    setSelectedReviseQstnId: (state, action: PayloadAction<string>) => {
      state.selectedReviseQstnId = action.payload;
    },
    setEditingProject: (state, action: PayloadAction<Project | null>) => {
      state.editingProject = action.payload;
    },
    resetProjectFilters: (state) => {
      state.search = "";
      state.projectStatus = "";
      state.projectStage = "All";
      state.ongoingProjects = "";
      state.qsa = "All";
      state.complianceType = "";
      state.currentPage = 1;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    editProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(
        (project) => project._id === action.payload._id
      );
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    // This is kept for local UI updates, but async deletion is handled by the thunk
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(
        (project) => project._id !== action.payload
      );
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
    setDraftStatus: (
      state,
      action: PayloadAction<"" | "started" | "inprogress">
    ) => {
      state.draftStatus = action.payload;
    },
    resetDraftStatus: (state) => {
      state.draftStatus = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects cases
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.error = null;
        console.log(
          "This is the action.payload for the All projects fetch",
          action.payload
        );
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch project by ID cases
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = Array.isArray(action.payload.projects)
          ? action.payload.projects
          : [action.payload.projects];
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.error = null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete project cases
      .addCase(deleteProjectThunk.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteProjectThunk.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        // Remove the deleted project from the state
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload.projectId
        );
        // If the deleted project was being edited, clear the editing state
        if (
          state.editingProject &&
          state.editingProject._id === action.payload.projectId
        ) {
          state.editingProject = null;
        }
        // Remove from selected rows as well
        state.selectedRows = state.selectedRows.filter(
          (id) => id !== action.payload.projectId
        );
      })
      .addCase(deleteProjectThunk.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to delete project";
      });
  },
});

export const selectPaginationState = (state: {
  projectManagement: ProjectFilter;
}) => {
  return {
    currentPage: state.projectManagement.currentPage,
    rowsPerPage: state.projectManagement.rowsPerPage,
    totalPages: state.projectManagement.totalPages,
    totalCount: state.projectManagement.totalCount,
  };
};

// Select delete operation status
export const selectDeleteStatus = (state: {
  projectManagement: ProjectFilter;
}) => {
  return {
    status: state.projectManagement.deleteStatus,
    error: state.projectManagement.deleteError,
  };
};

// **🔹 Selector Function to Get Filtered Projects**
export const selectFilteredProjects = (state: {
  projectManagement: ProjectFilter;
}) => {
  const {
    search,
    projectStatus,
    projectStage,
    ongoingProjects,
    qsa,
    complianceType,
    projects,
  } = state.projectManagement;
  return projects.filter((project) => {
    const matchesSearch = project.projectName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = projectStatus
      ? project.status === projectStatus
      : true;
    const matchesStage =
      projectStage === "All" || project.currentAuditStage === projectStage;
    const matchesQsa =
      qsa === "All" ||
      project.assignedTo?.find((entity) => entity.role === "QSA")?.id === qsa;
    
    // Filter by compliance type
    const matchesComplianceType = complianceType
      ? project.scopingQSTRNRData?.some(qstnr => 
          qstnr.complianceType?.toLowerCase() === complianceType.toLowerCase()
        ) || project.device?.some(device => 
          device.questionnaire?.complianceType?.toLowerCase() === complianceType.toLowerCase()
        )
      : true;
    
    const projectLastUpdated = new Date(project.updateDtTime).getTime();

    let matchesOngoing = true;
    if (ongoingProjects) {
      const filterDate = new Date(ongoingProjects).getTime();
      if (!isNaN(filterDate)) {
        matchesOngoing = projectLastUpdated >= filterDate; 
      }
    }
    return (
      matchesSearch &&
      matchesStatus &&
      matchesStage &&
      matchesOngoing &&
      matchesQsa &&
      matchesComplianceType
    );
  });
};

export const {
  setViewMode,
  setSearchFilter,
  setProjectStatusFilter,
  setProjectStageFilter,
  setOngoingProjectsFilter,
  setQsaFilter,
  setComplianceTypeFilter,
  setCurrentPage,
  setRowsPerPage,
  setSelectedRows,
  setEditingProject,
  resetProjectFilters,
  addProject,
  editProject,
  deleteProject,
  setSelectedQSTNR,
  clearSelectedQSTNR,
  resetDeleteStatus,
  setDraftStatus, 
  resetDraftStatus,
  setScope_document,
  setSelectedTask,
  setSelectedReviseQstnId,
    setReadOnlyViewQuestion
} = projectManagementSlice.actions;

export default projectManagementSlice.reducer;
