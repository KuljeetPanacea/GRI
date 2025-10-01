import React, { useRef, useEffect, useState } from "react";
import { renderAsync } from "docx-preview";
import styles from ".././styles/AssuranceReport.module.css";


interface FileViewerProps {
  fileUrl: string; 
  fileName: string;
//   onClose: () => void;
 closeViewer: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, fileName, closeViewer  }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  const ext = fileName.split(".").pop()?.toLowerCase();

const isPDF = ext === "pdf";
const isWord = ext === "doc" || ext === "docx";

 console.log("file Name -->",isPDF, isWord)
  // Render Word Docs
  useEffect(() => {
    if (isWord && previewRef.current) {
      previewRef.current.innerHTML = "";
      fetch(fileUrl)
        .then((res) => res.blob())
        .then((blob) => renderAsync(blob, previewRef.current!))
        .catch((err) => console.error("Error rendering Word file:", err));
    }
  }, [fileUrl, isWord]);

  return (
    <div className={styles.fileViewerOverlay}>
      <div className={styles.fileViewerModal}>
        {/* Header */}
        <div className={styles.fileViewerHeader}>
          <div className={styles.fileViewerInfo}>
            <h3 className={styles.fileViewerTitle}>{fileName}</h3>
          </div>
          <button onClick={closeViewer} className={styles.fileViewerCloseBtn}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.fileViewerContent}>
          {isPDF ? (
            <iframe
              src={fileUrl}
              className={styles.fileViewerIframe}
              title="PDF Viewer"
            />
          ) : isWord ? (
            <div className={styles.wordPreviewWrapper}>
              <div
                ref={previewRef}
                style={{
                  overflow: "auto",
                  maxHeight: "70vh",
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
              ></div>
            </div>
          ) : (
            <div className={styles.fileViewerNoPreview}>
              <h3>Preview not available</h3>
              <a href={fileUrl} download={fileName}>
                Download File
              </a>
            </div>
          )}
        </div>

        {/* Zoom controls for Word */}
        {isWord && (
          <div className={styles.zoomControls}>
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className={styles.zoomBtn}
            >
              −
            </button>

            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className={styles.zoomSlider}
            />

            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              className={styles.zoomBtn}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
