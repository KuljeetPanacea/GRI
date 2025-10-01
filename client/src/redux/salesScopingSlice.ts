import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface qstnr {
  id?: string;
  title?: string;
  createDtTime?: string;
  datePublished?: string;
  lastUpdated?: string;
  createdBy?: string;
  selected?: boolean;
  default?: boolean;
  scopingQSTRNRData?: object
}

interface qstnrState {
  qstnr: qstnr[];
  viewMode: "VIEW" | "ADD_EDIT" | null;
  addEditMode: "ADD_EXISTING" | "CREATE_NEW" | null;
}

const initialState: qstnrState = {
  qstnr: [],
  viewMode: "VIEW",
  addEditMode: "ADD_EXISTING",
};

const salesScopingSlice = createSlice({
  name: "salesScopingSlice",
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<string[]>) => {
      state.qstnr.forEach((q) => {
        q.selected = action.payload.includes(q.id ?? "");
      });
    },

    toggleDefaultStatus: (state, action: PayloadAction<string>) => {
      state.qstnr.forEach((q) => {
        q.default = q.id === action.payload ? !q.default : false; // Ensure only one is default
      });
    },

    setViewMode: (state, action: PayloadAction<"VIEW" | "ADD_EDIT">) => {
      state.viewMode = action.payload;
      if (action.payload === "VIEW") {
        state.addEditMode = null;
      }
    },

    setAddEditMode: (
      state,
      action: PayloadAction<"ADD_EXISTING" | "CREATE_NEW">
    ) => {
      state.viewMode = "ADD_EDIT";
      state.addEditMode = action.payload;
    },
  },
});

export const {
  toggleSelection,
  toggleDefaultStatus,
  setViewMode,
  setAddEditMode,
} = salesScopingSlice.actions;

export const selectAllQuestionnaires = (state: RootState) =>
  state.salesScoping.qstnr;
export const selectSelectedQuestionnaires = (state: RootState) =>
  state.salesScoping.qstnr.filter((q) => q.selected);
export const selectViewMode = (state: RootState) => state.salesScoping.viewMode;
export const selectAddEditMode = (state: RootState) =>
  state.salesScoping.addEditMode;

export default salesScopingSlice.reducer;
