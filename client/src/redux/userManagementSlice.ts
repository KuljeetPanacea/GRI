import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { getUsers } from "../api/user";
interface SnackbarState {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }

export interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
    countryCode: number;
    mobileNumber: number;
    status: string;
    createDtTime?: string;
    updateDtTime?: string;
    __v: number;
}

interface PaginatedUserResponse{
    users: User[];
    currentPage: number;
    totalPages:number;
    totalCount:number;
}

interface UserFilter {
    search: string;
    roles: string[] | string ;
    status: string;
    usersOnboarded:string;
    currentPage: number;
    rowsPerPage: number;
    totalPages:number;
    totalCount:number;
    selectedRows: number[];
    viewMode: "list" | "grid";
    users: User[];
    editingUser: User | null; 
    loading: boolean;
    error: string | null;
    snackbar: SnackbarState;
}

export interface userDataFilter {
    roles: string;
  usersOnboarded: string;
  status: string;
  search: string;
}

const initialState: UserFilter = {
    search: "",
    roles: [] ,
    status: "",
    usersOnboarded: "",
    currentPage: 1,
    rowsPerPage: 5,
    totalPages:1,
    totalCount:0,
    selectedRows: [],
    viewMode: "list",
    users: [],
    editingUser: null,
    loading: false,
    error: null,
    snackbar: {
        open: false,
        message: "",
        severity: "info"
    }

};

// Async thunk to fetch users from the API
export const fetchUsers = createAsyncThunk<PaginatedUserResponse, {axiosInstance: AxiosInstance; page?:number; limit?:number,filters: userDataFilter}>(
    "userManagement/fetchUsers",
    async ({axiosInstance, page, limit,filters}, { rejectWithValue }) => {
        try {
            const response = await getUsers(axiosInstance, page, limit, filters);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

const userManagementSlice = createSlice({
    name: "userManagement",
    initialState,
    reducers: {
        setViewMode: (state, action: PayloadAction<"list" | "grid">) => {
            state.viewMode = action.payload;
        },
        setSearchFilter: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
            state.currentPage = 1;
        },
        setRoleFilter: (state, action: PayloadAction<string[]>) => {
            state.roles= action.payload;
            state.currentPage = 1;
        },
        setStatusFilter: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
            state.currentPage = 1;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setRowsPerPage: (state, action: PayloadAction<number>) => {
            state.rowsPerPage = action.payload;
            state.currentPage = 1;
        },
        setUsersOnboarded: (state, action: PayloadAction<string>) => {
            state.usersOnboarded = action.payload;
            state.currentPage = 1;
        },
        setSelectedRows: (state, action: PayloadAction<number[]>) => {
            state.selectedRows = action.payload;
            state.currentPage = 1;
        },
        resetFilters: (state) => {
            state.search = "";
            state.roles = [];
            state.status = "";
            state.currentPage = 1;
            state.usersOnboarded = "";
        },
        addUser: (state, action: PayloadAction<User>) => {
            const newUser = { ...action.payload };
            state.users.push(newUser);
        },
        setEditingUser: (state, action: PayloadAction<User | null>) => {
            state.editingUser = action.payload;
            console.log("Updated state:", state.editingUser);  
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(user => user.id !== action.payload);
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
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.totalCount = action.payload.totalCount;
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});
// **🔹 Selector Function to Get Filtered Users**
export const selectFilteredUsers = (state: { userManagement: UserFilter }) => {
    const { users, search, roles, status, usersOnboarded } = state.userManagement;
    console.log('Current filters:', { search, roles, status, usersOnboarded });
    console.log('Users before filtering:', users);
    
    const filteredUsers = users.filter(user => {
        // Search filter - check if user name or email contains the search string
        const matchesSearch = !search || 
            user.name?.toLowerCase().includes(search.toLowerCase()) || 
            user.email?.toLowerCase().includes(search.toLowerCase());
            
        // Roles filter - check if any selected role matches user roles
        // const matchesRoles = roles.length === 0 || 
        //     (user.roles && roles.some(r => user.roles.includes(r)));
            
        // Status filter - check if status matches
        const matchesStatus = !status || user.status === status;
        
        // Date filter - check if user was created after the selected date
        let matchesOnboarded = true;
        if (usersOnboarded) {
            const userCreatedTime = new Date(user.createDtTime || "").getTime();
            const filterDate = new Date(usersOnboarded).getTime();
            
            if (!isNaN(userCreatedTime) && !isNaN(filterDate)) {
                matchesOnboarded = userCreatedTime >= filterDate;
            }
        }
        console.log("This is the matchesOnboarded from users", matchesOnboarded);
        return matchesSearch  && matchesStatus && matchesOnboarded;
    });
    
    console.log('Users after filtering:', filteredUsers);
    return filteredUsers;
};

export const {
    setSearchFilter,
    setRoleFilter,
    setStatusFilter,
    setUsersOnboarded,
    setViewMode,
    resetFilters,
    setCurrentPage,
    setRowsPerPage,
    addUser, 
    deleteUser,
    setEditingUser,
    setSelectedRows,
    showSnackbar,
    closeSnackbar,
    
} = userManagementSlice.actions;

export default userManagementSlice.reducer;
