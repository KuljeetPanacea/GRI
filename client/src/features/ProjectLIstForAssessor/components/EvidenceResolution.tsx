import styles from "./Styles/EvidenceResolution.module.css";
import {
  Alert,
  Typography,
  Button,
  TextField,
  Box,
  Paper,
} from "@mui/material";
import { UploadCloud, FileText } from "lucide-react";
import useAssessor, { Evidence, EvidenceResolutionProps } from "../useAssessor";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import { ArrowLeft } from 'lucide-react';
const EvidenceResolution: React.FC<EvidenceResolutionProps> = ({
  question,
  gap,
  onPreviewEvidence,
  onSubmitResolution,
  loginUserName,
}) => {
  const {
    handleSave,
    resolution,
    setResolution,
    selectedFile,
    handleFileChange,
    isUploading,
    fileInputRef,
    handleBoxClick,
    navigate  
  } = useAssessor();

  const handleSubmitResolution = async () => {
    if (!resolution.trim()) {
      console.warn("Resolution comment is required");
      return;
    }
    try {
      await onSubmitResolution(resolution);
      setResolution("");
    } catch (error) {
      console.error("Failed to submit resolution:", error);
    }
  };
 
  return (
    <>
    <Typography variant="h3" className={styles.myRemediation} onClick={() => navigate("/landing/AsssessorRevise")}>
      <ArrowLeft /> Back
      </Typography>
     <Typography variant="h3" fontWeight="bold" className={styles.questionTitle}>
        {question?.text}
      </Typography>
    <Box className={styles.container}>
      <Typography variant="h3" fontWeight="bold" >
        Gaps Details
      </Typography>

      {/* Gap Details */}
      <Alert severity="error" className={styles.alertBox}>
        <Typography variant="subtitle2" fontWeight="bold">
          Evidence Insufficient
        </Typography>
        <Typography variant="body2">{gap.gapDesc}</Typography>
      </Alert>

      {/* Previously Uploaded Evidence */}
      <Paper className={styles.section}>
        <Typography variant="subtitle1" fontWeight="medium">
          Previously Uploaded Evidence
        </Typography>
        {(gap.oldEvidence || []).map((ev: Evidence, idx: number) => (
          <Box className={styles.fileRow} key={idx}>
            <FileText size={20} className={styles.icon} />
            <Box className={styles.fileInfo}>
              <Typography>{ev.name}</Typography>
              <Typography variant="caption" color="error">
                Rejected
              </Typography>
            </Box>
            <Box className={styles.actionButtons}>
              <Button size="small" onClick={() => onPreviewEvidence(ev.name)}>
                Preview
              </Button>
            </Box>
          </Box>
        ))}
      </Paper>

      {/* Revise Evidence Upload */}
      <Paper className={styles.section}>
        <Typography variant="subtitle1" fontWeight="medium">
          Revise Evidence
        </Typography>
        <Box className={styles.uploadBox} onClick={handleBoxClick}>
          <UploadCloud size={36} className={styles.uploadIcon} />
          <Typography variant="body2">
            Drop files here or click to upload
          </Typography>
          <Typography variant="caption">JPG, PNG (max 2MB)</Typography>
        </Box>

        {/* Show selected file name */}
        {selectedFile && (
          <Box className={styles.fileRow} style={{ marginTop: "16px" }}>
            <FileText size={20} className={styles.icon} />
            <Box className={styles.fileInfo}>
              <Typography>{selectedFile.name}</Typography>
              <Typography variant="caption" color="primary">
                Ready to upload
              </Typography>
            </Box>
          </Box>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/jpeg,image/png"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Paper>

      {/* Resolution Comment */}
      <Paper className={styles.section}>
        <Typography variant="subtitle1" fontWeight="medium">
          Resolution Comment
        </Typography>
        <Box className={styles.commentBox}>
          <Typography variant="body2" className={styles.userLabel}>
            {loginUserName} • You
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={resolution}
            placeholder="Provide justification for the evidence and explain how this addresses the identified gap..."
            onChange={(e) => setResolution(e.target.value)}
          />
        </Box>
        <Box textAlign="right" marginTop={1}>
          <Button
            variant="contained"
            onClick={handleSubmitResolution}
            disabled={!resolution.trim()}
          >
            Submit Resolution
          </Button>
        </Box>
      </Paper>

      <PrimaryButton
        children="Save"
        onClick={handleSave}
        disabled={!selectedFile || isUploading}
      />
    </Box>
    </>
  );
};

export default EvidenceResolution;
