import { AppBar, Button, Box, Typography } from "@mui/material";

import AssessmentQuestionList from "./components/AssessmentQuestionList";
import { useSelector, useDispatch } from "react-redux";
import { setSortBy, resetControlFinding, clearAllSubReqs, setSelectedReq, setSelectedControl, setDrawerOpen, setSidebarOpen, setTableLoading } from "../../../../redux/assessmentSlice";
import { useEffect, useRef } from "react";
import { RootState } from "../../../../redux/store";
import useAssessment from "./useAssessmentView";
import useAssessmentQuestionnaire from "./hooks/useAssessmentQuestionnaire";
import { setSelectedPhase } from "../../../../redux/phaseSlice";
import { useNavigate } from "react-router-dom";

const AssessmentView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedProject = useSelector((state: RootState) => state.projectView.selectedProject);
  const prevProjectId = useRef<string | null>(null);
  
  // Remove unused setSelectedReq and assessmentDispatch
  // const { setSelectedReq, reqConfig, dispatch: assessmentDispatch } = useAssessment();
  const { reqConfig } = useAssessment();
  const { questionnaires, isLoading, error } = useAssessmentQuestionnaire();
  const {
    selectedControlNoGap,
    selectedSubReqNoGap,
    selectedReqNoGap,
    selectedAEInternalAssessorGap,
    ActiveFilter,
  } = useSelector((state: RootState) => state.gapsRemediation);

  // Clear assessment state when project changes
  useEffect(() => {
    if (!selectedProject?._id) return;
    if (prevProjectId.current && prevProjectId.current !== selectedProject._id) {
      dispatch(resetControlFinding());
      dispatch(clearAllSubReqs());
      dispatch(setSelectedReq("Req-1"));
      dispatch(setSelectedControl({ title: "" })); // Fix: pass empty control object
      dispatch(setSortBy("Requirement"));
      dispatch(setDrawerOpen(false));
      dispatch(setSidebarOpen(true));
      dispatch(setTableLoading(false));
      // Add any other resets here if needed
    }
    prevProjectId.current = selectedProject._id;
  }, [selectedProject?._id, dispatch]);

  useEffect(() => {
    const reqNo = selectedReqNoGap;
    const controlNo = selectedControlNoGap;
    const subControlId = selectedSubReqNoGap;
    const selectedAEInternalAssessor = selectedAEInternalAssessorGap;

    if (!reqNo || !controlNo || !subControlId || !selectedAEInternalAssessor)
      return;

    if (ActiveFilter?.value === "Stakeholder" && selectedAEInternalAssessor) {
      dispatch(setSortBy("AE Internal Assessors"));

    } else if (
      [
        "Asset",
        "Firewall",
        "Router",
        "Switch",
        "Database",
        "Cloud Network",
        "Server Hardening",
      ].includes(ActiveFilter?.value)
    ) {
      dispatch(setSortBy("Device"));
    } else if (ActiveFilter?.value === "Requirement") {
      dispatch(setSortBy("Requirement"));
    
    } else {
      dispatch(setSortBy("Requirement"));
      // setSelectedReq(reqNo); // removed unused
    }
  
  }, [
    selectedReqNoGap,
    selectedControlNoGap,
    selectedSubReqNoGap,
    ActiveFilter,
    selectedAEInternalAssessorGap,
    dispatch,
    reqConfig,
  ]);

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
        />
      )}
    </div>
  );
};

export default AssessmentView;
