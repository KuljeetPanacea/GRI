import {
  Box,
  Typography,
  TextField,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "./AssessmentComponents.module.css";
import useAssessmentDrawer from "../useAssessmentDrawer";
import style from "./AssessmentComponents.module.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CustomRadioGroup } from "../../../../../common/component/CustomRadioGroup";
import EvidenceSelect from "./EvidenceSelect"; // Updated  EvidenceSelect
import { useEffect, useState } from "react";
import { Evidence } from "../../../../../redux/assessmentSlice";
import { getAllControlEvidences } from "../../../../../api/project";
import useAxios from "../../../../../api/useAxios";

const AssessmentDrawer = () => {
  const {
    expanded,
    handleChange,
    submitControlFinding,
    controlFinding,
    setControlFinding,
    detailedFinding,
    setDetailedFinding,
    validationCustomized,
    setValidationCustomized,
    validationCompensating,
    setvalidationCompensating,
    assessmentMode,
    setAssessmentMode,
    compensationText,
    setCompensationText,
    options,
    modeOfAssessmentOptions,
    selectedControl,
    deviceRefKey,
    evideceRef,
    setEvideceRef,
    hasChanges,
  } = useAssessmentDrawer();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info"
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    const result = await submitControlFinding();
    if (result) {
      setSnackbar({
        open: true,
        message: result.message,
        severity: result.success ? "success" : "error"
      });
    }
  };

  const [evidenceNo, setEvidenceNo] = useState<Evidence[]>([]);
  const axios = useAxios();

useEffect(() => {
  if (selectedControl?.title) {
    getAllControlEvidences(
      axios,
      selectedControl.title
    ).then((allEvidences) => {
      if (Array.isArray(allEvidences) && allEvidences.length > 0) {
        setEvidenceNo(allEvidences);
      } else {
        console.log("No evidences found for", selectedControl.title);
        setEvidenceNo([]);
      }
    });
  } else {
    // Clear evidences when no control is selected
    setEvidenceNo([]);
  }
}, [deviceRefKey, selectedControl]);

  // Show message when no control is selected
  if (!selectedControl?.title) {
    return (
      <div className={style.rightDrawer}>
        <Box className={styles.drawerContainer}>
          <Box className={styles.drawerHeader}>
            <Typography variant="body2">
              <span>
                Control assessment findings
                <Tooltip title="These are findings observed during control assessments.">
                  <IconButton size="small" sx={{ p: 0.4 }}>
                    <InfoOutlinedIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </span>
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: 'text.secondary'
          }}>
            <Typography variant="body1">
              Please select a control to view or edit assessment findings
            </Typography>
          </Box>
        </Box>
      </div>
    );
  }

  return (
    <div className={style.rightDrawer}>
      <Box className={styles.drawerContainer}>
        <Box className={styles.drawerHeader}>
          {/* Left: Text + tooltip inline */}
          <Typography variant="body2">
            <span>
              Control assessment findings
              <Tooltip title="These are findings observed during control assessments.">
                <IconButton size="small" sx={{ p: 0.4 }}>
                  <InfoOutlinedIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </span>
          </Typography>

          {/* Right: Save button */}
          <button 
            onClick={handleSave} 
            className={styles.SaveButton}
            disabled={!hasChanges}
            style={{ 
              opacity: hasChanges ? 1 : 0.5,
              cursor: hasChanges ? 'pointer' : 'not-allowed'
            }}
          >
            Save
          </button>
        </Box>

        <CustomRadioGroup
          options={options}
          value={controlFinding}
          onChange={(val) => setControlFinding(val)}
        />
        <Divider className={styles.dashedDivider} sx={{ my: 2 }} />

        {/* Panel 1: Detailed Finding */}
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body1">1. Detailed finding</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              placeholder="Write detailed reasons here..."
              className={styles.customTextfield}
              multiline
              value={detailedFinding}
              onChange={(e) => setDetailedFinding(e.target.value)}
            />
          </AccordionDetails>
        </Accordion>

        <Divider className={styles.dashedDivider} />

        {/* Panel 2: Validation Method */}
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body1">2. Validation method</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={validationCustomized === "yes" || false}
                onChange={() => {
                  setValidationCustomized(
                    validationCustomized === "yes" ? "no" : "yes"
                  );
                }}
              />
              <span>Customized Approach ({validationCustomized})</span>
            </Box>
            <Box className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={validationCompensating === "yes" || false}
                onChange={() => {
                  setvalidationCompensating(
                    validationCompensating === "yes" ? "no" : "yes"
                  );
                }}
              />{" "}
              <span>Compensating Control ({validationCompensating})</span>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider className={styles.dashedDivider} />

        {/* Panel 3: Mode of Assessment */}
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body1">3. Mode of Assessment</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CustomRadioGroup
              options={modeOfAssessmentOptions}
              value={assessmentMode}
              onChange={(val) => setAssessmentMode(val)}
            />
            <TextField
              fullWidth
              placeholder="Compensating control was used when..."
              className={styles.customTextfield}
              multiline
              sx={{ mt: 2, fontSize: "14px" }}
              value={compensationText}
              onChange={(e) => setCompensationText(e.target.value)}
            />
          </AccordionDetails>
        </Accordion>

        <Divider className={styles.dashedDivider} />

        {/* Panel 4: Evidences Referred - Updated with new  EvidenceSelect */}
        <Accordion
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body1">4. Evidences Referred</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <EvidenceSelect
              placeholder="Select Evidences"
              isMultiple={true}
              options={evidenceNo?.map((row) => ({
                label: row.name, 
                value: row.name, 
              }))}
              value={evideceRef.map((item) => item.name)} 
              onChange={(e) => {
                const selectedNames = e.target.value; 
                const selectedObjects = evidenceNo.filter((row) =>
                  selectedNames.includes(row.name)
                );
                setEvideceRef(selectedObjects);
              }}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AssessmentDrawer;
