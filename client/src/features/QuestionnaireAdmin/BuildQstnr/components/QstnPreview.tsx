import {
  Card,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import styles from "../BuildQstnr.module.css";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import axios, { AxiosError } from "axios";
import useAxios from "../../../../api/useAxios";
import { fetchQstnrQuestionsThunk } from "../../../../redux/qstnrQuestion";
import { evaluateQstnrQuestionThunk } from "../../../../redux/defineQstnrSlice";
import { Question } from "../../../../redux/qstnrQuestion";

const QstnPreview = () => {
  const dispatch = useDispatch<AppDispatch>();
  const questionList = useSelector(
    (state: RootState) => state.qstnrQuestion.questions
  );
  const qstnrId = useSelector(
    (state: RootState) => state.defineQstnr.qstnr?.questionnaireId
  );
  console.log("questionList", qstnrId);
  const axiosInstance = useAxios();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textValue, setTextValue] = useState("");

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
  }, [questionList]); // Remove currentQuestion dependency to avoid infinite loop

  // Show loading state if no current question
  if (!currentQuestion) {
    return (
      <div className={styles.previewContainer}>
        <Card className={styles.previewCard}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {questionList && questionList.length > 0 ? "Loading..." : "No questions available"}
          </Typography>
        </Card>
      </div>
    );
  }

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
  
    let selectedResponse: string | string[] = "";
  
    if (currentQuestion.type === "single_choice") {
      selectedResponse = selectedValue;
    } else if (currentQuestion.type === "multiple_choice") {
      selectedResponse = selectedValues;
    } else if (
      currentQuestion.type === "short_text" ||
      currentQuestion.type === "long_text"
    ) {
      selectedResponse = textValue;
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

  return (
    <div className={styles.previewContainer}>
      <Card className={styles.previewCard} key={currentQuestion._id}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {currentQuestion.text}
        </Typography>

        {currentQuestion.type === "single_choice" ? (
          <RadioGroup value={selectedValue} onChange={handleSingleChoiceChange}>
            {currentQuestion.choices?.map((option) => (
              <FormControlLabel
                key={option._id}
                className={styles.previewOption}
                control={<Radio />}
                label={option.value}
                value={option.value}
              />
            ))}
          </RadioGroup>
        ) : currentQuestion.type === "multiple_choice" ? (
          <FormGroup>
            {currentQuestion.choices?.map((option) => (
              <FormControlLabel
                key={option._id}
                className={styles.previewOption}
                control={
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onChange={handleMultipleChoiceChange}
                  />
                }
                label={option.value}
                value={option.value}
              />
            ))}
          </FormGroup>
        ) : currentQuestion.type === "file_type" ? (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file) {
                console.log("Selected file:", file);
              }
            }}
            style={{ marginTop: "10px", marginBottom: "10px" }}
          />
        ) : currentQuestion.type === "short_text" ||
          currentQuestion.type === "long_text" ? (
          <TextField
            multiline={currentQuestion.type === "long_text"}
            fullWidth
            id="outlined-basic"
            variant="outlined"
            sx={{ mb: 2 }}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
        ) : null}

        <div className={styles.previewButtonContainer}>
          <PrimaryButton
            className={styles.previewSubmitButton}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </PrimaryButton>
          <PrimaryButton
            className={styles.previewNextButton}
            onClick={handleNext}
          >
            Next
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default QstnPreview;
