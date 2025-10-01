import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../api/auth";
import axios, { AxiosInstance } from "axios";
 
interface LoginCredentials {
  userEmail: string;
  password: string;
}

interface loginUserResponseDetails {
  email: string;
  roles: string[];
  tenantId: string;
  id : string;
  name?:string;
}

interface MenuItem {
  id: number;
  path: string;
  icon: string;
  label: string;
  tooltip: string;
}
  
interface LoginState {  
  username: string;
  userMenu: MenuItem[] | null;
  loading: boolean;
  error: string | null;
  user: loginUserResponseDetails | null;
  message?:string;
}
  
const initialState: LoginState = {
  username: "",
  userMenu: null, 
  loading: false,
  error: null,
  user: null,
};
 
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ credentials, axiosInstance }: { credentials: LoginCredentials; axiosInstance: AxiosInstance }, { rejectWithValue }) => {
    try {
      const response = await login(axiosInstance, credentials);
      if (response.data.success) {
                return { 
                response,
        };
      } else {
        return rejectWithValue(response.data.message || "Invalid credentials");
      }
    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Invalid username or password');
      }
      return rejectWithValue('Invalid username or password');
    }
  }
);
 
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    }
   },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const {response} = action.payload;
        console.log(response)
        state.userMenu =response.data.authState.menuItem;
        state.user = response.data.authState.user;
        state.username = response.data.authState.user.name;
        
      })
      .addCase(loginUser.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
 
export const {setMessage} = loginSlice.actions
export default loginSlice.reducer;