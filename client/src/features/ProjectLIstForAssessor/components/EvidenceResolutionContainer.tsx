import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useAssessor, { ReviseQstnObject } from "../useAssessor";
import EvidenceResolution from "./EvidenceResolution";
import { Typography } from "@mui/material";
import { useEvidenceUpload } from "../../AuditProjectFlow/phases/Assessment/components/useEvidenceUpload";

const EvidenceResolutionContainer = () => {
  const { 
    getGapWithMatchingQuestion, 
    handleSubmitResolution, 
    handlePreviewEvidence,
    loginUser 
  } = useAssessor();
const {handleUpload} = useEvidenceUpload();
  const selectedReviseQstnId = useSelector(
    (state: RootState) => state.projectManagement.selectedReviseQstnId
  );
  const reviseQstnObject = useSelector(
    (state: RootState) => state.gapsRemediation.reviseQstnObject
  ) as ReviseQstnObject;

  const filteredData = getGapWithMatchingQuestion(
    reviseQstnObject,
    selectedReviseQstnId
  );

  if (!filteredData?.gap || !filteredData?.question) {
    return (
      <Typography>No data available for the selected question.</Typography>
    );
  }

  const handleSubmitResolutionWrapper = async (resolution: string) => {
    await handleSubmitResolution(resolution, selectedReviseQstnId, reviseQstnObject);
  };

  return (
    <EvidenceResolution
      question={filteredData.question}
      gap={filteredData.gap}
      reviseQstnObject={reviseQstnObject}
      onPreviewEvidence={handlePreviewEvidence}
      onSubmitResolution={handleSubmitResolutionWrapper}
      loginUserName={loginUser?.name || "Unknown User"}
      handleUpload={handleUpload}
    />
  );
};

export default EvidenceResolutionContainer; 