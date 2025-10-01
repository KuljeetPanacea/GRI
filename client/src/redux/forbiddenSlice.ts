// forbiddenSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const forbiddenSlice = createSlice({
  name: 'forbidden',
  initialState: { has403: false },
  reducers: {
    setForbidden: (state) => { state.has403 = true; },
    clearForbidden: (state) => { state.has403 = false; }
  }
});

export const { setForbidden, clearForbidden } = forbiddenSlice.actions;
export default forbiddenSlice.reducer;
