import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import  { AxiosInstance } from 'axios';
interface Client {
  clientId: number;
  clientName: string;
  onboardDate: string;
  lastUpdated: string;
  clientPOC: string;  
  status: string;
}

const initialState = {
  isDeleteModalOpen: false,
  clients: [] as Client[],
  clientIdToDelete: null as number | null,
};

export const deleteClient = createAsyncThunk(
  'client/deleteClient',
    async ({clientId,axiosInstance}:{clientId: number, axiosInstance: AxiosInstance}, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`api/client/deleteclient/${clientId}`,
          {withCredentials: true}
        );

        if(response.data.success){
        console.log('Delete Client API response:', response.data);
        return clientId; // Return the ID to remove it from the Redux store
        }else{
          return rejectWithValue(response.data.message);
        }
      } catch (error) {
if(error instanceof Error){
  return rejectWithValue(error.message ||"Failed to delete client");
}


      }
  }
)

const modalSlice = createSlice({
  name: 'clientDeleteModal',
  initialState,
  reducers: {
    openDeleteModal: (state, action) => {
      state.isDeleteModalOpen = true;
      state.clientIdToDelete = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.clientIdToDelete = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(deleteClient.pending, (state) => {
        state.isDeleteModalOpen = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter((client) => client.clientId !== action.payload);
        state.isDeleteModalOpen = false;
        state.clientIdToDelete = null;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        console.error(action.payload);
        state.isDeleteModalOpen = false;
      });
  },
});

export const { openDeleteModal, closeDeleteModal } = modalSlice.actions;
export default modalSlice.reducer;