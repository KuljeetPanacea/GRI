import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

interface PhaseState {
  selectedPhase: string;
  snackbar: SnackbarState;
}

const initialState: PhaseState = {
  selectedPhase: "",
  snackbar: {
    open: false,
    message: "",
    severity: "info",
  },
};

const phaseSlice = createSlice({
  name: "phase",
  initialState,
  reducers: {
    setSelectedPhase: (state, action: PayloadAction<string>) => {
      state.selectedPhase = action.payload;
    },
    showSnackbar: (
      state,
      action: PayloadAction<{
        message: string;
        severity: "success" | "error" | "info" | "warning";
      }>
    ) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    },

    closeSnackbar: (state) => {
      state.snackbar.open = false;
    },
  },
});

export const { setSelectedPhase, showSnackbar, closeSnackbar } =
  phaseSlice.actions;
export const selectSelectedPhase = (state: RootState) =>
  state.phase.selectedPhase;

export default phaseSlice.reducer;
