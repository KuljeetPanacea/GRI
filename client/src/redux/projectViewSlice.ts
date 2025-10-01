import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Project } from "./projectManagementSlice";


interface ProjectState {
  selectedProject: Project | null;
  isDetailsOpen: boolean;
}

const initialState: ProjectState = {
  selectedProject: null,
  isDetailsOpen:false
  
};

const projectViewSlice = createSlice({
  name: "projectView",
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<Project>) => {
      state.selectedProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
    
    setCurrentAuditStage: (state, action) => {
      if (state.selectedProject) {
        state.selectedProject.currentAuditStage = action.payload;
      }
    },
    setIsDetailsOpen:(state,action) => {
      state.isDetailsOpen = action.payload
    },
    updateSelectedProjectAssessors: (state, action: PayloadAction<Array<{
      name: string;
      email: string;
      role: string;
      department: string;
      mobileNumber: string;
    }>>) => {
      if (state.selectedProject) {
        state.selectedProject.aeInternalAssessors = [
          ...(state.selectedProject.aeInternalAssessors || []),
          ...action.payload
        ];
      }
    },
  },
});

export const {
  setSelectedProject,
  clearSelectedProject,
  setCurrentAuditStage,
  updateSelectedProjectAssessors,
  setIsDetailsOpen
} = projectViewSlice.actions;

export const selectSelectedProject = (state: RootState) =>
  state.projectView.selectedProject || null;

export default projectViewSlice.reducer;
