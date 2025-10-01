import style from "./Styles/Assessor.module.css";
import SearchBar from "../../../common/ui/SearchBar";
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Typography
} from "@mui/material";
import SelectDropdown from "../../../common/ui/SelectDropdown";

import PrimaryButton from "../../../common/ui/PrimaryButton";
import { useEffect } from "react";
import useAssessor, { AssessorGap, AssessorIdentifiedGap } from "../useAssessor";

const AssessorGaps = () => {
  const {
    project,
    AssessorGaps: fetchAssessorGaps,
    assessorGaps,
    selectedProject,
    navigate,
    dispatch,
    setSelectedAssesmentId,
    searchTerm,
    handleSearchChange,
    deviceTypeFilter,
    handleDeviceTypeChange,
    gapStatusFilter,
    handleGapStatusChange,
    clearFilters,
    filteredAssessorGaps,
  } = useAssessor();

  console.log("assessorGaps", assessorGaps);
  useEffect(() => {
    fetchAssessorGaps();
  }, []);

  // Get unique device types for filter dropdown
  const getUniqueDeviceTypes = () => {
    const deviceTypes = assessorGaps.map((gap: AssessorGap) => gap.deviceType).filter(Boolean);
    return [...new Set(deviceTypes)].map(type => ({ value: type, label: type }));
  };

  // Get unique gap statuses for filter dropdown
  const getUniqueGapStatuses = () => {
    const statuses: string[] = [];
    assessorGaps.forEach((gap: AssessorGap) => {
      gap.identifiedGaps?.forEach((identifiedGap: AssessorIdentifiedGap) => {
        if (identifiedGap.status && !statuses.includes(identifiedGap.status)) {
          statuses.push(identifiedGap.status);
        }
      });
    });
    return statuses.map(status => ({ value: status, label: status }));
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.PLHeader}>
          <div>
            <h1 className={style.PLHeading}>{project?.projectName}</h1>
          </div>
          <div className={style.PLSearch}>
            <SearchBar 
              value={searchTerm} 
              onChange={(event) => handleSearchChange(event.target.value)} 
            />
          </div>
        </div>
        
        {/* Filter Section */}
          <FormControl className={style.dropdown}>
        <div className={style.header}>
            <SelectDropdown
              title="Device Type"
              options={getUniqueDeviceTypes()}
              value={deviceTypeFilter}
              onChange={(event) => handleDeviceTypeChange(event.target.value as string)}
            />
            <SelectDropdown
              title="Gap Status"
              options={getUniqueGapStatuses()}
              value={gapStatusFilter}
              onChange={(event) => handleGapStatusChange(event.target.value as string)}
            />
            {(searchTerm || deviceTypeFilter || gapStatusFilter) && (
              <button
               className={style.clearButton}
                onClick={clearFilters}
              >
               X Clear Filters
              </button>
            )}
        </div>
          </FormControl>
      </div>
      
      <div className={style.questionnaireContainer}>
        {filteredAssessorGaps?.map((gap: AssessorGap) => (
          <Card className={style.questionnaireCard} key={gap.assessmentId}>
            <CardContent className={style.cardContentWrapper}>
              <Box>
                <Typography className={style.titleText}>
                  {gap?.deviceRef ? gap?.deviceRef : "N/A"}
                  <div className={style.thumbnailContainer}>
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
                  Reference Name:{" "}
                  {gap.deviceRef ? gap.deviceRef : "N/A"}
                </Typography>
                <Typography className={style.assignmentInfo}>
                  Assessment Id: {gap.assessmentId || "N/A"}
                </Typography>
                <Typography className={style.assignmentInfo}>
                  Gap Identified: {gap?.identifiedGaps?.length || "N/A"}
                </Typography>
                <Box className={style.progressSection}>
                  <PrimaryButton
                    children={"Begin"}
                    onClick={() => {
                      dispatch(
                        setSelectedAssesmentId(
                          gap.assessmentId ?? ""
                        )
                      );
                      navigate("/landing/AsssessorRevise");
                    }}
                  />
                </Box>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* No results message */}
        {filteredAssessorGaps?.length === 0 && assessorGaps?.length > 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h3" color="text.secondary">
              No gaps found matching your search criteria
            </Typography>
          </Box>
        )}
      </div>
    </>
  );
};

export default AssessorGaps;
