import Box from "@mui/material/Box";
import styles from "./DeleteUserModel.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { Modal } from "@mui/material";

import PrimaryButton from "../../../common/ui/PrimaryButton";
import { useAppDispatch } from "../../../redux/store";
import useAxios from "../../../api/useAxios";
import { deleteUser } from "../../../redux/DeleteUserModalSlice";
import { showSnackbar } from "../../../redux/userManagementSlice";

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: string ;
  onDelete: (userId: number) => void;
  onDeleteSuccess?: () => void;
}

function DeleteUserModal({ open, onClose, userId,onDeleteSuccess }: DeleteUserModalProps) {
  const dispatch = useAppDispatch(); 
  const axiosInstance = useAxios();
  const handleDelete = () => {
    if (userId !== null) {
      dispatch(deleteUser({ userId, axiosInstance })).then((action) => {
        if (deleteUser.fulfilled.match(action)) {
          dispatch(
            showSnackbar({
              message: action.payload.message,
              severity: "success",
            })
          );
          onClose();
          if (onDeleteSuccess) onDeleteSuccess();
        } else {
          dispatch(
            showSnackbar({
              message: action.payload || "Reallocation of assignment is required before deletion.",
              severity: "error",
            })
          );
        }
      });
    }
  };
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
            Are you sure you want to delete this user?
          </p>
          <div className={styles.modalButtonContainer}>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <PrimaryButton className={styles.deleteButton} onClick={handleDelete}>
              Delete
            </PrimaryButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default DeleteUserModal;
