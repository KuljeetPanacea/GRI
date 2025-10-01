import {
  Box,
  Card,
  Typography,
  IconButton,
  Radio,
  TextField,
  Button,
} from "@mui/material";
import styles from "../BuildQstnr.module.css";
import { useEffect, useState, useRef } from "react";
import { Add, Remove } from "@mui/icons-material";
import useBuildQstnr from "../useBuildQstnr";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../../../redux/store";
import FeedbackSnackbar from "../../../../common/ui/FeedbackSnackbar";
import { setErrorMessage} from "../../../../redux/qstnrQuestion";

const DefineQstnForQstnr = () => {
  const {
    question,
    options,
    setOptions,
    setQuestion,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    addQuestionInList,
    updateQuestionInList
  } = useBuildQstnr();
  
  const dispatch = useDispatch();
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
  
  return (
    <>
      {(questionType === "short_text" ||
        questionType === "long_text" ||
        selectedQuestion?.type === "short_text" ||
        selectedQuestion?.type === "long_text") && (
        <Card className={styles.questionCard}>
          <TextField
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className={styles.questionInput}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            className={styles.description}
          >
            Description (Optional)
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className={styles.questionInput}
            disabled
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button onClick={handleAddOption} className={styles.addOtherButton}>
              + Add "Other" option
            </Button>
            <Button
              onClick={
                newQuestion ? addQuestionInList : updateQuestionInList
              }
              className={styles.addSaveUpdateButton}
            >
              {newQuestion ? "Save" : "Update"}
            </Button>
          </div>
        </Card>
      )}
      {(questionType === "multiple_choice" ||
        questionType === "single_choice" ||
        selectedQuestion?.type === "multiple_choice" ||
        selectedQuestion?.type === "single_choice") && (
        <Card className={styles.questionCard}>
          <TextField
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className={styles.questionInput}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            className={styles.description}
          >
            Description (Optional)
          </Typography>
          {options.map((option, index) => (
            <Box key={index} className={styles.optionContainer}>
              <Box className={styles.optionInput}>
                <Radio disabled color="default" />
                <TextField
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  variant="standard"
                  fullWidth
                  InputProps={{ disableUnderline: true }}
                />
              </Box>
              <Box>
                <IconButton
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length <= 1}
                >
                  <Remove />
                </IconButton>
                <IconButton onClick={handleAddOption}>
                  <Add />
                </IconButton>
              </Box>
            </Box>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button onClick={handleAddOption} className={styles.addOtherButton}>
              + Add "Other" option
            </Button>
            <Button
              onClick={
                newQuestion ? addQuestionInList : updateQuestionInList
              }
              className={styles.addSaveUpdateButton}
            >
              {newQuestion ? "Save" : "Update"}
            </Button>
          </div>
        </Card>
      )}
      {questionType === "file_type" ||
      selectedQuestion?.type === "file_type" ? (
        <Card className={styles.questionCard}>
          <TextField
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className={styles.questionInput}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            className={styles.description}
          >
            Description (Optional)
          </Typography>
          <input
            disabled
            type="file"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file) {
                console.log("Selected file:", file);
              }
            }}
            style={{ marginTop: "10px", width: "100%" }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button
              onClick={
                newQuestion ? addQuestionInList : updateQuestionInList
              }
              className={styles.addSaveUpdateButton}
            >
              {newQuestion ? "Save" : "Update"}
            </Button>
          </div>
        </Card>
      ) : null}
      {(phase === "Assessment" && ErrorMessage) &&
        <FeedbackSnackbar
          open={open}
          message={ErrorMessage}
          severity={"error"}
          onClose={() => setOpen(false)}
        />
      }
    </>
  );
};

export default DefineQstnForQstnr;