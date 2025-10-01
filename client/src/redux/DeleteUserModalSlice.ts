import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteUsers } from '../api/user';
import axios, { AxiosInstance } from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  countryCode: number;
  mobileNumber: number;
  status: string;
  __v: number;
}

const initialState = {
  isDeleteModalOpen: false,
  users: [] as User[],
  userIdToDelete: null as string | null,
};

export const deleteUser = createAsyncThunk<
  { userId: string; message: string }, // returned on success
  { userId: string; axiosInstance: AxiosInstance },
  { rejectValue: string } // returned on failure
>(
  'user/deleteUser',
  async ({ userId, axiosInstance }, { rejectWithValue }) => {
    try {
      const response = await deleteUsers(axiosInstance, userId);
      console.log("Delete User API response:", response);
      if (response.success) {
        return { userId, message: response.message };
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete user");
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);


const modalSlice = createSlice({
  name: 'userDeleteModal',
  initialState,
  reducers: {
    openDeleteModal: (state, action) => {
      state.isDeleteModalOpen = true;
      state.userIdToDelete = action.payload;
    },

    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.userIdToDelete = null;
    },
  },
  
   extraReducers: (builder) => {
      builder
        .addCase(deleteUser.pending, (state) => {
          state.isDeleteModalOpen = true;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
          state.users = state.users.filter((user) => user.id !== action.payload.userId);
          state.isDeleteModalOpen = false;
          state.userIdToDelete = null;
        })
        .addCase(deleteUser.rejected, (state, action) => {
          console.error(action.payload);
          state.isDeleteModalOpen = false;
        });
    },
});

export const { openDeleteModal, closeDeleteModal } = modalSlice.actions;
export default modalSlice.reducer;
