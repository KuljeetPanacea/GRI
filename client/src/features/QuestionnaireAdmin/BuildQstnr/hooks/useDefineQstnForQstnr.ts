import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../../../redux/store";
import { setErrorMessage } from "../../../../redux/qstnrQuestion";
import useBuildQstnr from "../useBuildQstnr";

const useDefineQstnForQstnr = () => {
  const dispatch = useDispatch();
  
  // Get data from useBuildQstnr hook
  const {
    question,
    options,
    setOptions,
    setQuestion,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    addQuestionInList,
    updateQuestionInList,
    updateTableConfig
  } = useBuildQstnr();
  
  // Redux selectors
  const { phase } = useAppSelector((state: RootState) => state.defineQstnr);
  const { newQuestion } = useAppSelector((state: RootState) => state.qstnrQuestion);
  const ErrorMessage = useAppSelector(
    (state: RootState) => state.qstnrQuestion.ErrorMessage);
  const questionType = useSelector(
    (state: RootState) => state.qstnrQuestion.type
  );
  const selectedQuestion = useSelector(
    (state: RootState) => state.qstnrQuestion.selectedQuestion
  );
  
  // Local state
  const [open, setOpen] = useState<boolean>(true);
  const prevNewQuestionRef = useRef(newQuestion);
  
  // Clear fields when questionType changes, but only if newQuestion is true
  useEffect(() => {
    prevNewQuestionRef.current = newQuestion;
    
    if (newQuestion) {
      setQuestion("");
      setOptions([]);
    }
    
  }, [newQuestion, setQuestion, setOptions]);
  
  // Handle selected question changes
  useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion.text || "");
      setOptions(selectedQuestion.choices?.map((choice) => choice.value) || []);
    }
  }, [selectedQuestion, setOptions, setQuestion]);
  
  // Handle error message display
  useEffect(() => {
    if (ErrorMessage) {
      setOpen(true);
      
      // Optional: Auto-hide after some time
      const timer = setTimeout(() => {
        setOpen(false);
        dispatch(setErrorMessage("")); // Clear the error message
      }, 5000); // 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [ErrorMessage, dispatch]);

  // Handlers for form actions
  const handleCancel = () => {
    setQuestion("");
    setOptions([]);
  };

  const handleSaveOrUpdate = () => {
    if (newQuestion) {
      addQuestionInList();
    } else {
      updateQuestionInList();
    }
  };

  const handleSnackbarClose = () => {
    setOpen(false);
  };


  return {
    // State
    question,
    options,
    open,
    phase,
    newQuestion,
    ErrorMessage,
    questionType,
    selectedQuestion,
    
    // Handlers
    setQuestion,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    handleCancel,
    handleSaveOrUpdate,
    handleSnackbarClose,
    updateTableConfig,
    
    // Redux actions
    addQuestionInList,
    updateQuestionInList,
  };
};

export default useDefineQstnForQstnr;
