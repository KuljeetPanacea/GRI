import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createQuestionnaire, deleteQuestionnaire, duplicateQuestionnaire, evaluateQstn, evaluateQuestionnaire, getQuestionnaires } from "../api/qstnr";
import { AxiosInstance } from "axios";

export interface FilterState {
  phase: string;
  industryType: string;
  industrySize: string;
  complianceType: string;
  deviceType: string;
}
 interface QstnrFilters {
  page?: string;
  name?: string;
  industry?: string;
  industrySize?: string;
  compliance?: string;
  Phase?: string;
  status?: string;
  datePublished?: string;
}
// Define the combined state interface
export interface DefineQstnrState {
  title: string;
  description: string;
  filters: {
    deviceType: string;
    phase: string;
    industryType: string;
    industrySize: string;
    complianceType: string;
  
  };

  // Questionnaire ID state
  qstnr: {
    questionnaireId: string;
  } | null;
  phase:string;
  loading: boolean;
  error: string | null;
  qstnrList: [];
  nextQuestionData: Record<string, unknown>;
  totalPages: number;
  totalCount: number;
  currentPage: number;
  selectedQuestionnaire?: string;
}

// Initial state
const initialState: DefineQstnrState = {
  title: "",
  description: "",

  filters: {
    deviceType: "",
    phase: "",
    industryType: "",
    industrySize: "",
    complianceType: "",
  },

  qstnr: null,
  phase:"",
  loading: false,
  error: null,
  qstnrList: [],
  nextQuestionData:{},
  totalPages: 1,      // <-- add this
  totalCount: 0, 
  currentPage: 1,
  selectedQuestionnaire: "",
};
interface CreateQstnrThunkPayload {
  data: object;
  axiosInstance: AxiosInstance;
}
interface GetQstnrThunkPayload {
  filters: QstnrFilters;
  axiosInstance: AxiosInstance;
   currentPage?: number; // add this line
  limit?: number; 
}

interface EvaluateQstnrPayload {
  data: Record<string, unknown>;
}

interface DuplicateQstnrParams {
  id: string;
  axiosInstance: AxiosInstance;
}

interface DeleteQstnrParams {
  id: string;
  axiosInstance: AxiosInstance;
}

export const createQstnrThunk = createAsyncThunk(
  "defineQstnr/createQstnrThunk",
  async ({ data, axiosInstance }: CreateQstnrThunkPayload, { dispatch }) => {
    try {
      const response = await createQuestionnaire(data, axiosInstance);
      if (response && response.id) {
        dispatch(addQstnrId(response.id));
      } else {
        throw new Error("Invalid response: " + JSON.stringify(response));
      }
      return response;
    } catch (error) {
      console.error("Error in createQstnrThunk:", error);
      throw error;
    }
  }
);
export const getQstnrThunk = createAsyncThunk(
  "defineQstnr/getQstnrThunk",
  async ({ filters, axiosInstance ,currentPage,limit}: GetQstnrThunkPayload) => {
    try {
      const data = await getQuestionnaires(filters, axiosInstance, currentPage,limit);
      return data;
    } catch (error) {
      console.error("Error in createQstnrThunk:", error);
      throw error;
    }
  }
);

export const evaluateQstnrThunk = createAsyncThunk(
  "defineQstnr/evaluateQstnrThunk",
  async ({payload, axiosInstance }: {payload: object; axiosInstance: AxiosInstance }) => {
    try {
      const response = await evaluateQstn( payload, axiosInstance);
      return response;
    } catch (error) {
      console.error("Error in createQstnrThunk:", error);
      throw error;
    }
}
);

export const evaluateQstnrQuestionThunk = createAsyncThunk(
  "defineQstnr/evaluateQstnrThunk",
  async ({payload, axiosInstance }: {payload: object; axiosInstance: AxiosInstance }) => {
    try {
      const response = await evaluateQuestionnaire( payload, axiosInstance);
      return response;
    } catch (error) {
      console.error("Error in createQstnrThunk:", error);
      throw error;
    }
}
);


export const duplicateQstnrThunk = createAsyncThunk<void, DuplicateQstnrParams>(
  "questionnaire/duplicate",
  async ({ id, axiosInstance }, { rejectWithValue }) => {
    try {
      await duplicateQuestionnaire(id, axiosInstance);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const deleteQstnrThunk = createAsyncThunk<void, DeleteQstnrParams>(
  "questionnaire/delete",
  async ({ id, axiosInstance }, { rejectWithValue }) => {
    try {
      await deleteQuestionnaire(id, axiosInstance);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const defineQstnrSlice = createSlice({
  name: "defineQstnr",
  initialState,
  reducers: {
    // Title & Description
    setName: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setQstnrPhase:(state, action:PayloadAction<string>)=>{
          state.phase = action.payload;
    },

     setSelectedQstnrName: (state, action: PayloadAction<string>) => {
      state.selectedQuestionnaire = action.payload;
    },
     setCurrentPage: (state, action: PayloadAction<number>) => {
          state.currentPage = action.payload;
        },
    // Filters
    setFilter: (state, action: PayloadAction<{ key: keyof DefineQstnrState['filters']; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    resetFilters: (state) => {
      state.filters = {
        deviceType: "",
        phase: "",
        industryType: "",
        industrySize: "",
        complianceType: "",
      };
    },

    // Questionnaire ID
    addQstnrId: (state, action: PayloadAction<string>) => {
      state.qstnr = { questionnaireId: action.payload };
    },

    clearQstnr: (state) =>{
      state.qstnr = {questionnaireId: ""};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQstnrThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQstnrThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createQstnrThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create questionnaire";
      });


      builder
      .addCase(getQstnrThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQstnrThunk.fulfilled, (state, action) => {
        state.qstnrList = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getQstnrThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


      builder .addCase(evaluateQstnrThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(evaluateQstnrThunk.fulfilled, (state, action: PayloadAction<EvaluateQstnrPayload>) => {
        state.loading = false;
        state.nextQuestionData = action.payload?.data || {}; 
      })
      .addCase(evaluateQstnrThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to evaluate questionnaire";
      });
  },
});

// Export actions
export const { setName,setCurrentPage,  setSelectedQstnrName, setDescription, setFilter, resetFilters, addQstnrId, clearQstnr, setQstnrPhase } = defineQstnrSlice.actions;

// Export reducer
export default defineQstnrSlice.reducer;
