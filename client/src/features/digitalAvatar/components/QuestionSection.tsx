import { useEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styles from "../DigitalAvatar.module.css";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import useDigitalAvatar from "../useDigitalAvatar";
import SingleType from "../typeOfQuestion/SingleType";
import MultipleType from "../typeOfQuestion/MultipleType";
import LongAndShortType from "../typeOfQuestion/LongAndShortType";
import FileType from "../typeOfQuestion/FileType";
import {
  setQuestion,
  setSelectedAvatar,
} from "../../../redux/DigitalAvatarSlice";
import { Typography } from "@mui/material";
import useAssessor from "../../ProjectLIstForAssessor/useAssessor";
import { setReadOnlyViewQuestion } from "../../../redux/projectManagementSlice";

const QuestionSection = () => {
  const {
    currentQuestion,
    dispatch,
    selectedAvatar,
    selectedQSTNR,
    setReadOnlyQuestions,
    setIsReadOnlyMode,
    setCurrentQuestionIndex,
    fetchQuestion,
    isReadOnlyMode,
    readOnlyQuestions,
    currentQuestionIndex,
    handlePreviousQuestion,
    handleNextQuestion,
    handleAvatarClick,
    navigate,
    handleManualClick,
  } = useDigitalAvatar();
  const { project } = useAssessor();

  useEffect(() => {
    if (selectedQSTNR?.isCompletedAllQuestions && selectedQSTNR.questions) {
      // Set read-only mode
      setIsReadOnlyMode(true);
      setReadOnlyQuestions(selectedQSTNR.questions);
      setCurrentQuestionIndex(0);

      dispatch(setSelectedAvatar("manual"));
      dispatch(setReadOnlyViewQuestion(selectedQSTNR.questions));

      // Set the first question for display
      if (selectedQSTNR.questions.length > 0) {
        dispatch(setQuestion(selectedQSTNR.questions[0]));
      }
    } else {
      setIsReadOnlyMode(false);
      fetchQuestion();
    }
  }, [selectedQSTNR]);

  const isPreviousDisabled = isReadOnlyMode
    ? currentQuestionIndex === 0
    : false;
  const isNextDisabled = isReadOnlyMode
    ? currentQuestionIndex === readOnlyQuestions.length - 1
    : false;

  return (
    <div className={styles.questionSectionAvatar}>
      {/* TOP SECTION */}
      <div style={{ alignSelf: "flex-start" }}>
        <Typography
          variant="h3"
          className={styles.questionText}
          sx={{ mt: 2, mb: 2 }}
        >
          {project?.projectName}
        </Typography>

        <div className={styles.ManualAvatarcontainer}>
          <button
            className={`${styles.ManualAvatarbutton} ${
              selectedAvatar === "avatar" ? styles.ManualAvataractive : ""
            }`}
            disabled={selectedQSTNR?.isCompletedAllQuestions}
            onClick={handleAvatarClick}
          >
            Avatar
          </button>

          <button
            className={`${styles.ManualAvatarbutton} ${
              selectedAvatar === "manual" ? styles.ManualAvataractive : ""
            }`}
            disabled={selectedQSTNR?.isCompletedAllQuestions}
            onClick={handleManualClick}
          >
            Manual
          </button>
        </div>
      </div>

      {/* CENTERED CONTENT SECTION */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <fieldset
          disabled={isReadOnlyMode}
          className={styles.questionCardWrapper}
        >
          {currentQuestion?.type === "single_choice" && <SingleType />}
          {currentQuestion?.type === "multiple_choice" && <MultipleType />}
          {(currentQuestion?.type === "short_text" ||
            currentQuestion?.type === "long_text") && <LongAndShortType />}
          {currentQuestion?.type === "file_type" && <FileType />}
        </fieldset>
        <div className={styles.navigationButtons}>
          <PrimaryButton
            className={styles.prevButton}
            startIcon={<ArrowBackIosNewIcon className={styles.buttonIcon} />}
            onClick={handlePreviousQuestion}
            disabled={isPreviousDisabled}
          >
            Previous
          </PrimaryButton>

          {isNextDisabled ? (
            <PrimaryButton
              className={styles.nextButton}
              endIcon={<ArrowForwardIosIcon className={styles.buttonIcon} />}
              onClick={() => navigate("/landing/assessor-qstnr")}
            >
              Last
            </PrimaryButton>
          ) : (
            <PrimaryButton
              className={styles.nextButton}
              endIcon={<ArrowForwardIosIcon className={styles.buttonIcon} />}
              onClick={handleNextQuestion}
              disabled={isNextDisabled}
            >
              Next
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionSection;
