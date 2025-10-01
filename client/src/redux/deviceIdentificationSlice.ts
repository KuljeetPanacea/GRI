import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { device } from "./projectManagementSlice";
import { fetchProjectDevices, addDevice, deleteDeviceFromProject } from "../api/project";
import { AxiosInstance } from "axios";

interface DeviceIdentificationState {
  activeTab: string;
  searchTerm: string;
  isModalOpen: boolean;
  devices: device[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  totalCount: number;
  filteredCategory: string;
}

const initialState: DeviceIdentificationState = {
  activeTab: "Device",
  searchTerm: "",
  isModalOpen: false,
  devices: [],
  loading: false,
  error: null,
  currentPage: 1,
  rowsPerPage: 4,
  totalPages: 1,
  totalCount: 0,
  filteredCategory: "All",
};

// Async thunk for fetching devices
export const fetchDevicesAsync = createAsyncThunk(
  'deviceIdentification/fetchDevices',
  async ({ projectId, options, axiosInstance }: { projectId: string; options?: { page?: number; limit?: number; search?: string; deviceType?: string; department?: string }; axiosInstance: AxiosInstance }, { rejectWithValue }) => {
    try {
      const response = await fetchProjectDevices(axiosInstance, projectId, options);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch devices');
    }
  }
);

// Async thunk for adding a device
export const addDeviceAsync = createAsyncThunk(
  'deviceIdentification/addDevice',
  async ({ device, projectId, axiosInstance }: { device: device; projectId: string; axiosInstance: AxiosInstance }, { rejectWithValue }) => {
    try {
      const response = await addDevice(axiosInstance, { ...device, projectId });
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add device');
    }
  }
);

// Async thunk for deleting a device
export const deleteDeviceAsync = createAsyncThunk(
  'deviceIdentification/deleteDevice',
  async ({ projectId, deviceRefName, axiosInstance }: { projectId: string; deviceRefName: string; axiosInstance: AxiosInstance }, { rejectWithValue }) => {
    try {
      await deleteDeviceFromProject(axiosInstance, projectId, deviceRefName);
      return deviceRefName;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete device');
    }
  }
);

const deviceIdentificationSlice = createSlice({
  name: "deviceIdentification",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
    },
    setFilteredCategory: (state, action: PayloadAction<string>) => {
      state.filteredCategory = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch devices
    builder
      .addCase(fetchDevicesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevicesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.devices || [];
        state.totalPages = action.payload.totalPages || 1;
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchDevicesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add device
      .addCase(addDeviceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDeviceAsync.fulfilled, (state, action) => {
        state.loading = false;
        // After adding a device, we need to refetch to get proper pagination
        // The device will be included in the next fetch
        if (action.payload.audit) {
          state.totalCount += 1;
          
          // Recalculate total pages based on new total count
          const newTotalPages = Math.ceil(state.totalCount / state.rowsPerPage);
          state.totalPages = newTotalPages;
          
          // If we're on the last page and it's full, move to the new page
          if (state.currentPage === newTotalPages - 1 && state.devices.length >= state.rowsPerPage) {
            state.currentPage = newTotalPages;
          }
        }
      })
      .addCase(addDeviceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete device
      .addCase(deleteDeviceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeviceAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted device from the list
        state.devices = state.devices.filter(device => device.deviceRefName !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteDeviceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setActiveTab, 
  setSearchTerm, 
  setModalOpen, 
  setCurrentPage, 
  setRowsPerPage, 
  setFilteredCategory,
  clearError 
} = deviceIdentificationSlice.actions;

// Selectors
export const selectActiveTab = (state: RootState) => state.deviceIdentification.activeTab;
export const selectSearchTerm = (state: RootState) => state.deviceIdentification.searchTerm;
export const selectIsModalOpen = (state: RootState) => state.deviceIdentification.isModalOpen;
export const selectDevices = (state: RootState) => state.deviceIdentification.devices;
export const selectDevicesLoading = (state: RootState) => state.deviceIdentification.loading;
export const selectDevicesError = (state: RootState) => state.deviceIdentification.error;
export const selectCurrentPage = (state: RootState) => state.deviceIdentification.currentPage;
export const selectRowsPerPage = (state: RootState) => state.deviceIdentification.rowsPerPage;
export const selectTotalPages = (state: RootState) => state.deviceIdentification.totalPages;
export const selectTotalCount = (state: RootState) => state.deviceIdentification.totalCount;
export const selectFilteredCategory = (state: RootState) => state.deviceIdentification.filteredCategory;

export default deviceIdentificationSlice.reducer;

