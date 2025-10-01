// AssuranceReport.tsx
import React from "react";
import styles from ".././styles/AssuranceReport.module.css";
import useAssuranceReport from "../hooks/useAssuranceReport";
import ReplaceModal from "./ReplaceModal";
import UploadCard from "./UploadCard";
import FileViewer from "./FileViewer";


const AssuranceReport: React.FC = () => {
  const {
    completed,
    limitedAssuranceFile,
    reasonableAssuranceFile,
    loading,
    dragOver,
    viewingFile,
    viewingFileName,
    limitedFileInputRef,
    reasonableFileInputRef,
    replaceModal,
    handleDrop,
    handleFileInputChange,
    downloadFile,
    viewFile,
    closeViewer,
    confirmReplace,
    cancelReplace,
    setDragOver,
  } = useAssuranceReport();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, type: "limited" | "reasonable") => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, type: "limited" | "reasonable") => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Assurance Report</h1>
          <p className={styles.subtitle}>
            Independent Assurance of Disclosures
          </p>
        </div>

        <ReplaceModal
          isOpen={replaceModal.open}
          file={replaceModal.file}
          type={replaceModal.type}
          onCancel={cancelReplace}
          onConfirm={confirmReplace}
        />

        <div className={styles.grid}>
          <UploadCard
            title="Upload Limited Assurance"
            type="limited"
            file={limitedAssuranceFile}
            dragOverState={dragOver.limited}
            isLoading={loading.limited}
            fileInputRef={limitedFileInputRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onFileInputChange={handleFileInputChange}
            onDownload={(file) => downloadFile(file, "limited")}
            onView={(file) => viewFile(file, "limited")}
            completed={completed.limited}
          />
          <UploadCard
            title="Upload Reasonable Assurance"
            type="reasonable"
            file={reasonableAssuranceFile}
            dragOverState={dragOver.reasonable}
            isLoading={loading.reasonable}
            fileInputRef={reasonableFileInputRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onFileInputChange={handleFileInputChange}
            onDownload={(file) => downloadFile(file, "reasonable")}
            onView={(file) => viewFile(file, "reasonable")}
            completed={completed.reasonable}
          />
        </div>

        {viewingFile && (
          <FileViewer
            fileUrl={viewingFile}
            fileName={viewingFileName}
            closeViewer={closeViewer}
          />
        )}
      </div>
    </div>
  );
};

export default AssuranceReport;