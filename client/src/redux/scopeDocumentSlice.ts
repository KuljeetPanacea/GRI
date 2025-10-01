import { createSlice, PayloadAction } from "@reduxjs/toolkit";
 
interface ScopingState {
  activeTab: string;
}
 
const initialState: ScopingState = {
  activeTab: "Objective",
};
 
const scopingSlice = createSlice({
  name: "scopeDocument",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});
 
export const { setActiveTab } = scopingSlice.actions;
export default scopingSlice.reducer;