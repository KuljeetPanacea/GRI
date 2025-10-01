import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";

export interface IdentifiedGapDTO {
  gapDesc: string;
  status: string;
  evidences: string[];
  oldEvidence: string[];
  resolutionComment?: string;
  
}

// interface ProjectState {
//   selectedReqNo: string | null;
//   selectedControlNo: string | null;
//   selectedSubReqNo: string | null;
//   // other fields...
// }
interface ActiveFilter {
  type: "tab" | "device" | null;
  value: string;
}

interface GapRequirement {
  reqNo: string;
  totalGaps: number;
  completedGaps: number;
  description: string;
}

export interface Evidence {
  name: string;
  type: string;
  url: string;
  questionId: string;
  evidenceCategory: string;
  refName: string;
}
export interface GapsRemediation {
  projectId: string;
  reqNo: string;
  id: string;
  subReqNo: string;
  deviceRef: string;
  controlNo: string;
  deviceType: string;
  AEInternalAssessor: string;
  qstnrID: string;
  qstnrName: string;
  qstnrDesc: string;
  assessmentId: string;
  identifiedGaps: string[];
  status: string;
  evidences?: Evidence[];
  resolutionComment?: string;
}

interface GapsRemediationState {
  requirementsData: GapRequirement[];
  gapRemediationData: GapsRemediation[];
  totalNoOfGaps: number;
  PendingQsa: number;
  PendingClient: number;
  loading: boolean;
  error: string | null;
  selectedReqNo: null,
  ActiveFilter: ActiveFilter,
  selectedControlNoGap: string | null;
  selectedSubReqNoGap: string | null;
  selectedReqNoGap: string | null;
  selectedAEInternalAssessorGap: string | null
  isGapremediation: boolean;
  reviseQstnObject: object;
  gapRemediationDropdown: {
    title: string;
    options: string[];
  };
}

const initialState: GapsRemediationState = {
  requirementsData: [],
  gapRemediationData: [],
  totalNoOfGaps: 0,
  PendingQsa: 0,
  PendingClient: 0,
  loading: false,
  error: null,
   selectedReqNo: null,
   ActiveFilter: { type: "tab", value: "Requirement" },
   selectedReqNoGap: null,
  selectedControlNoGap: null,
  selectedSubReqNoGap: null,
  selectedAEInternalAssessorGap: null,
  isGapremediation: false,
  reviseQstnObject: {},
  gapRemediationDropdown: {
    title: "",
    options: []
  }
};

interface FetchGapsPayload {
  projectId: string;
  axiosInstance: AxiosInstance;
  reqNo?: string;
  deviceRef?: string;
  deviceType?: string;
  AEInternalAssessor?: string;
}

// 👉 Thunk using axiosInstance
export const fetchGapsRequirements = createAsyncThunk(
  "gapsRemediation/fetchGapsRequirements",
  async (
    { projectId, axiosInstance }: FetchGapsPayload,
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(
        `/api/RocAssetControl/find-allreq-data/${projectId}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch requirements"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const fetchGapsRemediation = createAsyncThunk(
  "gapsRemediation/fetchGapsRemediation",
  async (
    { projectId, reqNo, axiosInstance }: FetchGapsPayload,
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(
        `/api/RocAssetControl/find-req-data/${reqNo}/${projectId}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch requirements"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
)
export const fetchGapsDevices = createAsyncThunk(
  "gapsRemediation/fetchGapsDevices",
  async (
    { projectId, deviceType, axiosInstance }: FetchGapsPayload,
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(
        `/api/RocAssetControl/find-device-gaps/${projectId}/${deviceType}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch requirements"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
)
export const fetchOnestakeholderGaps = createAsyncThunk(
  "gapsRemediation/fetchOnestakeholderGaps",
  async (
    { projectId, AEInternalAssessor, axiosInstance }: FetchGapsPayload,
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(
        `/api/RocAssetControl/find-Onestakeholder-Gaps/${projectId}/${AEInternalAssessor}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch requirements"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
)
export const fetchOneDevicesRef = createAsyncThunk(
  "gapsRemediation/fetchOneDevicesRef",
  async (
    { projectId, deviceRef, axiosInstance }: FetchGapsPayload,
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(
        `/api/RocAssetControl/find-OnedeviceRef-gaps/${projectId}/${deviceRef}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch requirements"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
)
const gapsRemediationSlice = createSlice({
  name: "gapsRemediation",
  initialState,
  reducers: {
    // Reducers to handle state changes
    setIsGapRemediation: (state, action: PayloadAction<boolean>) => {
      state.isGapremediation = action.payload;
    },

    setReviseQstnObject: (state, action: PayloadAction<object>) => {
      state.reviseQstnObject = action.payload;
    },
   setGapRemediationDropdown: (
  state,
  action: PayloadAction<{ title: string; options: string[] }>
) => {
  state.gapRemediationDropdown = action.payload;
}
,
    resetIsGapremediation: (state) => {
      state.isGapremediation = false;  
    },
 setActiveFilterRedux(state, action: PayloadAction<ActiveFilter>) {
      state.ActiveFilter = action.payload;
    },
 resetActiveFilterRedux(state) {
      state.ActiveFilter = { type: "tab", value: "Requirement" };
    },
  setSelectedReqNo: (state, action) => {
    state.selectedReqNo = action.payload;
  },
  resetSelectedReqNo: (state) => {
    state.selectedReqNo = null;
  },

   setSelectedReqNoGap(state, action: PayloadAction<string>) {
      state.selectedReqNoGap = action.payload;
    },
    setSelectedControlNoGap(state, action: PayloadAction<string>) {
      state.selectedControlNoGap = action.payload;
    },
    setSelectedSubReqNoGap(state, action: PayloadAction<string>) {
      state.selectedSubReqNoGap = action.payload;
    },
    setsetAEInternalAssesorGap(state, action: PayloadAction<string>) {
      state.selectedAEInternalAssessorGap = action.payload;
    },
resetSelectedControlNoGap(state) {
      state.selectedControlNoGap = "";
    },
    resetSelectedReqNoGap(state) {
      state.selectedReqNoGap = "";
     
    },
    resetSelectedSubReqNoGap(state) {
      state.selectedSubReqNoGap = "";
    },
    resetsetAEInternalAssesorGap(state) {
      state.selectedAEInternalAssessorGap = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGapsRequirements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGapsRequirements.fulfilled, (state, action) => {
        state.loading = false;
        state.requirementsData = action.payload.data;
        state.totalNoOfGaps = action.payload.totalNoOfGaps;
        state.PendingClient = action.payload.PendingClient;
        state.PendingQsa = action.payload.PendingQsa;
        
     
      })
      .addCase(fetchGapsRequirements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      builder
      .addCase(fetchGapsRemediation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGapsRemediation.fulfilled, (state, action) => {
        state.loading = false;
        state.gapRemediationData = action.payload;
      })
      .addCase(fetchGapsRemediation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      builder
      .addCase(fetchGapsDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGapsDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.gapRemediationData = action.payload;
      })
      .addCase(fetchGapsDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      builder
      .addCase(fetchOneDevicesRef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneDevicesRef.fulfilled, (state, action) => {
        state.loading = false;
        state.gapRemediationData = action.payload;
      })
      .addCase(fetchOneDevicesRef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      builder
      .addCase(fetchOnestakeholderGaps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnestakeholderGaps.fulfilled, (state, action) => {
        state.loading = false;
        state.gapRemediationData = action.payload;
      })
      .addCase(fetchOnestakeholderGaps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const {setReviseQstnObject,setGapRemediationDropdown,setIsGapRemediation,resetIsGapremediation,resetSelectedReqNo,resetActiveFilterRedux,resetsetAEInternalAssesorGap,setsetAEInternalAssesorGap,resetSelectedSubReqNoGap,resetSelectedControlNoGap, setSelectedReqNo,resetSelectedReqNoGap ,setActiveFilterRedux, setSelectedReqNoGap, setSelectedControlNoGap, setSelectedSubReqNoGap} = gapsRemediationSlice.actions;

export default gapsRemediationSlice.reducer;
