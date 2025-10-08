import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createQstn, deleteQstn, duplicateQstn, getQstnrQuestions, PublishQstnr } from "../api/qstnr";
import { AxiosInstance } from "axios";
import { RootState } from "./store";

export interface Choice {
  _id?: string;
  value: string;
}

export interface BranchingSectionProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export interface BranchingCondition {
  questionId: string;
  operator: string;
  value: string | string[] | Array<{ value: string }>;
}

export interface BranchingLogic {
  operation: string;
  conditions: BranchingCondition[];
  next: string;
  alwaysGoto?: string | null;
}

export interface FormBranchingCondition {
  ChoiceId: string;
  operator: string;
  value: string | string[] | Array<{ value: string }>;
  logic: string;
}

export interface FormBranchingLogic {
  operation: string;
  conditions: FormBranchingCondition[];
  next: string;
}

export interface AdditionalCondition {
  operator: string;
  values: Choice[];
}

export interface TableColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  options?: string[]; // for select type
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface TableRow {
  id: string;
  label: string;
}

export type TableMode = 'dynamic' | 'template';

export interface TableConfig {
  mode: TableMode;
  rows?: TableRow[]; // For template mode - predefined rows
  columns: TableColumn[];
}

export interface Question {
  _id?: string;
  questionnaireId: string;
  title?:string;
  type: string;
  text: string;
  choices?: Choice[];
  requirements: null | string;
  subRequirements: null | string;
  subControl: null | string;
  isEditing: boolean;
  isDeleted: boolean;
  branchingLogic?: BranchingLogic[];
  formBranchingLogic?: FormBranchingLogic[];
  alwaysGoTo: null | string;
  userResponse?: string | string[];
  gaps?: {
    gaps?: string;
    clientComment?: string;
    status?: string;
  };
  // Unified table properties
  tableConfig?: TableConfig;
  tableData?: Record<string, string | number | boolean>[];
  setting?: {
    characterLimit?: number;
    placeholder?: string;
    required?: boolean;
    enableSpellCheck?: boolean;
    displayCharacterCounter?: boolean;
    autoCapitalization?: boolean;
    nextQuestion?: string;
    displaySettings?: 'Vertical' | 'Horizontal';
    optionOrder?: 'Fixed Order' | 'Sorting' | 'Random';
    maximum_selected_values?: number;
    minimum_selected_values?: number;
    defaultValue?: string[];
    scoring?: Array<{
      option: string;
      value: string;
    }>;
    nextQuestionId?: string;
  };
  evidenceReference?: string;
  testingProcedure?: string;
}

interface UpdateQuestionPayload {
  _id?: string;
  text?: string;
  choices?: Choice[];
  alwaysGoTo?: string | null;
  branchingLogic?: BranchingLogic[];
  formBranchingLogic?: FormBranchingLogic[];
  selectedReq?: string;
  selectedSubReq?: string;
  selectedSubControl?: string;
  evidenceReference?: string;
  testingProcedure?: string;
  // Unified table properties
  tableConfig?: TableConfig;
  tableData?: Record<string, string | number | boolean>[];
}

interface BuildQstnrState {
  questions: Question[];
  type?: string;


  selectedQuestion: Question | null;
  selectedOperator?: string;
  selectedNextQuestion?: string;
  selectedOperation?: string;
  selectedValue?: string;
  selectedValueId?: string;
  selectedValues: Choice[];
  loading: boolean;
  error: string | null;
  isPublished: boolean;
  selectedReq?:string;
  selectedSubReq?:string;
  selectedSubControl?:string;
  ErrorMessage?:string;
  newQuestion?:boolean;
  disableReq?:boolean;
  selectedEvidenceReference?: string;
  selectedTestingProcedure?: string;
}

interface DuplicateQstnParams {
  questionId: string;
  questionnaireId: string;
  axiosInstance: AxiosInstance;
}

interface DeleteQstnParams {
  id: string;
  qstnrId: string;
  axiosInstance: AxiosInstance;
}

const initialState: BuildQstnrState = {
  questions: [],
  type: "",
  selectedQuestion: null,
  selectedOperator: "", 
  selectedNextQuestion: "",
  selectedOperation: "",
  selectedValue: "",
  selectedValueId: "",
  selectedValues: [],
  loading: false,
  error: null,
  isPublished: false,
};

// thunk functions
export const fetchQstnrQuestionsThunk = createAsyncThunk(
  "buildQstnr/fetchQstnrQuestionsThunk",
  async (
    { qstnrId, axiosInstance }: { qstnrId: string; axiosInstance: AxiosInstance }
  ) => {
    const questionnaireData = await getQstnrQuestions(qstnrId, axiosInstance);
    return {
      questions: questionnaireData.questions,
      isPublished: questionnaireData.isPublished
    };
  }
);

export const createQuestionThunk = createAsyncThunk(
  "buildQstnr/createQuestionThunk",
  async (
    {
      qstnrId,
      data,
      axiosInstance,
    }: { qstnrId: string | undefined; data: object; axiosInstance: AxiosInstance }, thunkAPI
  ) => {
    try {
      const state  = thunkAPI.getState() as RootState;
      const newData = {
        ...data,
        requirements: state.qstnrQuestion.selectedReq,
        subRequirements: state.qstnrQuestion.selectedSubReq,
        subControl: state.qstnrQuestion.selectedSubControl,
        evidenceReference: state.qstnrQuestion.selectedEvidenceReference,
        testingProcedure: state.qstnrQuestion.selectedTestingProcedure,
        // Include table configuration if it's a table question
        ...((data as Question).type === 'table_type' && {
          tableConfig: (data as Question).tableConfig || state.qstnrQuestion.selectedQuestion?.tableConfig || {
            mode: 'dynamic',
            columns: [],
            defaultRows: 3
          },
          tableData: (data as Question).tableData || state.qstnrQuestion.selectedQuestion?.tableData || []
        }),
      }
      
      console.log('Creating question with data:', newData);
      console.log('Table configuration:', {
        tableConfig: newData.tableConfig,
        tableData: newData.tableData
      });
      const createdQuestion: Question = await createQstn(qstnrId, newData, axiosInstance); 
      return createdQuestion;
    } catch (error) {
      console.error("Failed to create question:", error);
      throw error;
    }
  }
);

export const duplicateQstnThunk = createAsyncThunk<unknown, DuplicateQstnParams>(
  "questionnaire/duplicateQstn",
  async ({ questionId, questionnaireId, axiosInstance }, { rejectWithValue }) => {
    try {
      const result = await duplicateQstn(questionId, questionnaireId, axiosInstance);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteQstnThunk = createAsyncThunk<void, DeleteQstnParams>(
  "questionnaire/deleteQstn",
  async ({ id, qstnrId, axiosInstance }, { rejectWithValue }) => {
    try {
      await deleteQstn(id, qstnrId, axiosInstance);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const publishQstnrThunk = createAsyncThunk(
  "buildQstnr/createQuestionThunk",
  async (
    {
      qstnrId,
      data,
      axiosInstance,
    }: { qstnrId: string | undefined; data: object; axiosInstance: AxiosInstance },
  ) => {
    try {
      const response = await PublishQstnr(qstnrId, data, axiosInstance); 
      return response;
    } catch (error) {
      console.error("Failed to Publish question:", error);
      throw error;
    }
  }
);


const QstnrQuestionSlice = createSlice({
  name: "buildQstnr",
  initialState,
  reducers: {
    setQuestionList: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    setErrorMessage:(state, action:PayloadAction<string>) =>{
      state.ErrorMessage = action.payload
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      if (action.payload._id && state.questions.some(q => q._id === action.payload._id)) {
        return;
      }
      state.questions.push(action.payload);
    },
    updateQuestion: (state, action: PayloadAction<UpdateQuestionPayload>) => {
      // If no _id is provided, we can't update the question
      if (!action.payload._id) {
        console.warn('Cannot update question: no _id provided');
        return;
      }

      const questionIndex = state.questions.findIndex((q) => q._id === action.payload._id);
      if (questionIndex !== -1) {
        const updatedQuestion = {
          ...state.questions[questionIndex],
          text: action.payload.text ?? state.questions[questionIndex].text,
          choices: action.payload.choices ? [...action.payload.choices] : state.questions[questionIndex].choices,
          alwaysGoTo: action.payload.alwaysGoTo ?? state.questions[questionIndex].alwaysGoTo,
          branchingLogic: action.payload.branchingLogic ? [...action.payload.branchingLogic] : state.questions[questionIndex].branchingLogic,
          formBranchingLogic: action.payload.formBranchingLogic ? [...action.payload.formBranchingLogic] : state.questions[questionIndex].formBranchingLogic,
          requirements: action.payload.selectedReq ?? state.questions[questionIndex].requirements,
          subRequirements: action.payload.selectedSubReq ?? state.questions[questionIndex].subRequirements,
          subControl: action.payload.selectedSubControl ?? state.questions[questionIndex].subControl,
          evidenceReference: action.payload.evidenceReference ?? state.questions[questionIndex].evidenceReference,
          testingProcedure: action.payload.testingProcedure ?? state.questions[questionIndex].testingProcedure,
          // Unified table properties
          tableConfig: action.payload.tableConfig ?? state.questions[questionIndex].tableConfig,
          tableData: action.payload.tableData ?? state.questions[questionIndex].tableData,
        };
        state.questions[questionIndex] = updatedQuestion;
        if (state.selectedQuestion?._id === action.payload._id) {
          state.selectedQuestion = { ...updatedQuestion };
        }
      }
    },
    setSelectedValues: (state, action: PayloadAction<Choice[]>) => {
      state.selectedValues = action.payload;
    },
   
    selectQuestion: (state, action: PayloadAction<string | null>) => {
      state.selectedQuestion = action.payload
        ? state.questions.find((q) => q._id === action.payload) || null
        : null;
    },
    clearSelectedQuestion: (state) => {
      state.selectedQuestion = null;
      state.selectedReq = "";
      state.selectedSubReq = "";
      state.selectedSubControl = "";
      state.selectedEvidenceReference = undefined;
      state.selectedTestingProcedure = "";
    },
    questionTypeValue: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    resetQuestionTypeValue: (state) => {
      state.type = "";
    },
    setSelectedOperator: (state, action: PayloadAction<string>) => {
      state.selectedOperator = action.payload;
    },
    setSelectedNextQuestion: (state, action: PayloadAction<string>) => {
      state.selectedNextQuestion = action.payload;
    },
    setSelectedOperation: (state, action: PayloadAction<string>) => {
     state.selectedOperation = action.payload;
    },
    setSelectedValueAndIdOfOption: (state, action: PayloadAction<{ value: string; _id: string }>) => {
    state.selectedValue = action.payload.value;
    state.selectedValueId = action.payload._id;
    },
    clearQuestions: (state) => {
      state.questions = [];
      state.type = "";
      state.selectedQuestion = null;
      state.selectedReq = "";
      state.selectedSubReq = "";
      state.selectedSubControl = "";
      state.selectedEvidenceReference = undefined;
      state.selectedTestingProcedure = "";
    },
    clearRequirements: (state) => {
      state.selectedReq = "";
      state.selectedSubReq = "";
      state.selectedSubControl = "";
      state.selectedEvidenceReference = undefined;
      state.selectedTestingProcedure = "";
    },
    clearRequirementsOnly: (state) => {
      state.selectedReq = "";
      state.selectedSubReq = "";
      state.selectedSubControl = "";
      state.selectedTestingProcedure = "";
      // Don't clear sectionReference here
    },
    setNewQuestion: (state, action: PayloadAction<boolean>) => {
      state.newQuestion = action.payload;
    },
    setDisableReq: (state, action: PayloadAction<boolean>) => { 
      state.disableReq = action.payload;
    },
    setPublishedStatus: (state, action: PayloadAction<boolean>) => {
      state.isPublished = action.payload;
    },
    setReq:(state, action:PayloadAction<string>)=>{
      if (state.selectedQuestion) {
        state.selectedQuestion.requirements = action.payload;
      }
      state.selectedReq = action.payload;
    },
    setSubReq:(state, action:PayloadAction<string>)=>{
      if (state.selectedQuestion) {
        state.selectedQuestion.subRequirements = action.payload;
      }
      state.selectedSubReq = action.payload;
    },
    setSubControl:(state, action:PayloadAction<string>)=>{
      if (state.selectedQuestion) {
        state.selectedQuestion.subControl = action.payload;
      }
      state.selectedSubControl = action.payload;
    },
    setEvidenceReference:(state, action:PayloadAction<string>)=>{
      if (state.selectedQuestion) {
        state.selectedQuestion.evidenceReference = action.payload;
      }
      state.selectedEvidenceReference = action.payload;
    },
    setTestingProcedure:(state, action:PayloadAction<string>)=>{
      if (state.selectedQuestion) {
        state.selectedQuestion.testingProcedure = action.payload;
      }
      state.selectedTestingProcedure = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createQuestionThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createQuestionThunk.fulfilled, (state, action) => {
      state.loading = false;
      // state.isPublished = action.payload.isPublished.isPublished
   console.log('Question created:', action.payload);
    })
    .addCase(createQuestionThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create question";
    });

builder
    .addCase(fetchQstnrQuestionsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchQstnrQuestionsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.questions = action.payload.questions;
      state.isPublished = action.payload.isPublished;
    })
    .addCase(fetchQstnrQuestionsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch questionnaire";
    });
  },

});

export const { 
  addQuestion, 
  questionTypeValue, 
  clearQuestions, 
  updateQuestion, 
  selectQuestion, 
  clearSelectedQuestion, 
  resetQuestionTypeValue ,
  setSelectedOperator,
  setSelectedNextQuestion,
  setSelectedOperation,
  setSelectedValueAndIdOfOption,
  setSelectedValues,
  setQuestionList,
  setPublishedStatus,
  setReq,
  setSubReq,
  setSubControl,
  setErrorMessage,
  clearRequirements,
  clearRequirementsOnly,
  setNewQuestion,
  setDisableReq,

  setEvidenceReference,
  setTestingProcedure
} = QstnrQuestionSlice.actions;

export default QstnrQuestionSlice.reducer;
