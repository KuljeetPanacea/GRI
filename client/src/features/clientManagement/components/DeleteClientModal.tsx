import Box from "@mui/material/Box";
import styles from "../styles/ClientManagement.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { Modal } from "@mui/material";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import { deleteClients } from "../../../api/client";
import useAxios from "../../../api/useAxios";
import { RootState, useAppDispatch, useAppSelector } from "../../../redux/store";
import { fetchClients, resetFilters } from "../../../redux/clientManagementSlice";
import useClientManagement from "../useClientManagement";

interface DeleteClientModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  onDelete: (clientId: number) => void;
}



function DeleteClientModal({
  open,
  onClose,
  clientId,
}: DeleteClientModalProps) {
  const axiosInstance = useAxios();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useClientManagement();
  const { currentPage,industrySize, status,industry,onboarding,search} = useAppSelector((state: RootState) => state.clientManagement);
  //  const {  industrySize } = useSelector((state: RootState) => state.clientManagement);
  
  const handleDelete = async () => {
    console.log("This is the clientId: ", clientId);
    if (clientId !== null) {
      try {
        await deleteClients(axiosInstance, clientId); 
        resetFilters();
        await dispatch(fetchClients({axiosInstance, page: currentPage, limit:5, filters: {onboarding, industry, industrySize, status,search}})); 
        showSnackbar("Client deleted successfully", "success");
        onClose(); 
        
      } catch (error) {
        console.error("Error deleting client:", error);
        showSnackbar("Error deleting client");
      }
    }
  };
 // Assuming you have this function in your hook
  
  
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
            Are you sure you want to delete this client?
          </p>
          <div className={styles.modalButtonContainer}>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <PrimaryButton
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              Delete
            </PrimaryButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default DeleteClientModal;
