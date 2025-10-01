import { Box, Modal } from '@mui/material'
import PrimaryButton from '../../../common/ui/PrimaryButton'
import CloseIcon from "@mui/icons-material/Close";
import styles from "./LogOut.module.css"

interface LogOutProps {
    open: boolean
    onClose: () => void
    onLogout: () => void
}

function LogOut({ open, onClose, onLogout }: LogOutProps) {
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...styles, width: 400 }} className={styles.modalContainer}>
          <p className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </p>
          <p className={styles.modalDescription}>
            Are you sure you want to Logout?
          </p>
          <div className={styles.modalButtonContainer}>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <PrimaryButton className={styles.logoutButton} onClick={onLogout}>
              Logout
            </PrimaryButton>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default LogOut
