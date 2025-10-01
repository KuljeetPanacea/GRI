// features/viewSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface ViewState {
  currentView: 'list' | 'grid';
}

const initialState: ViewState = {
  currentView: 'list'
};

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setView: (state, action) => {
      state.currentView = action.payload;
    }
  }
});

export const { setView } = viewSlice.actions;
export default viewSlice.reducer;