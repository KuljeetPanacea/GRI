import React, { useEffect } from "react";
import styles from "./Styles/PendingEvidences.module.css";
import { useSelector } from "react-redux";
import { selectAssessmentId } from "../../../redux/assessmentSlice";
import { gapEvidence } from "../../../api/project";
import useAssessor, { Question, UploadedFile } from "../useAssessor";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteIcon from "@mui/icons-material/Delete";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import ThankYouPage from "../../../common/component/ThankYouPage";

const PendingEvidences: React.FC = () => {
  const assessmentId = useSelector(selectAssessmentId);
  const {
    axiosInstance,
    handleSubmit,
    questions,
    setQuestions,
    uploadedFiles,
    setUploadedFiles,
    dragStates,
    setDragStates,
    isSubmitDisabled,
    setIsSubmitDisabled,
    submitted,
    inputRefs,
    handleFileSelect,
    handleFileRemove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    formatFileSize,
  } = useAssessor();

  useEffect(() => {
    const fetchGapEvidence = async () => {
      const data: Question[] = await gapEvidence(axiosInstance, assessmentId);

      const initialFilesState: Record<string, UploadedFile[]> = {};
      const initialDragState: Record<string, boolean> = {};
      const refs: Record<string, HTMLInputElement | null> = {};

      data.forEach((q) => {
        initialFilesState[q._id] = [];
        initialDragState[q._id] = false;
        refs[q._id] = null;
      });

      setQuestions(data);
      setUploadedFiles(initialFilesState);
      setDragStates(initialDragState);
      inputRefs.current = refs;
    };

    fetchGapEvidence();
  }, [assessmentId, axiosInstance]);

  useEffect(() => {
    const allUploaded = questions.every(
      (q) => uploadedFiles[q._id]?.length > 0
    );
    setIsSubmitDisabled(!allUploaded);
  }, [uploadedFiles, questions]);

  return (
    <>
      {submitted ? (
        <ThankYouPage />
      ) : (
        <div className={styles.container}>
          <h3 className={styles.title}>
            Upload evidence for the following questions:
          </h3>
          <p className={styles.subtitle}>
            Supported formats include JPG and PNG, with a maximum file size of
            2MB for each evidence.
          </p>

          {questions.length > 0 ? (
            <div className={styles.evidenceGrid}>
              {questions.map((question, index) => (
                <div key={question._id} className={styles.evidenceCard}>
                  <p className={styles.questionText}>
                    <strong>{index + 1}.</strong> {question.text}
                  </p>
                  <p className={styles.description}>{question.subControl}</p>

                  <div
                    className={`${styles.uploadArea} ${
                      dragStates[question._id] ? styles.uploadAreaHover : ""
                    }`}
                    onDragOver={(e) => handleDragOver(e, question._id)}
                    onDragLeave={(e) => handleDragLeave(e, question._id)}
                    onDrop={(e) => handleDrop(e, question._id)}
                    onClick={() =>
                      document
                        .getElementById(`file-input-${question._id}`)
                        ?.click()
                    }
                  >
                    <div className={styles.uploadIcon}>☁️</div>
                    <p className={styles.uploadText}>
                      Drag and drop files here or
                    </p>
                    <button
                      className={styles.browseButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        document
                          .getElementById(`file-input-${question._id}`)
                          ?.click();
                      }}
                    >
                      📁 Browse Gallery
                    </button>
                  </div>

                  <input
                    type="file"
                    id={`file-input-${question._id}`}
                    multiple
                    accept=".jpg,.jpeg,.png"
                    ref={(el) => (inputRefs.current[question._id] = el)}
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleFileSelect(question._id, e.target.files)
                    }
                  />

                  {uploadedFiles[question._id]?.length > 0 && (
                    <div className={styles.uploadedFiles}>
                      {uploadedFiles[question._id].map((file) => (
                        <div key={file.id} className={styles.uploadedFile}>
                          <div className={styles.fileInfo}>
                            <div className={styles.fileIcon}>
                              <AttachmentIcon />
                            </div>
                            <div>
                              <div className={styles.fileName}>{file.name}</div>
                              <div className={styles.fileDate}>
                                Uploaded on: {file.date}{" "}
                                {file.size && `• ${formatFileSize(file.size)}`}
                              </div>
                            </div>
                          </div>
                          <button
                            className={styles.deleteButton}
                            onClick={() =>
                              handleFileRemove(question._id, file.id)
                            }
                            title="Delete file"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          <PrimaryButton
            children="Submit"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          />
        </div>
      )}
    </>
  );
};

export default PendingEvidences;
