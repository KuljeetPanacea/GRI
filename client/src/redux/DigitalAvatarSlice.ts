import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { evaluateQstn } from "../../src/api/qstnr";
import { AxiosInstance } from "axios";

interface Choice {
  _id?: string;
  value: string;
}

interface BranchingCondition {
  questionId?: string;
  operator: string;
  value: string[];  // Always an array of Choice objects
}

interface BranchingLogic {
  operation: string;
  conditions: BranchingCondition[];
  next: string;
  alwaysGoto: string | null;
}

export interface FormBranchingCondition {
  ChoiceId?: string;
  operator: string;
  value: string[];  // Always an array of Choice objects
  logic: string;
}

interface FormBranchingLogic {
  operation: string;
  conditions: FormBranchingCondition[];
  next: string;
}

export interface NextQuestion {
  _id: string;
  questionnaireId: string;
  type: string;
  text: string;
  choices: Choice[];
  requirements: null | string;
  subRequirements: null | string;
  subControl: null | string;
  isEditing: boolean;
  isDeleted: boolean;
  branchingLogic?: BranchingLogic[];
  formBranchingLogic?: FormBranchingLogic[];
  alwaysGoTo: null | string;
  currentResponses?: string[];
  chatgptResponse?: string;
  userResponse?: string;
  questionsCompleted?: boolean;
  evidenceReference?: string;
  isRecording?: boolean;
  selectedAvatar?: 'avatar' | 'manual';
  testingProcedure?: string;
  gaps?: string;
}

// Payload type for our thunk
interface EvaluateQstnPayload {
  questionnaireId: string;
  currentQuestionId: string;
  responses: Record<string, string[]>;
  assesmentId: string;
  projectId: string;
}

const initialState: NextQuestion = {
  _id: '',
  questionnaireId: '',
  type: '',
  text: '',
  choices: [],
  requirements: null,
  subRequirements: null,
  subControl: null,
  isEditing: false,
  isDeleted: false,
  branchingLogic: [],
  formBranchingLogic: [],
  alwaysGoTo: null,
  currentResponses: [],
  chatgptResponse: '',
  isRecording: true,
  selectedAvatar: 'avatar' as 'avatar' | 'manual',
  
};

export const evaluateQstnrThunk = createAsyncThunk(
  "digitalAvatar/evaluateQstnrThunk",
  async ({payload, axiosInstance}: {payload: EvaluateQstnPayload; axiosInstance: AxiosInstance}) => {
    try {
      const response = await evaluateQstn(payload, axiosInstance);
      return response.data;
    } catch (error) {
      console.error("Error in evaluateQstnrThunk:", error);
      throw error;
    }
  }
);

const DigitalAvatarSlice = createSlice({
  name: "digitalAvatar",
  initialState,
  reducers: {
    setResponses: (state, action: PayloadAction<string[]>) => {
        state.currentResponses = action.payload;
      },
      addResponse: (state, action: PayloadAction<string>) => {
        if (state.currentResponses && !state.currentResponses.includes(action.payload)) {
          if (!state.currentResponses) {
            state.currentResponses = [];
          }
          state.currentResponses.push(action.payload);
        }
      },

      setquestionsCompleted: (state, action: PayloadAction<boolean>) => {
        state.questionsCompleted = action.payload;
      },
      removeResponse: (state, action: PayloadAction<string>) => {
        state.currentResponses = (state.currentResponses ?? []).filter(
          response => response !== action.payload
        );
      },
      clearResponses: (state) => {
        state.currentResponses = [];
      },
      setQuestion: (state, action: PayloadAction<NextQuestion>) => {
        return {
          ...state,
          ...action.payload,
        };
      },
      chatgptResponse: (state, action: PayloadAction<string>) => {
        state.chatgptResponse = action.payload;
      },
      setRecordingState: (state, action: PayloadAction<boolean>) => {
        state.isRecording = action.payload;
      },
      setSelectedAvatar: (state, action: PayloadAction<'avatar' | 'manual'>) => {
        state.selectedAvatar = action.payload;
        state.isRecording = action.payload === 'avatar';
      },

     
      toggleRecording: (state) => {
        state.isRecording = !state.isRecording;
        state.selectedAvatar = state.isRecording ? 'avatar' : 'manual';
      }
  },
  extraReducers: (builder) => {
    builder.addCase(evaluateQstnrThunk.fulfilled, (state, action: PayloadAction<NextQuestion>) => {
            return {
        ...state,
        ...action.payload
      };
      
    });
    
    builder.addCase(evaluateQstnrThunk.pending, (state) => {
        console.log("Inside the pending state",state);
    });
    builder.addCase(evaluateQstnrThunk.rejected, ( action) => {
      console.error("Failed to evaluate question:", action);
    });
  },
});
export const { 
  setResponses,
  setquestionsCompleted, 
  addResponse, 
  removeResponse, 
  clearResponses, 
  setQuestion,
  chatgptResponse,
  setRecordingState,
  setSelectedAvatar,
  toggleRecording,

} = DigitalAvatarSlice.actions;

export default DigitalAvatarSlice.reducer;