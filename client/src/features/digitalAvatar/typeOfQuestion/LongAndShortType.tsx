import { Card, CardContent, FormControl, Typography } from "@mui/material";
import useDigitalAvatar from "../useDigitalAvatar";
import styles from "../DigitalAvatar.module.css";
import { useEffect } from "react";

const LongAndShortType = () => {
  const { currentQuestion, userSpeech, dispatch, setResponses, setUserSpeech, isRecording } =
    useDigitalAvatar();

  useEffect(() => {
    if (currentQuestion?.userResponse && !userSpeech) {
      if (typeof currentQuestion.userResponse === "string") {
        setUserSpeech(currentQuestion.userResponse);
        dispatch(setResponses([currentQuestion.userResponse]));
      } 
    }
  }, [currentQuestion?.userResponse, userSpeech, dispatch, setResponses, setUserSpeech]);

  const textValue = userSpeech || (typeof currentQuestion?.userResponse === 'string' ? currentQuestion.userResponse : '') || "";

  return (
    <Card className={`${styles.qstnCard} ${isRecording ? styles.disabledCard : ''}`}>
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
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2, fontStyle: 'italic' }}>
              Please use voice commands while recording is active
            </Typography>
          )}
          <textarea
            className={styles.textarea}
            value={textValue}
            onChange={(e) => {
              const val = e.target.value;
              setUserSpeech(val);
              dispatch(setResponses([val]));
            }}
            disabled={isRecording}
          />
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default LongAndShortType;
