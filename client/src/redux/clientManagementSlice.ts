import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { getClients } from "../api/client";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export interface Client {
  clientId?: string | undefined;
  clientName: string;
  status?: string;
  businessName: string;
  pocEmailId: string;
  demography: string;
  industry: string;
  businessEntity: string;
  entitySize: string;
  websiteLink: string;
  companyLogo: string;
  pocName: string;
  pocContactNumber: string;
  updateDtTime: string;
  createDtTime: string;
  leadershipContactNo: string;
  leadershipEmailId: string;
  leadershipName: string;
}

interface PaginatedClientResponse{
  clients:Client[];
  currentPage:number;
  totalPages:number;
  totalCount:number;
}

export interface ClientFilter {
  search: string;
  industry:string;
  industrySize:string;
  onboarding:string;
  status: string;  
  currentPage: number;
  rowsPerPage: number;
  totalPages:number;
  totalCount:number;
  selectedRows: number[];
  viewMode: "list" | "grid";
  clients: Client[];
  loading: boolean;
  error: string | null;
  snackbar: SnackbarState;
}

export interface ClientDataFilter {
  onboarding: string;
  industry:string;
  industrySize:string;
  status: string;
  search: string;
}
const initialState: ClientFilter = {
  search: "",
  industry:"",
  industrySize:"",
  onboarding:"",
  status: "",
  currentPage: 1,
  rowsPerPage: 5,
  totalPages:1,
  totalCount:0,
  selectedRows: [],
  viewMode: "list",
  clients: [],
  loading: false,
  error: null,
  snackbar: {
    open: false,
    message: "",
    severity: "info",
  },
};

// Async thunk to fetch clients from the API
export const fetchClients = createAsyncThunk<PaginatedClientResponse, {axiosInstance:AxiosInstance; page?:number; limit?:number , filters: ClientDataFilter}>(
  "clientManagement/fetchClients",
  async ({axiosInstance, page, limit , filters}, { rejectWithValue }) => {
    try {
      const response = await getClients(axiosInstance, page, limit, filters);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const clientManagementSlice = createSlice({
  name: "clientManagement",
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<"list" | "grid">) => {
      state.viewMode = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.currentPage = 1;
    },
    setIndustryFilter:(state, action: PayloadAction<string>) => {
      state.industry = action.payload;
      state.currentPage = 1;
    },
    setIndustrySizeFilter:(state, action: PayloadAction<string>) => {
      state.industrySize = action.payload;
      state.currentPage = 1;
    },
    setOnboardingFilter:(state, action: PayloadAction<string>) => {
      state.onboarding = action.payload;
      state.currentPage = 1;
    },
    setClientStatusFilter: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
    },
    setSelectedRows: (state, action: PayloadAction<number[]>) => {
      state.selectedRows = action.payload;
    },
    resetFilters: (state) => {
      state.search = "";
      state.industry="";
      state.industrySize="";
      state.onboarding="";
      state.status = "";
      state.currentPage = 1;
      
    },
    editClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(
        (client) => client.clientId === action.payload.clientId
      );
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
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
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.clients;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.error = null;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selector Function to Get Filtered Users**

export const selectFilteredClients = (state: {
  clientManagement: ClientFilter;
}) => {
  const { search, industry, industrySize, onboarding, status, clients } = state.clientManagement;

  const filteredClients =  clients.filter((client) => {
    const matchesSearch = client.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = (status ? client.status === status : true);
    const matchesIndustry = (industry ? client.industry === industry : true);
    const matchesIndustrySize = (industrySize ? client.entitySize === industrySize : true); 
   
    const clientUpdated = new Date(client.createDtTime).getTime();
    let matchesOnboard = true;
    if (onboarding){
      const filterDate = new Date(onboarding).getTime();
      if(!isNaN(filterDate)){
        matchesOnboard = clientUpdated >= filterDate;
      }
    }
    return matchesSearch && matchesStatus && matchesIndustry && matchesIndustrySize && matchesOnboard
  });

  return filteredClients;
};

export const {
  setViewMode,
  setSearchFilter,
  setIndustryFilter,
  setIndustrySizeFilter,
  setOnboardingFilter,
  setClientStatusFilter,
  setCurrentPage,
  setRowsPerPage,
  setSelectedRows,
  resetFilters,
  editClient,
  showSnackbar,
  closeSnackbar,
} = clientManagementSlice.actions;

export default clientManagementSlice.reducer;
