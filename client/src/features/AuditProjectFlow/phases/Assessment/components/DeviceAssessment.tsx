import {
  List,
  ListItem,
  Box,
  Typography,
  Collapse,
  Select,
  OutlinedInput,
  InputAdornment,
  FormControl,
  MenuItem,
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
import { resetSelectedReqNoGap, resetSelectedSubReqNoGap, resetSelectedControlNoGap, resetActiveFilterRedux, resetsetAEInternalAssesorGap } from "../../../../../redux/GapsRemediationSlice";
import { clearAllSubReqs, resetControlFinding } from "../../../../../redux/assessmentSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useDispatch } from "react-redux";
import useDevice from "../useDevice";


const DeviceAssessment = () => {
  const {
    selectedReq,
    selectedControl,
    setSelectedReq,
    openSubReq,
    handleSubReqToggle,
    handleControlClick,
    phaseType,
    aeIntial,
    setAeIntial,
    deviceDropDown,
    fetchDeviceSideBar,
    deviceSideBar,
    handleChange,
    handleMouseDown,
    topHeight,
  } = useDevice();

const dispatch = useDispatch();
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
    if (!reqNo || !controlNo || !subControlId || !selectedAEInternalAssessor)
      return;

    setTimeout(() => {
      handleControlClick({ title: controlNo });
    }, 100); // Delay to ensure aeSidebar is updated
    // Cleanup when component unmounts or dependencies change
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
    ActiveFilter,
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
    <Box className={styles.assessmentDeviceContainer}>
      <div>
        <FormControl className={styles.formControl}>
          <Select
            value={phaseType}
            onChange={handleChange}
            labelId="phase-select-label"
            id="phase-select"
            input={
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">Device:</InputAdornment>
                }
              />
            }
           className={styles.mycustombox}
          >
            {deviceDropDown.map((dev) => (
              <MenuItem key={dev.category} value={dev.category}>
                <Tooltip title={dev.category}>
                  <Typography
                    noWrap
                    className={styles.truncatetext}
                  >
                    {dev.category}
                  </Typography>
                </Tooltip>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Sidebar */}
        <div className={styles.stakeholderSidebarSort}>
          {deviceSideBar.map((data) => (
            <Box key={data.subReq}>
              <ListItem
                component="button"
                onClick={() => handleSubReqToggle(String(data.subReq))}
                sx={{
                  backgroundColor: openSubReq[data.subReq] ? "#f0f8ff" : "transparent",
                  borderLeft: openSubReq[data.subReq] ? "3px solid #1976d2" : "none",
                  "&:hover": {
                    backgroundColor: "#f5f5f5"
                  }
                }}
              >
                <Typography 
                  variant="body2"
                  sx={{
                    color: openSubReq[data.subReq] ? "#1976d2" : "inherit",
                    fontWeight: openSubReq[data.subReq] ? "bold" : "normal"
                  }}
                >
                  {data.subReq}
                </Typography>

                {openSubReq[data.subReq] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse
                in={openSubReq[data.subReq]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {data.controls.map((control) => (
                    <ListItem
                      component="button"
                      key={control}
                      sx={{
                        backgroundColor: control === selectedControl?.title ? "#fff3e0" : "transparent",
                        borderLeft: control === selectedControl?.title ? "3px solid #ff9800" : "none",
                        "&:hover": {
                          backgroundColor: control === selectedControl?.title ? "#fff3e0" : "#f5f5f5"
                        }
                      }}
                      onClick={() => handleControlClick(control)}
                    >
                      <Typography 
                        variant="body2"
                        sx={{
                          color: control === selectedControl?.title ? "#ff9800" : "inherit",
                          fontWeight: control === selectedControl?.title ? "bold" : "normal"
                        }}
                      >
                        {control}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          )) ?? []}
        </div>
      </div>
      <div className={styles.controlDataContainer}>
        <div className={styles.controlHeaderContainer}>
          {deviceDropDown
            .find((item) => item.category === phaseType)
            ?.deviceRef.map((ref, index) => (
              <div
                key={index}
                className={`${styles.reqButton} ${
                  selectedReq === ref ? styles.selected : ""
                }`}
                onClick={() => {
                  // Clear all data when device changes
                  dispatch(clearAllSubReqs());
                  dispatch(resetControlFinding());
                  setAeIntial(undefined);
                  dispatch(setSelectedReq(ref));
                  fetchDeviceSideBar(ref);
                }}
              >
                {ref}
              </div>
            ))}
        </div>

        <div className={`${styles.reqControlDataContainer}`}>
          <div className={styles.reqResizeableLayout}>
            <div className={styles.leftBar}>
              <div className={styles.contentTopSection}>
                {selectedControl && (
                  <pre
                    className={styles.flexcentergap}
                  >
                    <Typography className={styles.customTypographyButton}>
                      {selectedControl.title.replace(/Control-/g, "")}
                    </Typography>
                    <Typography className={styles.customTypography}>
                      {DataControl[selectedControl.title]
                        ?.replace(/\n/g, " ")
                        .slice(0, 120)
                        .concat(
                          DataControl[selectedControl.title].length > 124
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
                {aeIntial && (
                  <AssessmentTable
                    data={Array.isArray(aeIntial) ? aeIntial : [aeIntial]}
                  />
                )}
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
      </div>
    </Box>
  );
};

export default DeviceAssessment;
