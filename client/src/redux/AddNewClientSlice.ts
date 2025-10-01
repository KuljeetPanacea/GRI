import { createAsyncThunk, createSlice,  PayloadAction } from "@reduxjs/toolkit";
import { addClients } from "../api/client";
import { AxiosInstance } from "axios";
 
 
export interface Client {
    clientId?: string;
    clientName: string;
    businessName: string;
    demography: string;
    industry: string;
    businessEntity: string;
    entitySize: string;
    websiteLink: string;
    companyLogo: string;
    pocName: string;
    pocContactNumber: string;
    pocEmailId: string;
    leadershipContactNo: string;
    leadershipEmailId: string;
    leadershipName: string;
    
}
 
interface clientManagementState {
    clients: Client[];
    isAddClientModalOpen: boolean;
    loading: boolean;
    error: string | null;
    isEditMode: boolean;
    editingClient: Client | null;
    clientId?: string;
}
 
const initialState: clientManagementState = {
    clients: [],
    isAddClientModalOpen: false,
    loading: false,
    error: null,
    isEditMode:false,
    editingClient: null,
    clientId: "",
    
};
 
interface AddClientResponse {
    success: boolean;
    client: Client;
}
 
export const addClient = createAsyncThunk<AddClientResponse,{ clientData: Client, axiosInstance: AxiosInstance }>(
    "/client/createclient",
    async ({ clientData, axiosInstance }, { rejectWithValue }) => {
        console.log("Making API request with data:", clientData);
        try {
            const response = await addClients(axiosInstance, clientData);
            console.log("Add Client API response:", response.data);
            return response.data;
        }
        catch (error) {
            if (error instanceof Error) {
              return rejectWithValue(error || "Something went wrong");
            }
            return rejectWithValue("Something went wrong");
          }
    });
 
const newClientModalSlice = createSlice({
    name: "clientmodal",
    initialState,
    reducers: {
        openAddNewClientModal: (state) => {
            state.isAddClientModalOpen = true;
            state.isEditMode = false; 
        },
        openEditClientModal: (state, action: PayloadAction<Client>) => {
            state.isAddClientModalOpen = true;
            state.isEditMode = true;
            state.editingClient = action.payload;
        },
        closeAddNewClientModal: (state) => {
            state.isAddClientModalOpen = false;
            state.isEditMode = false;
            state.editingClient = null;
        },
        setClientId: (state, action: PayloadAction<string>) => {
            state.clientId = action.payload;
        }
    },
 

});
 
export const { openAddNewClientModal, closeAddNewClientModal , openEditClientModal, setClientId} = newClientModalSlice.actions;
export default newClientModalSlice.reducer;