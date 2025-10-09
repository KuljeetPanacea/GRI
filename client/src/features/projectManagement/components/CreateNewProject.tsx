import React, { useRef } from "react";
import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import ProgressStepper from "./CreateNewProjectForm/ProgressStepper";
import ProjectDetails from "./CreateNewProjectForm/ProjectDetails";
import ClientDetails from "./CreateNewProjectForm/ClientDetails";
import AuditTeamDetails from "./CreateNewProjectForm/AuditTeamDetails";
import ScopingQuestionnaire from "./CreateNewProjectForm/ScopingQuestionnaire";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import styles from "../ProjectManagement.module.css";
import { useCreateNewProject } from "../hooks/useCreateNewProject";
import {
  prevStep,
  updateFormField,
} from "../../../redux/createNewProjectSlice";
import { useState } from "react";
import DraftWarningModal from "./CreateNewProjectForm/DraftWarningModal";
import { useNavigationBlocker } from "../hooks/useNavigationBlocker";
import { resetDraftStatus } from "../../../redux/projectManagementSlice";
import { RootState, useAppSelector } from "../../../redux/store";

const sections = [
  { id: 0, title: "1. Project Description", component: ProjectDetails },
  { id: 1, title: "2. Client Details", component: ClientDetails },

  { id: 2, title: "3. Audit Team Details", component: AuditTeamDetails },
  { id: 3, title: "4. Scoping Questionnaire", component: ScopingQuestionnaire },
];

const CreateNewProject: React.FC = () => {
  const {
    activeStep,
    Project,
    isLoading,
    error,
    dispatch,
    handleCreateProject,
    handleUpdateProject,
    handleSubmit,
    formType,
  } = useCreateNewProject();

  const ActiveComponent = sections[activeStep].component;
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [nextLocation, setNextLocation] = useState<(() => void) | null>(null);
  const isSubmitting = useRef(false);

  useNavigationBlocker((tx) => {
   if (!isSubmitting.current) {
      setShowDraftModal(true);
      setNextLocation(() => tx.retry);
    } else {
      
      tx.retry();
    }
  }, formType === "add");

const handleModalClose = () => {
  setShowDraftModal(false);
  dispatch(resetDraftStatus());
  setNextLocation(null); 
};

const handleModalOk = () => {
  setShowDraftModal(false);
  dispatch(resetDraftStatus());
  if (nextLocation) {
    nextLocation(); 
    setNextLocation(null);
  }
};

  const draftStatus = useAppSelector(
    (state: RootState) => state.projectManagement.draftStatus
  );

  const getDraftMessage = () => {
    if (draftStatus === "started") {
      return "No Project is created.";
    }
    if (draftStatus === "inprogress") {
      return "Project is not submitted and saved in Draft mode. Revisit later to finish it later";
    }
    return "";
  };

    const handleSubmitWithFlag = async () => {
    isSubmitting.current = true;
    try {
      await handleSubmit();
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <div className={styles.projectForm}>
      <div className={styles.navigation}>
        <NavLink to="/landing/project-management">
          <ArrowBackIosIcon className={styles.icon} />
        </NavLink>
        Project Overview
      </div>
      {formType === "add" ? (
        <Typography variant="h2" className={styles.heading}>
          Create New Project
        </Typography>
      ) : (
        <Typography variant="h2" className={styles.heading}>
          Edit Project
        </Typography>
      )}
      <ProgressStepper activeStep={activeStep} />
      <Typography variant="h3" className={styles.formTitle}>
        {sections[activeStep].title}
      </Typography>
      <div className={styles.formComponent}>
        <ActiveComponent
          formData={Project}
          handleChange={(field, value) =>
            dispatch(updateFormField({ field, value }))
          }
        />
        <div className={styles.navigationButtons}>
          {activeStep > 0 && (
            <PrimaryButton onClick={() => dispatch(prevStep())}>
              Previous
            </PrimaryButton>
          )}
          {activeStep < sections.length - 1 ? (
            <PrimaryButton
              onClick={
                activeStep === 0 ? handleCreateProject : handleUpdateProject
              }
              disabled={isLoading}
            >
              Next
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleSubmitWithFlag} disabled={isLoading}>
              Submit
            </PrimaryButton>
          )}
        </div>
        {error && <Typography color="error">{error}</Typography>}
      </div>
      <DraftWarningModal
  open={showDraftModal}
  onClose={handleModalClose} 
  onOk={handleModalOk}       
  message={getDraftMessage()}
/>
    </div>
  );
};

export default CreateNewProject;
