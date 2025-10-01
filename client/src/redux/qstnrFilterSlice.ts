import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QstnrFilters {
  page?: string;
  name?: string;
  industry?: string;
  industrySize?: string;
  compliance?: string;
  Phase?: string;
  status?: string;
  datePublished?: string;
  deviceType?:string;
  search?: string;
}

interface FilterState {
  Phase: string;
  status: string;
  industry: string;
  industrySize: string;
  search: string;
  compliance: string;
  datePublished: string;
  viewMode: "list" | "grid";  
}

const initialState: FilterState = {
  Phase: "",
  status: "",
  industry: "",
  industrySize: "",
  compliance: "",
  datePublished: "",
  viewMode: "list",
  search: ""

};

const qstnrFilterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof FilterState; value: FilterState[keyof FilterState] }>) => {
      if (action.payload.key === 'viewMode') {
        // Type check for viewMode
        if (action.payload.value === 'list' || action.payload.value === 'grid') {
          state[action.payload.key] = action.payload.value;
        }
      } else {
        state[action.payload.key] = action.payload.value;
      }
    },
    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
    setViewMode: (state, action: PayloadAction<"list" | "grid">) => {
      state.viewMode = action.payload;
    },

      setSearchFilter: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { setFilter, resetFilters, setViewMode, setSearchFilter } = qstnrFilterSlice.actions;
export default qstnrFilterSlice.reducer;
