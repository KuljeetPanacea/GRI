import {
  List,
  ListItem,
  Box,
  Typography,
  Collapse,
  Tooltip,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ExpandablePanel from "./ExpandablePanel";
import AssessmentDrawer from "./AssessmentDrawer";
import styles from "./AssessmentComponents.module.css";
import AssessmentTable from "./AssessmentTable";
import { DataControl } from "../../../../../common/config/controlData";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect } from "react";
import {
  resetActiveFilterRedux,
  resetSelectedControlNoGap,
  resetSelectedReqNoGap,
  resetSelectedSubReqNoGap,
  resetsetAEInternalAssesorGap,
} from "../../../../../redux/GapsRemediationSlice";
import useAEInternal from "../useAEInternal";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { clearAllSubReqs, resetControlFinding, setSelectedControl } from "../../../../../redux/assessmentSlice";

const StakeholderAssessment = () => {
  const {
    selectedReq,
    selectedControl,
    setSelectedReq,
    openSubReq,
    handleSubReqToggle,
    handleControlClick,
    aeStakeHolder,
    aeIntial,
    setAeIntial,
    fetchcontrolAE,
    aeSidebar,
    handleMouseDown,
    topHeight,
    dispatch,
  } = useAEInternal();

  const buttonWidth =
    aeStakeHolder.length > 7
      ? "calc(100% / 7)"
      : `calc(100% / ${aeStakeHolder.length})`;
   const {
      selectedControlNoGap,
      selectedSubReqNoGap,
      selectedReqNoGap,
      selectedAEInternalAssessorGap,
      ActiveFilter,
    } = useSelector((state: RootState) => state.gapsRemediation);

  useEffect(() => {
    const reqNo = selectedReqNoGap;
    const controlNo = selectedControlNoGap;
    const subControlId = selectedSubReqNoGap;
    const selectedAEInternalAssessor = selectedAEInternalAssessorGap;

    // Bail early if values are missing
    if (!reqNo || !controlNo || !subControlId || !selectedAEInternalAssessor)
      return;

    setTimeout(() => {
      setSelectedReq(selectedAEInternalAssessor);
      handleControlClick({ title: controlNo });
    }, 100); // Delay to ensure aeSidebar is updated
    return () => {
      dispatch(resetSelectedReqNoGap());
      dispatch(resetSelectedControlNoGap());
      dispatch(resetSelectedSubReqNoGap());
      dispatch(resetActiveFilterRedux());
      dispatch(resetsetAEInternalAssesorGap());
    };
  }, [
    selectedReqNoGap,
    selectedControlNoGap,
    selectedSubReqNoGap,
    selectedAEInternalAssessorGap,
    dispatch,
    ActiveFilter,
    handleSubReqToggle,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetSelectedReqNoGap());
      dispatch(resetSelectedControlNoGap());
      dispatch(resetSelectedSubReqNoGap());
      dispatch(resetActiveFilterRedux());
      dispatch(resetsetAEInternalAssesorGap());
    };
  }, [dispatch]);
  return (
    <Box className={styles.reqContainer}>
      <Box position="relative">
        <div className={styles.reqHeader}>
          {aeStakeHolder.map((req) => (
            <div
              key={req}
              className={`${styles.stakeholderButton} ${
                selectedReq === req ? styles.selected : styles.unselected
              }`}
              onClick={() => {
                // Clear all data when stakeholder changes
                dispatch(clearAllSubReqs());
                dispatch(resetControlFinding());
                setAeIntial(undefined);
                dispatch(setSelectedControl(null)); // Clear selected control
                dispatch(setSelectedReq(req));
                fetchcontrolAE(req);
              }}
              style={{ flex: `0 0 ${buttonWidth}` }}
            >
              {req}
            </div>
          ))}
        </div>
      </Box>

      <Box className={styles.reqContentArea}>
        {/* Sidebar */}
        <div className={styles.stakeholderSidebar}>
          {aeSidebar.map((subReq, index) => (
            <Box key={index}>
              <ListItem
                component="button"
                onClick={() => handleSubReqToggle(subReq.title)}
                sx={{
                  backgroundColor: openSubReq[subReq.title] ? "#f0f8ff" : "transparent",
                  borderLeft: openSubReq[subReq.title] ? "3px solid #1976d2" : "none",
                  "&:hover": {
                    backgroundColor: "#f5f5f5"
                  }
                }}
              >
                <Typography 
                  variant="body2"
                  sx={{
                    color: openSubReq[subReq.title] ? "#1976d2" : "inherit",
                    fontWeight: openSubReq[subReq.title] ? "bold" : "normal"
                  }}
                >
                  {subReq.title}
                </Typography>
                {openSubReq[subReq.title] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse
                in={openSubReq[subReq.title]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {subReq.controls.map((control, idx) => (
                    <ListItem
                      component="button"
                      key={idx}
                      sx={{
                        backgroundColor: control.title === selectedControl?.title ? "#fff3e0" : "transparent",
                        borderLeft: control.title === selectedControl?.title ? "3px solid #ff9800" : "none",
                        "&:hover": {
                          backgroundColor: control.title === selectedControl?.title ? "#fff3e0" : "#f5f5f5"
                        }
                      }}
                      onClick={() => handleControlClick(control)}
                    >
                      <Typography 
                        variant="body2"
                        sx={{
                          color: control.title === selectedControl?.title ? "#ff9800" : "inherit",
                          fontWeight: control.title === selectedControl?.title ? "bold" : "normal"
                        }}
                      >
                        {control.title}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </div>
        <div className={styles.reqControlDataContainer}>
          <div className={styles.reqResizeableLayout}>
            <div className={styles.leftBar}>
              <div className={styles.contentTopSection}>
                {selectedControl && (
                  <pre
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Typography className={styles.customTypographyButton}>
                      {selectedControl.title.replace(/Control-/g, "")}
                    </Typography>
                    <Typography className={styles.customTypography}>
                      {DataControl[selectedControl.title]
                        ?.replace(/\n/g, " ")
                        .slice(0, 133)
                        .concat(
                          DataControl[selectedControl.title].length > 133
                            ? "..."
                            : ""
                        )}
                    </Typography>
                    <Tooltip
                      title={DataControl[selectedControl.title]}
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </pre>
                )}
                {aeIntial && <AssessmentTable data={[aeIntial]} />}
              </div>
              <div className={styles.dragBar} onMouseDown={handleMouseDown} />
              <Box
                className={styles.expandablePanelContainer}
                style={{ height: `${100 - topHeight}%` }}
              >
                <ExpandablePanel />
              </Box>
            </div>

            <div className={styles.rightDrawer1}>
              <AssessmentDrawer />
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default StakeholderAssessment;
