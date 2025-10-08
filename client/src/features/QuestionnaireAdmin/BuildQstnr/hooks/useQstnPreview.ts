import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import axios, { AxiosError } from "axios";
import useAxios from "../../../../api/useAxios";
import { fetchQstnrQuestionsThunk } from "../../../../redux/qstnrQuestion";
import { evaluateQstnrQuestionThunk } from "../../../../redux/defineQstnrSlice";
import { Question } from "../../../../redux/qstnrQuestion";

const useQstnPreview = () => {
  const dispatch = useDispatch<AppDispatch>();
  const questionList = useSelector(
    (state: RootState) => state.qstnrQuestion.questions
  );
  const qstnrId = useSelector(
    (state: RootState) => state.defineQstnr.qstnr?.questionnaireId
  );
  const axiosInstance = useAxios();

  // State management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textValue, setTextValue] = useState("");

  // Fetch questions when qstnrId changes
  useEffect(() => {
    if (qstnrId) {
      dispatch(fetchQstnrQuestionsThunk({ qstnrId: qstnrId as string, axiosInstance }));
    }
  }, [qstnrId, dispatch, axiosInstance]);
  
  // Update currentQuestion when questionList changes
  useEffect(() => {
    console.log("Fetched questionList in preview:", questionList);
    if (questionList && questionList.length > 0 && !currentQuestion) {
      setCurrentQuestion(questionList[0]);
      setCurrentIndex(0);
    }
  }, [questionList, currentQuestion]); // Include currentQuestion dependency

  // Event handlers
  const handleSingleChoiceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedValue(event.target.value);
  };

  const handleMultipleChoiceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleNext = async () => {
    if (!currentQuestion) return;
  
    let selectedResponse: string | string[] | Record<string, string | number | boolean>[] = "";
  
    if (currentQuestion.type === "single_choice") {
      selectedResponse = selectedValue;
    } else if (currentQuestion.type === "multiple_choice") {
      selectedResponse = selectedValues;
    } else if (
      currentQuestion.type === "short_text" ||
      currentQuestion.type === "long_text"
    ) {
      selectedResponse = textValue;
    } else if (currentQuestion.type === "table_type") {
      selectedResponse = currentQuestion.tableData || [];
    }
  
    try {
      const questionId = currentQuestion._id as string;
      const payload = {
        questionnaireId: qstnrId as string,
        currentQuestionId: currentQuestion._id,
        responses: { [questionId]: selectedResponse }
      };
  
      const data = await dispatch(
        evaluateQstnrQuestionThunk({
          payload,
          axiosInstance,
        })
      );
  
      let nextQuestion = null;
      if (data.payload?.data) {
        nextQuestion = data.payload.data;
      }
      if (!nextQuestion && currentQuestion.alwaysGoTo) {
        nextQuestion = questionList.find((q) => q._id === currentQuestion.alwaysGoTo);
      }
  
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion as Question);
  
        const newIndex = questionList.findIndex(
          (q) => q._id === nextQuestion._id
        );
        setCurrentIndex(newIndex !== -1 ? newIndex : currentIndex + 1);
  
        setSelectedValue("");
        setSelectedValues([]);
        setTextValue("");
      } else {
        console.warn("No next question found.");
      }
    } catch (error: unknown) {
      console.error("Error submitting response:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error("Error response data:", axiosError.response?.data);
      }
    }
  };

  const handlePrevious = () => {
    console.log("Previous clicked, currentIndex:", currentIndex);
    console.log("questionList", questionList);
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newQuestion = questionList[newIndex];
      setCurrentIndex(newIndex);
      setCurrentQuestion(newQuestion);
    }
  };

  const handleTableDataChange = (data: Record<string, string | number | boolean>[]) => {
    // Update the current question with new table data
    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        tableData: data
      } as Question);
      console.log("Table data changed:", data);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      console.log("Selected file:", file);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };

  return {
    // State
    currentIndex,
    currentQuestion,
    selectedValue,
    selectedValues,
    textValue,
    questionList,
    qstnrId,
    
    // Handlers
    handleSingleChoiceChange,
    handleMultipleChoiceChange,
    handleNext,
    handlePrevious,
    handleTableDataChange,
    handleFileChange,
    handleTextChange,
    
    // Setters (if needed for external control)
    setCurrentQuestion,
    setSelectedValue,
    setSelectedValues,
    setTextValue,
  };
};

export default useQstnPreview;
