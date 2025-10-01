import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import styles from "./QstnrActionModal.module.css";

interface QstnrActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: "delete" | "duplicate";
}

const QstnrActionModal = ({ open, onClose, onConfirm, actionType }: QstnrActionModalProps) => {
  const actionText = actionType === "delete" ? "delete this questionnaire" : "duplicate this questionnaire";

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="qstnr-modal-title">
      <Box className={styles.modalContainer}>
        <p className={styles.closeButton} onClick={onClose}>
          <CloseIcon />
        </p>
        <p className={styles.modalDescription}>Are you sure you want to {actionText}?</p>
        <div className={styles.modalButtonContainer}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <PrimaryButton className={styles.confirmButton} onClick={onConfirm}>
            {actionType === "delete" ? "Delete" : "Duplicate"}
          </PrimaryButton>
        </div>
      </Box>
    </Modal>
  );
};

export default QstnrActionModal;
