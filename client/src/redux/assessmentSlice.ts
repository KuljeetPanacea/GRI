import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Control } from "../features/AuditProjectFlow/phases/Assessment/useAssessmentView";
import { RocControlFindingDTO } from "../api/rocData";
import { AssessmentQuestion } from "../features/AuditProjectFlow/phases/Assessment/useExpandPanel";
import { EvidenceType } from "../features/AuditProjectFlow/phases/Assessment/components/useEvidenceUpload";

interface Comment {
  Date: string;
  Comment: string;
}

interface ModalData {
  id: string;
  content: string;
  comments: Comment[];
}

interface RowData {
  id: string;
  name: string;
}

export type Evidence = {
  name: string;
  type: string;
  url: string;
  questionId: string;
  qstnrId: string;
  evidenceCategory: string;
  refName: string;
  testingProcedure: string;
  uploadedAt: string;
};

interface AssessmentState {
  sortBy: string;
  requirementData: string;
  stakeholderData: string;
  deviceData: string;
  modalData: ModalData | null;
  newComment: string;
  selectedOptions: Record<string, boolean>;
  selectedRow: RowData | null;
  selectedDeviceName: string;
  selectedReq: string;
  selectedControl: Control | null;
  openSubReq: Record<string, boolean>;
  sidebarOpen: boolean;
  drawerOpen: boolean;
  phaseType: string;
  expandablePanelHeight: string;
  isExpandablePanelExpanded: boolean;
  selectedExpandableButton: string;
  assessmentId:string;
  ControlFinding: RocControlFindingDTO;
  ControlQuestions: AssessmentQuestion[];
  selectedDeviceKey: string;
  evidences: EvidenceType[];
  oldEvidences: EvidenceType[];
  newEvidences: EvidenceType[];
  tableLoading: boolean;
  currentQuestionIndex: number;
  AISummaryDialogOpen: boolean;
  AISummary: string | null;
  AISummaryLoading: boolean;
  AISummaryError: string | null;
}

const initialState: AssessmentState = {
  sortBy: "Requirement",
  requirementData: "",
  stakeholderData: "",
  deviceData: "",
  modalData: null,
  newComment: "",
  selectedOptions: {},
  selectedRow: null,
  selectedDeviceName: "",
  selectedReq: "Req-1",
  selectedControl: null,
  openSubReq: {},
  sidebarOpen: true,
  drawerOpen: false,
  phaseType: "Router",
  expandablePanelHeight: "100%",
  isExpandablePanelExpanded: false,
  selectedExpandableButton: "Details",
  assessmentId: "",
  ControlFinding:{
    projectId: "",
    assessmentId: "",
    controlNo: "",
    controlAssessmentFinding: "In Place",
    detailed_finding: "",
    evidences: [],
    compensatingControl: false,
    customizedApproach: false,
    modeOfAssessment: {
      mode: "Remote",
      compensation: ""
    }
  },
  ControlQuestions:[],
  selectedDeviceKey: "",
  evidences:[],
  oldEvidences: [],
  newEvidences: [],
  tableLoading: false,
  currentQuestionIndex: 0,
  AISummaryDialogOpen: false,
  AISummary: null,
  AISummaryLoading: false,
  AISummaryError: null,
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setRequirementData: (state, action: PayloadAction<string>) => {
      state.requirementData = action.payload;
    },
    setStakeholderData: (state, action: PayloadAction<string>) => {
      state.stakeholderData = action.payload;
    },
    setDeviceData: (state, action: PayloadAction<string>) => {
      state.deviceData = action.payload;
    },
    setModalData: (state, action: PayloadAction<ModalData | null>) => {
      state.modalData = action.payload;
    },
    setNewComment: (state, action: PayloadAction<string>) => {
      state.newComment = action.payload;
    },
    addComment: (state) => {
      if (state.modalData && state.newComment) {
        state.modalData.comments.push({
          Date: new Date().toISOString().split("T")[0],
          Comment: state.newComment,
        });
        state.newComment = "";
      }
    },
    setSelectedOptions: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.selectedOptions[action.payload.key] = action.payload.value;
    },
    setSelectedRow: (state, action: PayloadAction<{ row: string; deviceName: string }>) => {
      state.selectedRow = { id: action.payload.row, name: action.payload.deviceName };
      state.selectedDeviceName = action.payload.deviceName;
    },
    setSelectedReq: (state, action: PayloadAction<string>) => {
      state.selectedReq = action.payload;
    },
    setSelectedControl: (state, action: PayloadAction<Control | null>) => {
      state.selectedControl = action.payload;
    },
    toggleSubReq: (state, action: PayloadAction<string>) => {
      state.openSubReq[action.payload] = !state.openSubReq[action.payload];
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
    },
    setPhaseType: (state, action: PayloadAction<string>) => {
      state.phaseType = action.payload;
    },
    toggleExpandablePanel: (state) => {
      state.isExpandablePanelExpanded = !state.isExpandablePanelExpanded;
      state.expandablePanelHeight = state.isExpandablePanelExpanded ? "75%" : "100%";
    },
    setSelectedExpandableButton: (state, action: PayloadAction<string>) => {
      state.selectedExpandableButton = action.payload;
    },
    setSelectedAssesmentId: (state, action: PayloadAction<string>) => {
      state.assessmentId = action.payload;
    },
    setSelectedControlFinding: (state, action: PayloadAction<RocControlFindingDTO>) => {
      state.ControlFinding = action.payload;
    },
    setSelectedControlQuestions: (state, action: PayloadAction<AssessmentQuestion[]>) => {
      state.ControlQuestions = action.payload;
    },
    setSelectedDeviceKey: (state, action: PayloadAction<string>) => {
      state.selectedDeviceKey = action.payload;
    },
    setSelectedEvidences: (state, action: PayloadAction<EvidenceType[]>) => {
      state.evidences = action.payload;
    },
    setSelectedOldEvidences: (state, action: PayloadAction<EvidenceType[]>) => {
      state.oldEvidences = action.payload;
    },
    setSelectedNewEvidences: (state, action: PayloadAction<EvidenceType[]>) => {
      state.newEvidences = action.payload;
    },
    resetControlFinding: (state) => {
      state.ControlFinding = {
        projectId: "",
        assessmentId: "",
        controlNo: "",
        controlAssessmentFinding: "In Place",
        detailed_finding: "",
        evidences: [],
        compensatingControl: false,
        customizedApproach: false,
        modeOfAssessment: {
          mode: "Remote",
          compensation: ""
        }
      };
    },
    setTableLoading: (state, action: PayloadAction<boolean>) => {
      state.tableLoading = action.payload;
    },
    clearAllSubReqs: (state) => {
      state.openSubReq = {};
    },
    setSelectedSubReq: (state, action: PayloadAction<string>) => {
      state.openSubReq = {};
      state.openSubReq[action.payload] = true;
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    openAISummaryDialog: (state) => {
      state.AISummaryDialogOpen = true;
    },
    closeAISummaryDialog: (state) => {
      state.AISummaryDialogOpen = false;
      state.AISummary = null;
      state.AISummaryError = null;
    },
    setAISummaryLoading: (state, action: PayloadAction<boolean>) => {
      state.AISummaryLoading = action.payload;
    },
    setAISummary: (state, action: PayloadAction<string>) => {
      state.AISummary = action.payload;
      state.AISummaryLoading = false;
      state.AISummaryError = null;
    },
    setAISummaryError: (state, action: PayloadAction<string>) => {
      state.AISummaryError = action.payload;
      state.AISummaryLoading = false;
    },
  },
});

export const {
  setSortBy,
  setRequirementData,
  setStakeholderData,
  setDeviceData,
  setModalData,
  setNewComment,
  addComment,
  setSelectedOptions,
  setSelectedRow,
  setSelectedReq,
  setSelectedControl,
  toggleSubReq,
  setSidebarOpen,
  setDrawerOpen,
  setPhaseType,
  toggleExpandablePanel,
  setSelectedExpandableButton,
  setSelectedAssesmentId,
  setSelectedControlFinding,
  setSelectedControlQuestions,
  setSelectedDeviceKey,
  setSelectedEvidences,
  setSelectedOldEvidences,
  setSelectedNewEvidences,
  resetControlFinding,
  setTableLoading,
  clearAllSubReqs,
  setSelectedSubReq,
  setCurrentQuestionIndex,
  openAISummaryDialog,
  closeAISummaryDialog,
  setAISummaryLoading,
  setAISummary,
  setAISummaryError,
} = assessmentSlice.actions;


export const selectSortBy = (state: RootState) => state.assessment.sortBy;
export const selectRequirementData = (state: RootState) => state.assessment.requirementData;
export const selectStakeholderData = (state: RootState) => state.assessment.stakeholderData;
export const selectDeviceData = (state: RootState) => state.assessment.deviceData;
export const selectModalData = (state: RootState) => state.assessment.modalData;
export const selectSelectedReq = (state: RootState) => state.assessment.selectedReq;
export const selectSelectedControl = (state: RootState) => state.assessment.selectedControl;
export const selectOpenSubReq = (state: RootState) => state.assessment.openSubReq;
export const selectSidebarOpen = (state: RootState) => state.assessment.sidebarOpen;
export const selectDrawerOpen = (state: RootState) => state.assessment.drawerOpen;
export const selectPhaseType = (state: RootState) => state.assessment.phaseType;
export const selectAssessmentId = (state: RootState) => state.assessment.assessmentId;
export const selectControlFinding = (state: RootState) => state.assessment.ControlFinding;
export const SelectedControlQuestions = (state: RootState) => state.assessment.ControlQuestions;
export const selectedDeviceKey = (state: RootState) => state.assessment.selectedDeviceKey;
export const selectedEvidences = (state: RootState) => state.assessment.evidences;
export const selectedOldEvidences = (state: RootState) => state.assessment.oldEvidences;
export const selectedNewEvidences = (state: RootState) => state.assessment.newEvidences;
export const selectTableLoading = (state: RootState) => state.assessment.tableLoading;
export const selectExpandablePanelState = (state: RootState) => ({
  height: state.assessment.expandablePanelHeight,
  isExpanded: state.assessment.isExpandablePanelExpanded,
  selectedButton: state.assessment.selectedExpandableButton
});
export const selectCurrentQuestionIndex = (state: RootState) => state.assessment.currentQuestionIndex;
export const selectAISummaryDialogOpen = (state: RootState) => state.assessment.AISummaryDialogOpen;
export const selectAISummary = (state: RootState) => state.assessment.AISummary;
export const selectAISummaryLoading = (state: RootState) => state.assessment.AISummaryLoading;
export const selectAISummaryError = (state: RootState) => state.assessment.AISummaryError;

export default assessmentSlice.reducer;
