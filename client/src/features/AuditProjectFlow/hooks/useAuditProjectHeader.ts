import { useState } from "react";
import { RootState, useAppSelector } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { closeSnackbar, showSnackbar } from "../../../redux/phaseSlice";
import { useNavigate } from "react-router-dom";
import { setIsDetailsOpen } from "../../../redux/projectViewSlice";
// You can still define the type here for convenience
type SnackbarSeverity = "success" | "error" | "info" | "warning";

const usePVHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isDetailsVisible = useAppSelector((state:RootState)=> state.projectView.isDetailsOpen);
  const [showAEInternalAssesssorsModal, setShowAEInternalAssesssorsModal] =
    useState(false);

  const AEListView = () =>{
    navigate("/landing/ProjectView/aelist");
  }

  const AssessmentEvidencetracker = () => {
    navigate("/landing/ProjectView/AssessmentEvidenceTracker");
  };

  const openAEInternalAssesssorsModal = () => {
    setShowAEInternalAssesssorsModal(true);
  };
  const closeAEInternalAssesssorsModal = () => {
    setShowAEInternalAssesssorsModal(false);
  };
  const project = useAppSelector(
    (state: RootState) => state.projectView.selectedProject
  );
  const toggleDetails = () => {
    dispatch(setIsDetailsOpen(!isDetailsVisible));
  };

  const snackbar = useAppSelector(
  (state:RootState) => state.phase.snackbar
  )

  const handleSnackbarClose = () =>{
    dispatch(closeSnackbar())
  }

    const showSnackbarMessage = (
      message: string,
      severity: SnackbarSeverity = "info"
    ) => {
      dispatch(showSnackbar({ message, severity }));
      console.log("Snackbar message:", message);
    };

 

  return {
    project,
    isDetailsVisible,
    toggleDetails,
    showAEInternalAssesssorsModal,
    setShowAEInternalAssesssorsModal,
    openAEInternalAssesssorsModal,
    closeAEInternalAssesssorsModal,
    handleSnackbarClose,
    snackbar,
    showSnackbarMessage,
    AEListView,
    AssessmentEvidencetracker,
    navigate,
  };
};

export default usePVHeader;
