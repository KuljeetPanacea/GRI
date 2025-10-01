import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import useDigitalAvatar from "../useDigitalAvatar";
import styles from "../DigitalAvatar.module.css";
import { useEffect } from "react";

const SingleType = () => {
  const {
    currentQuestion,
    value,
    handleChange,
    chatGptResponse,
    dispatch,
    setResponses,
    isRecording,
  } = useDigitalAvatar();

  useEffect(() => {
    if (currentQuestion?.choices && chatGptResponse) {
      const normalize = (text: string) =>
        text
          .toLowerCase()
          .replace(/[^\w\s]|_/g, "")
          .trim();

      const normalizedResponse = normalize(chatGptResponse);

      const match = currentQuestion.choices.find((choice) => {
        const normalizedChoice = normalize(choice.value);
        return normalizedChoice === normalizedResponse;
      });

      console.log("Match found:", match);

      if (match !== undefined) {
        dispatch(setResponses([match.value]));
      }
    }
  }, [chatGptResponse]);

  const radioValue =
  value && value.length > 0
    ? value
    : typeof currentQuestion?.userResponse === "string"
      ? currentQuestion.userResponse
      : "";
  return (
    <Card className={`${styles.qstnCard} ${isRecording ? styles.disabledCard : ''}`}>
    <CardContent className={styles.cardContent}>
      <Typography
        component="div"
        className={styles.questionText}
      >
        {currentQuestion?.text || "Loading..."}
      </Typography>

        <FormControl component="fieldset" className={styles.formControl}>
          {isRecording && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2, fontStyle: 'italic' }}>
              Please use voice commands while recording is active
            </Typography>
          )}
          <RadioGroup
            aria-label="antivirus-subscription"
            name="antivirus-subscription"
            value={radioValue}
            onChange={handleChange}
          >
            {currentQuestion &&
              currentQuestion?.choices?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  className={styles.radioOption}
                  value={option.value }
                  control={<Radio className={styles.radioButton} disabled={isRecording} />}
                  label={option.value}
                  disabled={isRecording}
                />
              ))}
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default SingleType;
