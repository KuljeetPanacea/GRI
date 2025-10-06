import style from "../components/AEPoc.module.css";
import SearchBar from "../../../common/ui/SearchBar";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  FormControl,
  Typography,
} from "@mui/material";
import SelectDropdown from "../../../common/ui/SelectDropdown";
import useAEPoc from "../useAEPoc";
import {
  scopingQSTRNR,
} from "../../../redux/projectManagementSlice";
import PrimaryButton from "../../../common/ui/PrimaryButton";

const AEPocQstnr = () => {
  const {
    handleQstnrChange,
    complianceType,
    currentTab,
    setCurrentTab,
    project,
    handleViewQSTNR,
    scopingDataArray,
    hasGaps,
    calculateProgress,
    getProgressBarStyle,
    handleViewGaps
  } = useAEPoc();


  return (
    <>
      <div className={style.container}>
        <div className={style.PLHeader}>
          <div>
            <h1 className={style.PLHeading}>{project?.projectName}</h1>
          </div>
          <div className={style.PLSearch}>
            <SearchBar value="search" onChange={() => {}} />
          </div>
        </div>
        {/* Header Section */}
        <div className={style.header}>
          <FormControl className={style.dropdown}>
            <SelectDropdown
              title="Compliance Type"
              options={[
                { value: "PCIDSS", label: "PCI DSS" },
                { value: "ISO27001", label: "ISO 27001" },
                { value: "SOC2", label: "SOC 2" },
                { value: "HIPAA", label: "HIPAA" },
                { value: "GDPR", label: "GDPR" },
              ]}
              value={complianceType}
              onChange={handleQstnrChange}
            />
          </FormControl>

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
        {scopingDataArray.map((qstnr: scopingQSTRNR) => {
          const progress = calculateProgress(qstnr);
          const progressStyle = getProgressBarStyle(progress);
          
          // Debug logging
          console.log(`Questionnaire: ${qstnr.title}, Progress: ${progress}%, Questions: ${qstnr.questions?.length || 0}`);
          
          return (
            <Card key={qstnr.id} className={style.questionnaireCard}>
              <CardContent className={style.cardContentWrapper}>
                <Typography className={style.titleText}>{qstnr.title}</Typography>
                <div className={style.assignmentSection}>
                  <Typography className={style.assignmentInfo}>
                    Assigned On:{" "}
                    {qstnr.createDtTime
                      ? new Date(qstnr.createDtTime).toLocaleDateString()
                      : "N/A"}
                  </Typography>

                  <Box className={style.progressSection}>
                    <Box className={style.progressBarWrapper}>
                      <Box className={style.progressBar}>
                        <Box 
                          className={style.progressFill}
                          style={progressStyle}
                        ></Box>
                      </Box>
                      <Typography className={style.percentageText}>
                        {progress}%
                      </Typography>
                    </Box>

                    {hasGaps(qstnr) ? (
                      <PrimaryButton
                        children="View Gaps"
                        onClick={() => handleViewGaps(qstnr)}
                        className={style.viewGapsButton}
                      />
                    ) : progress === 100 ? (
                      <PrimaryButton
                        children="Review"
                        onClick={() => handleViewQSTNR(qstnr)}
                      />
                    ) : progress > 0 ? (
                      <PrimaryButton
                        children="Continue"
                        onClick={() => handleViewQSTNR(qstnr)}
                      />
                    ) : (
                      <PrimaryButton
                        children="Begin"
                        onClick={() => handleViewQSTNR(qstnr)}
                      />
                    )}
                  </Box>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default AEPocQstnr;
