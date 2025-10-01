import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ControlStructure } from "../features/Roc_Parts/Part_2/types";

export interface Control {
  id: string;
  title: string;
  desc?:string;
}

export interface SubRequirement {
  id: number;
  title: string;
  desc?:string;
  controls?: ControlStructure[];
}

export interface Requirement {
  id: number;
  reqName: string;
  reqDesc?: string;
  subReq?: SubRequirement[];
}

interface ComplianceState {
  selectedReq: Requirement | null;
  selectedSubReq: SubRequirement | null;
  selectedControl: ControlStructure | null;
  pageEdit: boolean;
  variables: Record<string, string | number | boolean>;
  isChanged: boolean;
}

const initialState: ComplianceState = {
  selectedReq: null,
  selectedSubReq: null,
  selectedControl: null,
  pageEdit: false,
  variables: {},
  isChanged: false,
};

const complianceReportSlice = createSlice({
  name: "complianceReport",
  initialState,
  reducers: {
    setSelectedReq: (state, action: PayloadAction<Requirement | null>) => {
      state.selectedReq = action.payload;
      state.selectedSubReq = null;
      state.selectedControl = null;
    },
    setSelectedSubReq: (state, action: PayloadAction<SubRequirement | null>) => {
      state.selectedSubReq = action.payload;
      if (!action.payload) state.selectedControl = null;
    },
    setSelectedControl: (state, action: PayloadAction<ControlStructure | null>) => {
      state.selectedControl = action.payload;
    },
    togglePageEdit: (state) => {
      state.pageEdit = !state.pageEdit;
    },
    setVariables: (state, action: PayloadAction<Record<string, string | number | boolean>>) => {
      state.variables = action.payload;
      state.isChanged = true; 
    },
    resetChanges: (state) => {
      state.isChanged = false;
      state.pageEdit = false;
    },
    setIsChanged: (state, action: PayloadAction<boolean>) => {
      state.isChanged = action.payload; 
    },
  },
});

export const {
  setSelectedReq,
  setSelectedSubReq,
  setSelectedControl,
  togglePageEdit,
  setVariables,
  resetChanges,
  setIsChanged, // ✅ Now exported
} = complianceReportSlice.actions;

export default complianceReportSlice.reducer;
