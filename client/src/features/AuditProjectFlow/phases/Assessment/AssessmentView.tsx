import { AppBar, Button, Box, Typography } from "@mui/material";

import AssessmentQuestionList from "./components/AssessmentQuestionList";
import {  useDispatch } from "react-redux";

import useAssessmentQuestionnaire from "./hooks/useAssessmentQuestionnaire";
import { setSelectedPhase } from "../../../../redux/phaseSlice";
import { useNavigate, useLocation } from "react-router-dom";

const AssessmentView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { questionnaires, isLoading, error } = useAssessmentQuestionnaire();

  // Get navigation state for specific question
  const navigationState = location.state;

  const handlePhaseChange = (phaseName: string) => {
    dispatch(setSelectedPhase(phaseName));
    navigate("/landing/ProjectView");
  };

  return (
    <div>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: "transparent", color: "black" }}
      >
      </AppBar>
      
      {error ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Error Loading Questionnaires
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => handlePhaseChange("preScoping")}
            >
              Go to Pre Scoping
            </Button>
            <Button
              variant="outlined"
              onClick={() => handlePhaseChange("gapandRemediation")}
            >
              Go to Gap & Remediation
            </Button>
            <Button
              variant="outlined"
              onClick={() => handlePhaseChange("assuranceReport")}
            >
              Assurance Report
            </Button>
            <Button
              variant="outlined"
              onClick={() => handlePhaseChange("complianceReport")}
            >
              Go to Compliance Report
            </Button>
          </Box>
        </Box>
      ) : (
        <AssessmentQuestionList
          questionnaires={questionnaires}
          isLoading={isLoading}
          error={error}
          navigationState={navigationState}
        />
      )}
    </div>
  );
};

export default AssessmentView;
