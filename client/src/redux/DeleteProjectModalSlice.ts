import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Replace with your actual API base URL
});

interface Project {
  projectId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  assignedUsers: string[];
  createdBy: string;
  status?: string;
}

const initialState = {
  isDeleteModalOpen: false,
  projects: [] as Project[],
  projectIdToDelete: null as number | null,
};

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`api/project/deleteproject/${projectId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log('Delete Project API response:', response.data);
        return projectId; // Return the ID to remove it from the Redux store
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      if(error instanceof Error){
        
        return rejectWithValue(error.message || "Failed to delete project");
      }
    }
  }
);

const modalSlice = createSlice({
  name: 'projectDeleteModal',
  initialState,
  reducers: {
    openDeleteModal: (state, action) => {
      state.isDeleteModalOpen = true;
      state.projectIdToDelete = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.projectIdToDelete = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteProject.pending, (state) => {
        state.isDeleteModalOpen = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((project) => project.projectId !== action.payload);
        state.isDeleteModalOpen = false;
        state.projectIdToDelete = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        console.error(action.payload);
        state.isDeleteModalOpen = false;
      });
  },
});

export const { openDeleteModal, closeDeleteModal } = modalSlice.actions;
export default modalSlice.reducer;