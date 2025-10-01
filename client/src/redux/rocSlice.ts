// redux/slices/roc.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RocState {
  hasUnsavedChanges: boolean;
}

const initialState: RocState = {
  hasUnsavedChanges: false,
};

const rocSlice = createSlice({
  name: 'roc',
  initialState,
  reducers: {
    setHasUnsavedChanges(state, action: PayloadAction<boolean>) {
      state.hasUnsavedChanges = action.payload;
    },
    markAsDirty(state) {
      state.hasUnsavedChanges = true;
    },
    markAsClean(state) {
      state.hasUnsavedChanges = false;
    },
  },
});

export const {
  setHasUnsavedChanges,
  markAsDirty,
  markAsClean,
} = rocSlice.actions;

export default rocSlice.reducer;
