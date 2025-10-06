import React from "react";
import styles from "./AssuranceReport.module.css";
import LoadingSpinner from "./LoadingSpinner";
import UploadComplete from "./UploadComplete";
import {  FileText, FileUp } from "lucide-react";


interface UploadCardProps {
  title: string;
  type: "limited" | "reasonable";
  file: File | null;
  dragOverState: boolean;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onDrop: (e: React.DragEvent<HTMLDivElement>, type: "limited" | "reasonable") => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, type: "limited" | "reasonable") => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>, type: "limited" | "reasonable") => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>, type: "limited" | "reasonable") => void;
  onDownload: (file: File) => void;
  onView: (file: File) => void;
  completed: boolean;
}
const UploadCard: React.FC<UploadCardProps> = ({
  title,
  type,
  file,
  dragOverState,
  isLoading,
  fileInputRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileInputChange,
  onDownload,
  onView,
  completed,
}) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h3 className={styles.cardTitle}>{title}</h3>
    </div>
    <div className={styles.cardBody}>
      {isLoading ? (
        <div className={styles.loadingState}>
          <LoadingSpinner />
          <p className={styles.loadingText}>Processing file...</p>
          <p className={styles.loadingSubText}>
            Please wait while we upload and validate your document
          </p>
        </div>
      ) : completed ? (
        <UploadComplete file={file || ({ name: "File" } as File)} />
      ) : !file ? (
        <div
          className={`${styles.dropzone} ${dragOverState ? styles.dragOver : ""}`}
          onDragOver={(e) => onDragOver(e, type)}
          onDragLeave={(e) => onDragLeave(e, type)}
          onDrop={(e) => onDrop(e, type)}
          onClick={() => fileInputRef.current?.click()}
        >
          <div>
            <FileUp size={"40"} color="#dc3545" />
          </div>
          <p className={styles.initialText}>Drag and drop your file here</p>
          <p className={styles.initialSubText}>or click to browse files</p>
          <button className={styles.initialButton}>Choose File</button>
          <p className={styles.supportText}>
            Supported Formats : docx , pdf (Max 100MB)
          </p>
        </div>
      ) : (
        <div>
          <div
            className={`${styles.dropzone} ${dragOverState ? styles.dragOver : ""}`}
            onDragOver={(e) => onDragOver(e, type)}
            onDragLeave={(e) => onDragLeave(e, type)}
            onDrop={(e) => onDrop(e, type)}
            onClick={() => fileInputRef.current?.click()}
          >
            <div>
              <FileUp size={"40"} color="#dc3545" />
            </div>
            <p className={styles.initialText}>Upload new file</p>
            <p className={styles.initialSubText}>
              Drag and drop your file here
            </p>
            <button className={styles.initialButton}>Choose File</button>
            <p className={styles.supportText}>
              Supported Formats : docx , pdf (Max 100MB)
            </p>
          </div>

          <div className={styles.fileBottomBar}>
            <div className={styles.fileBottomInfo}>
              <div className={styles.fileBottomIcon}>
                {/* <img
                  src={
                    file.name.toLowerCase().endsWith(".pdf")
                      ? "../public/pdf.svg"
                      : file.name.toLowerCase().endsWith(".doc") ||
                        file.name.toLowerCase().endsWith(".docx")
                      ? "../public/word.svg"
                      : "/defaulticon.svg"
                  }
                  alt="File Icon"
                  width={28}
                  height={28}
                  className={styles.fileBottomIconSvg}
                /> */}
                <FileText size={"28"} color="#dc3545" />
              </div>
              <div className={styles.fileBottomDetails}>
                <p className={styles.fileBottomName}>{file.name}</p>
                <p className={styles.fileBottomDate}>
                  {new Date()
                    .toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\//g, "-")}
                </p>
              </div>
            </div>

            <div className={styles.fileBottomActions}>
              <button
                onClick={() => onDownload(file)}
                className={styles.fileBottomActionBtn}
                title="Download"
              >
                <svg
                  className={styles.fileBottomActionIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => onView(file)}
                className={styles.fileBottomActionBtn}
                title="View File"
              >
                <svg
                  className={styles.fileBottomActionIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        onChange={(e) => onFileInputChange(e, type)}
        className={styles.hiddenInput}
        disabled={isLoading}
      />
    </div>
  </div>
);

export default UploadCard;