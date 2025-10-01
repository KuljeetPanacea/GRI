import style from "../components/Styles/Assessor.module.css";
import SearchBar from "../../../common/ui/SearchBar";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  FormControl,
  Tooltip,
  Typography,
} from "@mui/material";
import SelectDropdown from "../../../common/ui/SelectDropdown";
import { device } from "../../../redux/projectManagementSlice";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import { useEffect, useState, useMemo } from "react";
import useAssessor from "../useAssessor";
import { GalleryThumbnails, CircleCheckBig } from "lucide-react";
import { setSearchFilter } from "../../../redux/projectManagementSlice";
import { useCallback } from "react";
import { createDebounce } from "../../../common/hooks/useDebouncedValue";
import { setSelectedAvatar } from "../../../redux/DigitalAvatarSlice";

const AssessorQstnr = () => {
  const {
    handleQstnrChange,
    handleClearFilters,
    complianceType,
    currentTab,
    setCurrentTab,
    project,
    handleViewQSTNR,
    auditTask,
    auditTasks,
    selectedProject,
    navigate,
    dispatch,
    setSelectedAssesmentId,
  } = useAssessor();

  const [localSearchValue, setLocalSearchValue] = useState("");
  
  const debouncedSearch = useCallback(
    createDebounce((...args: unknown[]) => {
      const value = args[0] as string;
      dispatch(setSearchFilter(value));
      // Trigger audit task with search term and current compliance type
      auditTask(value, complianceType);
    }, 1000),
    [dispatch, auditTask, complianceType]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchValue(value);
    debouncedSearch(value);
  };

  const handleClearAllFilters = () => {
    setLocalSearchValue("");
    handleClearFilters();
  };

  // Filter audit tasks based on current tab only (search and compliance type are handled by API)
  const filteredAuditTasks = useMemo(() => {
    if (!auditTasks || auditTasks.length === 0) return [];
    
    // Filter by completion status only
    if (currentTab === "In Progress") {
      return auditTasks.filter((task: device) => !task.hasAllUserResponses);
    } else if (currentTab === "Completed") {
      return auditTasks.filter((task: device) => task.hasAllUserResponses);
    }
    
    return auditTasks;
  }, [auditTasks, currentTab]);

  useEffect(() => {
    // Initial load with current compliance type
    auditTask("", complianceType);
  }, [complianceType]);

  return (
    <>
      <div className={style.container}>
        <div className={style.PLHeader}>
          <div>
            <h1 className={style.PLHeading}>{project?.projectName}</h1>
          </div>
          <div className={style.PLSearch}>
            <SearchBar value={localSearchValue} onChange={handleSearchChange} />
          </div>
        </div>
        {/* Header Section */}
        <div className={style.headerQstnr}>
          <div className={style.filterClear}>
          <FormControl className={style.dropdown}>
            <SelectDropdown
              title="Compliance Type"
              options={[
                { value: "PCIDSS V4.0", label: "PCI DSS" },
                { value: "ISO27001", label: "ISO 27001" },
                { value: "HIPAA", label: "HIPAA" }
              ]}
              value={complianceType}
              onChange={handleQstnrChange}
              />
          </FormControl>
          <button onClick={handleClearAllFilters} className={style.clearButton}>
           X Clear All
          </button>
          </div>

          <ButtonGroup className={style.tabGroup}>
            <Button
              className={`${style.tabButton} ${
                currentTab === "In Progress"
                  ? style.activeTab
                  : style.inactiveTab
              }`}
              onClick={() => setCurrentTab("In Progress")}
            >
              In Progress
            </Button>
            <Button
              className={`${style.tabButton} ${
                currentTab === "Completed" ? style.activeTab : style.inactiveTab
              }`}
              onClick={() => setCurrentTab("Completed")}
            >
              Completed
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className={style.questionnaireContainer}>
        {filteredAuditTasks?.map((qstnr: device) => (
          <Card className={style.questionnaireCard} key={qstnr.id || qstnr._id}>
            <CardContent className={style.cardContentWrapper}>
              <Box>
                <Typography className={style.titleText}>
                  {qstnr?.deviceRefName}
                  <div className={style.thumbnailContainer}>
                    <Tooltip
                      title="View Gallery"
                      arrow
                      placement="top"
                      enterDelay={300}
                    >
                      <div>
                        <GalleryThumbnails
                          onClick={() => {
                            dispatch(
                              setSelectedAssesmentId(
                                qstnr._id ?? qstnr.id ?? ""
                              )
                            );
                            navigate("/landing/evidence-gallery");
                          }}
                        />
                      </div>
                    </Tooltip>

                    <Chip
                      label={selectedProject?.currentAuditStage}
                      className={style.statusChip}
                      size="small"
                    />
                  </div>
                </Typography>
              </Box>
              <div className={style.assignmentSection}>
                <Typography className={style.assignmentInfo}>
                  Assigned On:{" "}
                  {qstnr.createDtTime
                    ? new Date(qstnr.createDtTime).toLocaleDateString()
                    : "N/A"}
                </Typography>
                <Typography className={style.assignmentInfo}>
                  Device Id: {qstnr.id || qstnr._id || "N/A"}
                </Typography>
                <Box className={style.progressSection}>
                  {qstnr.hasAllUserResponses ? (
                    <CircleCheckBig className={style.progressIcon}  onClick={() =>
                    {
                      handleViewQSTNR(qstnr)
                      dispatch(setSelectedAvatar("manual"));
                    }
                      }/>
                    
                  ) : (
                    <PrimaryButton
                      children={"Begin"}
                      onClick={() =>
                        qstnr.hasAllUserResponses
                          ? (() => {
                              dispatch(
                                setSelectedAssesmentId(
                                  qstnr._id ?? qstnr.id ?? ""
                                )
                              );
                              navigate("/landing/pending-evidences-assessor");
                            })()
                          : handleViewQSTNR(qstnr)
                      }
                    />
                  )}
                </Box>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredAuditTasks.length === 0 && (
          <Typography variant="body1" className={style.noProjects}>
            No {currentTab.toLowerCase()} assessments found.
          </Typography>
        )}
      </div>
    </>
  );
};

export default AssessorQstnr;
