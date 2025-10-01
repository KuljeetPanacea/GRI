import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
  FormGroup,
} from "@mui/material";
import useDigitalAvatar from "../useDigitalAvatar";
import styles from "../DigitalAvatar.module.css";
import { useEffect } from "react";

const MultipleType = () => {
  const {
    currentQuestion,
    value,
    handleMultipleChange,
    dispatch,
    setResponses,
    chatGptResponse,
    isRecording,
  } = useDigitalAvatar();

  useEffect(() => {
    if (currentQuestion?.choices && chatGptResponse) {
      const normalize = (text: string) =>
        text
          .toLowerCase()
          .replace(/[^\w\s]|_/g, "")
          .trim();

      const responseValues = chatGptResponse
        .split(",")
        .map((val) => normalize(val));

      const matched = currentQuestion.choices
        .filter((choice) => responseValues.includes(normalize(choice.value)))
        .map((match) => match.value);

      if (matched.length > 0) {
        dispatch(setResponses(matched));
      }
    }
  }, [chatGptResponse]);

  const getCheckboxValues = () => {
    // If user has made a new selection, use that
    if (value && value.length > 0) {
      return value;
    }
    if (currentQuestion?.userResponse) {
      if (Array.isArray(currentQuestion.userResponse)) {
        return currentQuestion.userResponse;
      } else if (typeof currentQuestion.userResponse === "string") {
        return currentQuestion.userResponse
          .split(",")
          .map((item) => item.trim());
      }
    }
    return [];
  };

  const checkboxValues = getCheckboxValues();

  return (
    <Card
      className={`${styles.qstnCard} ${isRecording ? styles.disabledCard : ""}`}
    >
      <CardContent className={styles.cardContent}>
        <Typography
          variant="h3"
          component="div"
          className={styles.questionText}
        >
          {currentQuestion?.text || "Loading..."}
        </Typography>

        <FormControl component="fieldset" className={styles.formControl}>
          {isRecording && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mb: 2, fontStyle: "italic" }}
            >
              Please use voice commands while recording is active
            </Typography>
          )}
          <FormGroup>
            {currentQuestion &&
              currentQuestion?.choices?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  classes={{
                    label: styles.customLabel, // create this in your CSS module
                  }}
                  className={styles.radioOption}
                  control={
                    <Checkbox
                      className={styles.radioButton}
                      checked={checkboxValues?.includes(option.value)}
                      value={option.value}
                      onChange={handleMultipleChange}
                      disabled={isRecording}
                    />
                  }
                  label={option.value}
                />
              ))}
          </FormGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default MultipleType;
