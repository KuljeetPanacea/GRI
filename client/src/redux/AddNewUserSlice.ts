import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { addUsers } from "../api/user";

export interface User {
    // _id: string;
    name: string;
    email: string;
    password?: string;
    username?: string;
    roles?: string[];
    countryCode: number;
    mobileNumber: number;
    __v: number;
}

interface UserManagementState {
    isAddUserModalOpen: boolean;
    users: User[];
    loading: boolean;
    error: string | { message: string; status?: number } | null;
    dropdownRoles: string[],
}

const initialState: UserManagementState = {
    isAddUserModalOpen: false,
    loading: false,
    error: null,
    users: [],
    dropdownRoles: [],
};

interface AddUserResponse{
    success: boolean;
    user: User;
}

export const addUser= createAsyncThunk<AddUserResponse,{ userData: User, axiosInstance: AxiosInstance },{ rejectValue: { message: string; status?: number } }>(
    "/user/createuser",
    async ({ userData, axiosInstance }, { rejectWithValue }) => {
        console.log("Making API request with data:", userData);
        try {
            const response = await addUsers(axiosInstance, userData);
            console.log("Add User API response:", response.data);
            return response;
        }
        catch (error:any) {
          const message =
          error?.response?.data?.message || error?.message || "Something went wrong";
          const status = error?.response?.status;
          return rejectWithValue({ message, status });
        }
    });

const newUserModalSlice = createSlice({
    name: "usermodal",
    initialState,
    reducers: {
        openAddNewUserModal: (state) => {
            state.isAddUserModalOpen = true;
          },
          closeAddNewUserModal: (state) => {
            state.isAddUserModalOpen = false;
          },
        toggleAddUserModal: (state, action: PayloadAction<boolean>) => {
            state.isAddUserModalOpen = action.payload;
        },
    },
    extraReducers: (builder) => {
            builder
                .addCase(addUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(addUser.fulfilled, (state, action) => {
                    state.loading = false;
                    state.users.push(action.payload.user);
                })
                .addCase(addUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as { message: string; status?: number };
                    console.log("Error details:", action.error);
                });
        },
});

export const { toggleAddUserModal, openAddNewUserModal, closeAddNewUserModal } = newUserModalSlice.actions;
export default newUserModalSlice.reducer;
