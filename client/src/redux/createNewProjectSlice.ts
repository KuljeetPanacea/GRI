import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";
import { addProjects, updateProject } from "../api/project";
import { aeInternalAssessor } from "./projectManagementSlice";
import store from "./store";

export interface auditEntity{
  assessedEntityname?:string;
  assessedDba?:string;
  pocEmail?: string;
  pocPhoneNumber?:string;
  pocName?:string;
  assessedWebsiteLink?:string;
  leadershipName?:string;
  leadershipContactNo?: string;
  leadershipEmailId?:string;
}

export interface assignedEntity{
  id:string;
  role:string;
  name:string;
}

export interface SelectedClient{
  clientId?:string;
  clientName?:string;
  clientDBA?:string;
  clientEmailAddress?:string;
  clientContactNumber?:string;
  clientPocName?:string;
  clientWebsiteLink?:string;
  leadershipName?:string;
  leadershipContactNo?: string;
  leadershipEmailId?:string;
}

export interface NewProject{
      projectName: string;
      description:string;
      currentAuditStage?: string;
      client?:string;
      createdByName?:string;
      createdByEmail?:string;
      auditEntity?: auditEntity;
      status?: string;
      tenantId?: string;
      isSameEntity?:boolean;
      message?:string;
      scopingQSTRNR?:string[];
      assignedTo?: assignedEntity[];
      aeInternalAssessors ?: aeInternalAssessor[];
      __v:number;
}

interface createNewProjectState {
  activeStep: number;
  ProjectId: string;
  Project: NewProject;
  isLoading: boolean;
  error: string | null;
  client?: SelectedClient;
  formType?:string;
}

// Initial state
const initialState: createNewProjectState = {
  activeStep: 0,
  ProjectId:"",
  Project: {
    description: "",
    projectName: "",
    __v: 0,
  },
  isLoading: false,
  error: null,
  client: {
    clientName: "",
    clientDBA: "",
    clientEmailAddress: "",
    clientContactNumber: "",
    clientPocName: "",
    clientWebsiteLink: "",
    leadershipName: "",
    leadershipContactNo: "",
    leadershipEmailId: "",
  },
  formType:"add",
};

// Async thunk for submitting form data

export const submitProject = createAsyncThunk(
  "createNewProject/submitProject",
  async (
    {
      Project,
      axiosInstance,
    }: { Project: NewProject; axiosInstance: AxiosInstance },
    { rejectWithValue }
  ) => {
    try {
      const ProjectData = {
        ...Project,
        createdByName: store.getState().login.username,
        createdByEmail: store.getState().login.user?.email
        
      }
      console.log("This is the Project", ProjectData);
      const response = await addProjects(axiosInstance, ProjectData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Error submitting project"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const updateProjectAsync = createAsyncThunk(
  "createNewProject/updateProject",
  async (
    {
      updatedProjectData,
      axiosInstance,
    }: { updatedProjectData: Partial<NewProject>; axiosInstance: AxiosInstance },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { createNewProject: createNewProjectState };
      const projectId = state.createNewProject.ProjectId;

      console.log("This is the data being added in the updatedProjectData", updatedProjectData);
      
      const cleanUpdate = { ...updatedProjectData };
      delete cleanUpdate.isSameEntity;
      delete cleanUpdate.message;

      console.log("This is the data being added in the Cleaned Project data", cleanUpdate);
      
      const response = await updateProject(axiosInstance, projectId, cleanUpdate);

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Error updating project"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Slice definition
const createNewProjectSlice = createSlice({
  name: "createNewProject",
  initialState,
  reducers: {
    setFormType: (state, action: PayloadAction<string>) => {
      state.formType = action.payload;
    },
    updateFormField: <K extends keyof NewProject>(
      state: createNewProjectState,
      action: PayloadAction<{ field: K; value: NewProject[K] }>
    ) => {
      state.Project[action.payload.field] = action.payload.value;
    },
    updateSelectedClient: (
      state: createNewProjectState,
      action: PayloadAction<SelectedClient>
    ) => {
      state.client = { ...action.payload };
    }, 
    setProjectId: (state, action: PayloadAction<string>) => {
      state.ProjectId = action.payload;
    },
    nextStep: (state) => {
      if (state.activeStep < 4) state.activeStep += 1;
    },
    prevStep: (state) => {
      if (state.activeStep > 0) state.activeStep -= 1;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    resetProject: (state) => {
      state.Project = {
        description: "",
        projectName: "",
        __v: 0,
      };
      state.activeStep = 0;
      state.ProjectId = "";
      state.isLoading = false;
      state.error = null;
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(submitProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ProjectId = action.payload.projectId;
        console.log("This is the action payload from submit project fulfilled", action.payload);
      })
      .addCase(submitProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProjectAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProjectAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Project = { ...state.Project, ...action.payload }; // Merge updated data
      })
      .addCase(updateProjectAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateFormField, nextStep, prevStep, setStep, resetProject, updateSelectedClient, setProjectId, setFormType } =
  createNewProjectSlice.actions;
export default createNewProjectSlice.reducer;
