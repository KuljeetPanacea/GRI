import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface qstnr{
    id: string;
    name: string;
    datePublished: string;
    lastUpdated: string;
    createdBy: string;
    selected: boolean;
    default: boolean;
}

interface qstnrState{
    qstnrs: qstnr[];
    viewMode: "VIEW" | "ADD_EDIT";
    addEditMode :  "ADD_EXISTING" | "CREATE_NEW" | null; 
}

const initialState: qstnrState ={
    qstnrs:[
        {
          id: "1",
          name: "Finance",
          datePublished: "10 Jan 2024",
          lastUpdated: "10 Jan 2024",
          createdBy: "Eshmeet Kaur",
          selected: true,
          default: true,
          
        },
        {
          id: "2",
          name: "Banking Merchant",
          datePublished: "6 Oct 2024",
          lastUpdated: "6 Oct 2024",
          createdBy: "Eshmeet Kaur",
          selected: false,
          default: false,
        },
        {
          id: "3",
          name: "Banking Big Merchant",
          datePublished: "6 Oct 2024",
          lastUpdated: "6 Oct 2024",
          createdBy: "Eshmeet Kaur",
          selected: false,
          default: false,
        }
      ],
      viewMode: "VIEW", 
      addEditMode: "ADD_EXISTING", 
}

const ssquestionnaireSlice = createSlice({
    name: "ssquestionnaire",
    initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<string[]>) => {
      state.qstnrs.forEach(q => {
        q.selected = action.payload.includes(q.id);
      });
    },

    toggleDefaultStatus: (state, action: PayloadAction<string>) => {
      state.qstnrs.forEach(q => {
        q.default = q.id === action.payload ? !q.default : false; // Ensure only one is default
      });
    },
    
    setViewMode: (state, action: PayloadAction<"VIEW" | "ADD_EDIT">) => {
      state.viewMode = action.payload;
      if (action.payload === "VIEW") {
        state.addEditMode = null; 
      }
    },

    setAddEditMode: (state, action: PayloadAction<"ADD_EXISTING" | "CREATE_NEW">) => {
      state.viewMode = "ADD_EDIT"; 
      state.addEditMode = action.payload;
    },
  },
});

export const {toggleSelection, toggleDefaultStatus, setViewMode, setAddEditMode} = ssquestionnaireSlice.actions;
export default ssquestionnaireSlice.reducer;
