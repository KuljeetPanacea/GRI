import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MainAreaState {
  selectedItem: string;
}

const initialState: MainAreaState = {
  selectedItem: "/dashboard", 
};

const lpMainAreaSlice = createSlice({
  name: "lpMainArea",
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<string>) => {
      state.selectedItem = action.payload;
    },
  },
});

export const { setSelectedItem } = lpMainAreaSlice.actions;
export default lpMainAreaSlice.reducer;
