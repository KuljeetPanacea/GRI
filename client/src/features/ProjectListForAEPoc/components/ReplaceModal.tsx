import { Replace } from "lucide-react";
import styles from ".././styles/AssuranceReport.module.css";
import { formatFileSize } from "../hooks/useAssuranceReport";

interface ReplaceModalProps {
  isOpen: boolean;
  file: File | null;
  type: "limited" | "reasonable" | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ReplaceModal: React.FC<ReplaceModalProps> = ({
  isOpen,
  file,
  type,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !file || !type) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onCancel}>
          &times;
        </button>

        <div className={styles.modalHeader}>
          {/* <img src="/danger.svg" alt="warning" className={styles.modalIcon} /> */}
          <Replace size={"40"} color="#dc3545" />
          <h3 className={styles.modalTitle}>Replace File?</h3>
        </div>

        <p className={styles.modalText}>
          Your previous file <strong>{file.name}</strong> (
          {formatFileSize(file.size)}) will be deleted and replaced with the
          new file.
        </p>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.replaceBtn} onClick={onConfirm}>
            Replace File
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplaceModal;