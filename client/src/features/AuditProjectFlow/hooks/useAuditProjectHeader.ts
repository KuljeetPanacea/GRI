import { useState } from "react";
import { RootState, useAppSelector } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { closeSnackbar, showSnackbar } from "../../../redux/phaseSlice";
import { useNavigate } from "react-router-dom";
import { setIsDetailsOpen } from "../../../redux/projectViewSlice";
import { downloadRoc } from "../../../api/rocData";
import useAxios from "../../../api/useAxios";

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

    const axios = useAxios();

    const handlePublish = async () => {
    try {
      if (project && typeof project._id === "string" && project._id) {
        const response = await downloadRoc(axios, project._id);

        // If it's a file, handle download
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `roc-${project.projectName}.docx`); 
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        showSnackbarMessage("Project ID is missing or invalid.", "error");
      }
    } catch (error) {
      console.error("Failed to download ROC:", error);
      showSnackbarMessage("Failed to download ROC.", "error");
    }
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
    handlePublish
  };
};

export default usePVHeader;
