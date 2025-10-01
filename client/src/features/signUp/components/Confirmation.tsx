import Correct from "../../../common/assets/correct.png";
import styles from "../styles/Confirmation.module.css";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


interface ConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function Confirmation({ open, onClose, onConfirm }: ConfirmationProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title">
      <Box className={styles.mainContainer}>
        <div className={`${styles.card} ${styles.textCenter}`}>
          <div className={styles.cardBody}>
            <button
              type="button"
              className={styles.btnClose}
              aria-label="Close"
              onClick={onClose}
            >
              <CloseIcon />
            </button>
            <img src={Correct} alt="Success" className={styles.correct} />
            <h5 className={styles.cardTitle}>YOUR PART IS DONE.</h5>
            <p className={styles.cardText}>
              Your security is our utmost priority. Once we have verified your
              details, <br />
              we will approve your account. It can take up to 3 working days.
            </p>
            <PrimaryButton
              children={"Got it"}
              onClick={onConfirm}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default Confirmation;
