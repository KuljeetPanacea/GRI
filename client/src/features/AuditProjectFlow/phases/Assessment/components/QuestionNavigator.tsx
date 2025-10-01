import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { useDispatch } from "react-redux";
import { setCurrentQuestionIndex } from "../../../../../redux/assessmentSlice";
import { AssessmentQuestion } from "../../../../../features/AuditProjectFlow/phases/Assessment/useExpandPanel";

type QuestionNavigatorProps = {
  assessmentQuestions: AssessmentQuestion[];
};

const QuestionNavigator = ({ assessmentQuestions }: QuestionNavigatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      dispatch(setCurrentQuestionIndex(newIndex));
    }
  };

  const handleNext = () => {
    if (currentIndex < assessmentQuestions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      dispatch(setCurrentQuestionIndex(newIndex));
    }
  };

  // Update Redux store when component mounts or currentIndex changes
  useEffect(() => {
    dispatch(setCurrentQuestionIndex(currentIndex));
  }, [currentIndex, dispatch]);

  const currentQuestion = assessmentQuestions[currentIndex];

  return (
    <Box sx={{p:1}}>
        <Typography variant="subtitle1" fontWeight="bold">
          {currentIndex + 1}. {currentQuestion.qstnDesc}
        </Typography>

        <Typography sx={{ mt: 2, fontWeight: 500 }}>
          {currentQuestion.response || "No response provided."}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap:1 }}>
          <IconButton onClick={handlePrev} disabled={currentIndex === 0}
          sx={{
            backgroundColor: "white",
            color: "black",
            borderRadius: "50%",
            border: "1.5px solid grey", 
          }}
         >
          <ExpandLessRoundedIcon/>
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={currentIndex === assessmentQuestions.length - 1}
            sx={{
                backgroundColor: "red",
                color: "white",
                borderRadius: "50% ",
                border: "1.5px solid grey",
              }}
          >
            <ExpandMoreRoundedIcon />
          </IconButton>
      </Box>
    </Box>
  );
};

export default QuestionNavigator;
