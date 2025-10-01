import style from "./AssessmentComponents.module.css";
import { Box, Button, Typography } from "@mui/material";
import Evidence from "./Evidence";
import useExpandPanel from "../useExpandPanel";
import QuestionNavigator from "./QuestionNavigator";
import EnhancedTable from "../../../../../common/ui/EnhancedTable";
import { gapEvidenceColumns } from "./EvidenceColumns";
import GapDescriptionModal from "./gapModel";
import PrimaryButton from "../../../../../common/ui/PrimaryButton";
import { useGapEvidenceOptions } from "./useGapEvidenceOptions";

const ExpandablePanel = () => {
  const { selectedButton, isExpanded, handleButtonSelect,assessmentQuestions,modalOpen, 
    gapRows,
    gapText,
    setGapText,
    handleSave,
    handleOnChangeStatus
    ,handleOnChange,
    handleDeleteGap,
    handleAddGap,
    handleAddDescription,
    setModalOpen,
    newEvidenceOptions,
    oldEvidenceOptions,
    handleModalSave } = useExpandPanel();
  const {
    statusOptions,
    fetchEvidenceOptions
  } = useGapEvidenceOptions();
  
  
  const renderContent = () => {
    switch (selectedButton) {
      case "Evidence":
        return (
          <Box>
            <Evidence />
          </Box>
        );
      
      case "All assessment Questions":
        return (
          <Box>
          {assessmentQuestions?.length > 0 ? (
            <QuestionNavigator assessmentQuestions={assessmentQuestions}/>
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No questions available.
            </Typography>
          )}
        </Box>
        );
        case "Identified gaps":
          
        return (
          <Box>
            <GapDescriptionModal
            open={modalOpen}
            description={gapText}
            onChange={setGapText}
            onClose={() => setModalOpen(false)}
            onSave={handleModalSave}
          />
            <EnhancedTable
              columns={gapEvidenceColumns(
                handleDeleteGap,
                handleAddDescription,
                handleOnChange,
                handleOnChangeStatus,
                newEvidenceOptions,
                oldEvidenceOptions,
                statusOptions
              )}
              data={gapRows}
              onRowClick={(row) => console.log("Row clicked:", row)}
              idField="id"
            />


            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginTop={2}
            >
              <button
                className={style.addDeviceButton}
                onClick={handleAddGap}
              >
                + Add gap
              </button>
              
              <PrimaryButton onClick={handleSave}>
                Save
              </PrimaryButton>
            </Box>

          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <div className={isExpanded ? style.expandablePanel : style.collapsedPanel}
    >
      <div className={style.panelHeader}>
        <Button
          variant="outlined"
          className={`${style.button} ${
            selectedButton === "Evidence" ? style.active : ""
          }`}
          onClick={() => handleButtonSelect("Evidence")}
        >
          Evidence
        </Button>
        <Button
          className={`${style.button} ${
            selectedButton === "Identified gaps" ? style.active : ""
          }`}
          onClick={async () => {
            handleButtonSelect("Identified gaps");
            await fetchEvidenceOptions();
          }}
        >
          Identified gaps
        </Button>
       
        <Button
          className={`${style.button} ${
            selectedButton === "All assessment Questions" ? style.active : ""
          }`}
          onClick={() => handleButtonSelect("All assessment Questions")}
        >
          All assessment Questions
        </Button>
      </div>
      <div className={style.panelContent}>{renderContent()}</div>
    </div>
  );
};

export default ExpandablePanel;
