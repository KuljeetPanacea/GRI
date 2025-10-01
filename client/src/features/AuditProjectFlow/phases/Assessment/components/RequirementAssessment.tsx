import style from "./AssessmentComponents.module.css";
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
import AssessmentTable from "./AssessmentTable";
import ExpandablePanel from "./ExpandablePanel";
import AssessmentDrawer from "./AssessmentDrawer";
import useAssessment from "../useAssessmentView";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DataControl } from "../../../../../common/config/controlData";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  resetActiveFilterRedux,
  resetSelectedControlNoGap,
  resetSelectedReqNoGap,
  resetSelectedSubReqNoGap,
  resetsetAEInternalAssesorGap,
} from "../../../../../redux/GapsRemediationSlice";
import {
  selectOpenSubReq,
  clearAllSubReqs,
  resetControlFinding,
  setSelectedControl,
} from "../../../../../redux/assessmentSlice";

const RequirementAssessment = () => {
  const {
    selectedReq,
    selectedControl,
    setSelectedReq,
    handleSubReqToggle,
    handleControlClick,
    reqConfig,
    header,
    setHeader,
    dispatch,
    handleMouseDown,
    topHeight,
  } = useAssessment();
  
  const {
    selectedControlNoGap,
    selectedSubReqNoGap,
    selectedReqNoGap,
    selectedAEInternalAssessorGap,
    ActiveFilter,
  } = useSelector((state: RootState) => state.gapsRemediation);
  
  const openSubReq = useSelector(selectOpenSubReq);
  
  useEffect(() => {
    const reqNo = selectedReqNoGap;
    const controlNo = selectedControlNoGap;
    const subControlId = selectedSubReqNoGap;
    const selectedAEInternalAssessor = selectedAEInternalAssessorGap;
    if (!reqNo || !controlNo || !subControlId || !selectedAEInternalAssessor)
      return;
    setTimeout(() => {
        setSelectedReq(reqNo);
        handleSubReqToggle(subControlId.replace("Sub-req-", ""));
        handleControlClick({ title: controlNo });
      }, 100);
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
    <Box className={style.reqContainer}>
      <Box position="relative">
        <div className={style.reqHeader}>
          {reqConfig.map((req) => (
            <div
              key={req.reqName}
              className={`${style.reqButton} ${
                selectedReq === req.reqName ? style.selected : ""
              } ${
                req.reqName === "Req-1" ? style.reqButtonFirst :
                req.reqName === "Req-12" ? style.reqButtonLast : 
                style.reqButtonMiddle
              }`}
              onClick={() => {
                // Clear all data when requirement changes
                dispatch(clearAllSubReqs());
                dispatch(resetControlFinding());
                dispatch(setSelectedControl(null)); // Clear selected control
                setHeader([]); // Clear table data
                setSelectedReq(req.reqName);
              }}
            >
              {req.reqName}
            </div>
          ))}
        </div>
      </Box>
      
      {/* Content Area */}
      <Box className={style.reqContentArea}>
        {/* Sidebar */}
        <div className={style.stakeholderSidebar}>
          {reqConfig
            .find((req) => req.reqName === selectedReq)
            ?.subReq?.map((subReq) => (
              <Box key={subReq.title}>
                <ListItem
                  component="button"
                  onClick={() =>
                    handleSubReqToggle(subReq.title.replace("Sub-req-", ""))
                  }
                  className={`${style.subReqListItem} ${
                    openSubReq[subReq.title.replace("Sub-req-", "")] ? style.subReqListItemActive : ""
                  }`}
                >
                  <Typography 
                    variant="body2"
                    className={`${style.subReqTypography} ${
                      openSubReq[subReq.title.replace("Sub-req-", "")] ? style.subReqTypographyActive : ""
                    }`}
                  >
                    {subReq.title}
                  </Typography>
                  {openSubReq[subReq.title.replace("Sub-req-", "")] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItem>
                <Collapse
                  in={openSubReq[subReq.title.replace("Sub-req-", "")]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {subReq.controls.map((control) => (
                      <ListItem
                        component="button"
                        key={control.title}
                        className={`${style.controlListItem} ${
                          control.title === selectedControl?.title ? style.controlListItemActive : ""
                        }`}
                        onClick={() => handleControlClick(control)}
                      >
                        <Typography
                          variant="body2"
                          className={`${style.controlTypography} ${
                            control.title === selectedControl?.title ? style.controlTypographyActive : ""
                          }`}
                        >
                          {control.title}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            )) ?? []}
        </div>
        
        <div className={style.reqControlDataContainer}>
          <div className={style.reqResizeableLayout}>
            <div className={style.leftBar}>
              <div
                className={style.contentTopSection}
                style={{ height: `${topHeight}%` }}
              >
                {selectedControl ? (
                  <pre className={style.controlPreContainer}>
                    <Typography className={style.customTypographyButton}>
                      {selectedControl.title?.replace(/Control-/g, "")}
                    </Typography>
                    <Typography className={style.customTypography}>
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
                ) : (
                  <Typography className={style.customTypography}>
                    Select a control to view its details.
                  </Typography>
                )}
                <AssessmentTable data={header} />
              </div>
              <div className={style.dragBar} onMouseDown={handleMouseDown} />
              <Box
                className={style.expandablePanelContainer}
                style={{ height: `${100 - topHeight}%` }}
              >
                <ExpandablePanel />
              </Box>
            </div>
            <div className={style.rightDrawer1}>
              <AssessmentDrawer />
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default RequirementAssessment;