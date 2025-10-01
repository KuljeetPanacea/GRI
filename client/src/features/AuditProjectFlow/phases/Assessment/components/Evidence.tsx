import React from "react";
import { Box, Typography } from "@mui/material";
import { useEvidenceUpload } from "./useEvidenceUpload";
import { useSelector } from "react-redux";
import { SelectedControlQuestions, selectCurrentQuestionIndex } from "../../../../../redux/assessmentSlice";
import styles from "./Evidence.module.css";
import styles1 from "../../DeviceIdentification/DeviceIdentificationView.module.css";

const Evidence: React.FC = () => {
  const assessmentQuestions = useSelector(SelectedControlQuestions);
  const currentQuestionIndex = useSelector(selectCurrentQuestionIndex);
  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  
  const {
    selectedDocument,
    documents,
    onFileChange,
    fileInputRef,
    fetchAndSetSignedUrlForDoc,
  } = useEvidenceUpload(currentQuestion?.qstnID);

  return (
    <div className={styles.container}>
      <Box className={styles.leftSection}>
        {documents.map((doc, index) => {
          const isSelected = selectedDocument?.name === doc.name;
          const displayName = doc.name.replace(/\.[^/.]+$/, "");

          return (
            <Box
              key={index}
              onClick={() => fetchAndSetSignedUrlForDoc(doc)}
              className={`${styles.documentRow} ${
                isSelected ? styles.selectedDocumentRow : ""
              }`}
            >
              <Typography sx={{ mr: 1 }}>{index + 1}.</Typography>
              <Typography>
                {displayName}
                <Typography component="span" className={styles.typeText}>
                  ({doc.type})
                </Typography>
              </Typography>
            </Box>
          );
        })}

        <Box mt={2}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <button
            className={styles1.addDeviceButton}
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
          >
            + Upload Document
          </button>
        </Box>
      </Box>

      <Box className={styles.rightSection}>
        <Box className={styles.previewBox}>
          {selectedDocument ? (
            selectedDocument.type === "application/pdf" ? (
              <iframe
                src={selectedDocument.url}
                className={styles.previewIframe}
                title="PDF Document"
              />
            ) : (
              <img
                src={selectedDocument.url}
                alt="Uploaded"
                className={styles.previewImage}
              />
            )
          ) : (
            <Box className={styles.emptyPreview}>No document selected</Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Evidence;
