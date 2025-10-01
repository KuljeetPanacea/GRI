import { createSlice } from "@reduxjs/toolkit";

interface SideMenuState {
  isCollapsed: boolean;
}

const initialState: SideMenuState = {
  isCollapsed: true,
};

const lpSideMenuSlice = createSlice({
  name: "lpSideMenu",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
  },
});

export const { toggleSidebar } = lpSideMenuSlice.actions;
export default lpSideMenuSlice.reducer;
