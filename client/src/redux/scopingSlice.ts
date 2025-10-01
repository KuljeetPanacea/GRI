import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScopingState {
  activeTab: string;
}

const initialState: ScopingState = {
  activeTab: "Questionnaire", 
};

const scopingSlice = createSlice({
  name: "scoping",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = scopingSlice.actions;
export default scopingSlice.reducer;
