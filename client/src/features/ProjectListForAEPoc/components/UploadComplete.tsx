import { FileCheck2 } from "lucide-react";
import styles from ".././styles/AssuranceReport.module.css";


interface UploadCompleteProps {
  file: File;
}

const UploadComplete: React.FC<UploadCompleteProps> = ({ file }) => (
  <div className={styles.uploadComplete}>
    {/* <img
      src="../public/Uploaded.svg"
      alt="upload complete icon"
      className={styles.uploadedIcon}
    /> */}
    <FileCheck2 size={"40"} color="#dc3545" />
    <p className={styles.completeText}>Upload Complete</p>
    <p className={styles.completeSubText}>{file.name}</p>
  </div>
);

export default UploadComplete;