import React, { useEffect } from "react";
import usePVHeader from "../hooks/useAuditProjectHeader";
import styles from "../styles/PV360.module.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AuditProjectPhases from "./AuditProjectPhases";
import FeedbackSnackbar from "../../../common/ui/FeedbackSnackbar";
import store, { AppDispatch, RootState } from "../../../redux/store";
import {
  InputAdornment,
  OutlinedInput,
  FormControl,
  Typography,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import usePhaseBreadcrumbs from "../hooks/useAuditProjectPhases";
import { useDispatch, useSelector } from "react-redux";
import { selectSortBy, setSortBy } from "../../../redux/assessmentSlice";
import { resetIsGapremediation } from "../../../redux/GapsRemediationSlice";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { FileText } from "lucide-react";
import { Users } from "lucide-react";
import { useState } from "react";
import { updateProject } from "../../../api/project";
import useAxios from "../../../api/useAxios";

const AuditProjectHeader: React.FC = () => {
  const {
    project,
    isDetailsVisible,
    toggleDetails,
    snackbar,
    handleSnackbarClose,
    AEListView,
    AssessmentEvidencetracker,
    navigate,
  } = usePVHeader();
  const { isGapremediation } = useSelector(
    (state: RootState) => state.gapsRemediation
  );
 
  const [showStageChangeDialog, setShowStageChangeDialog] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const axiosInstance = useAxios();

  const dispatch = useDispatch<AppDispatch>();
  const sortBy = useSelector(selectSortBy);
  const { phases, selectedPhase, handlePhaseClick } = usePhaseBreadcrumbs();
  const menuOptions = ["Device", "AE Internal Assessors", "Requirement"];

  useEffect(() => {
    return () => {
      dispatch(resetIsGapremediation());
    };
  }, [selectedPhase, dispatch]);

  const handleStageChange = async () => {
    if (!project?._id || !selectedStage) return;
    
    try {
      setIsUpdating(true);
      await updateProject(axiosInstance, project._id, {
        currentAuditStage: selectedStage,
        __v: project.__v || 0
      });
      
      // Update the project in Redux state
      // You might need to dispatch an action to update the project state
      
      setShowStageChangeDialog(false);
      setSelectedStage("");
      
      // Show success message
      // You can add a snackbar notification here
      
    } catch (error) {
      console.error("Error updating project stage:", error);
      // Show error message
    } finally {
      setIsUpdating(false);
    }
  };

  if (!project) {
    return <div>No project selected</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <div>
          <div className={styles.headingContainer} onClick={toggleDetails}>
            <h1 className={styles.heading}>{project.projectName}</h1>

            {isDetailsVisible ? (
              <KeyboardArrowUpIcon className="w-5 h-5" />
            ) : (
              <KeyboardArrowDownIcon className="w-5 h-5" />
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
         
          <FormControl variant="outlined" sx={{ minWidth: 100 }}>
            <Select
              value={selectedPhase}
              onChange={(e) => handlePhaseClick(e.target.value)}
              labelId="sort-select-label"
              id="sort-select"
              className={styles.customSelect}
              input={
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">Phase:</InputAdornment>
                  }
                />
              }
            >
              {phases.map((data, index) => (
                <MenuItem key={index} value={data.phaseName}>
                  <Typography>{data.title}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedPhase === "assessment" && (
            <>
              <FormControl variant="outlined" sx={{ minWidth: 100 }}>
                <Select
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value))}
                  labelId="sort-select-label"
                  id="sort-select"
                  className={styles.customSelect}
                  input={
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position="start">
                          Sort by:
                        </InputAdornment>
                      }
                    />
                  }
                >
                  {menuOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      <Typography>{option}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FileText
                onClick={AssessmentEvidencetracker}
                className={styles.aeButton}
              />
            </>
          )}

          {/* Ae internal assessor button */}
          <Users onClick={AEListView} className={styles.aeButton} />
          <ArrowRightAltIcon
            onClick={() => setShowStageChangeDialog(true)}
            sx={{
              bgcolor: "#E4E4E4",
              color: "black",
              borderRadius: "10%",
              cursor: "pointer",
              height: "35px",
              width: "35px",
            }}
          />
      
        </div>

        
      </div>
      {store.getState().projectView.isDetailsOpen && <AuditProjectPhases />}

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />

      {isGapremediation ? (
        <nav className={styles.breadcrumb}>
          <span className={styles.crumb} onClick={() => navigate("/landing/ProjectView")}>Gap overview</span>
          <span className={styles.separator} >/</span>
          <span className={styles.crumb} onClick={() => navigate("/landing/gap-remediation")}>Identified gaps</span>
          <span className={styles.separator}>/</span>
          <span className={`${styles.crumb} ${styles.activeCrumb}`}>
            Gap remediation
          </span>
        </nav>
      ) : null}

      {/* Stage Change Dialog */}
      <Dialog open={showStageChangeDialog} onClose={() => setShowStageChangeDialog(false)}>
        <DialogTitle>Change Project Audit Stage</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Current Stage: <strong>{project?.currentAuditStage}</strong>
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select New Stage
              </MenuItem>
              {phases.map((phase) => (
                <MenuItem key={phase.phaseName} value={phase.phaseName}>
                  {phase.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStageChangeDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStageChange} 
            variant="contained"
            disabled={!selectedStage || isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Stage"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuditProjectHeader;
