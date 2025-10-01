import { Box, Modal, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './DeleteProjectModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import PrimaryButton from '../../../common/ui/PrimaryButton';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import {deleteProjectThunk, fetchProjects, resetDeleteStatus, selectDeleteStatus, selectPaginationState } from '../../../redux/projectManagementSlice';
import useAxios from '../../../api/useAxios';
import { useSelector } from 'react-redux';

interface DeleteProjectModalProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
    onDelete?: (projectId: string) => void;
    showSnackbar?: (msg: string, severity?: 'success' | 'error') => void;
}

const DeleteProjectModal = ({ open, onClose, projectId, onDelete, showSnackbar }: DeleteProjectModalProps) => {
     const dispatch = useAppDispatch();
    const { status, error } = useAppSelector(selectDeleteStatus);
    const [showError, setShowError] = useState(false);

    // Reset delete status when component unmounts or modal closes
    useEffect(() => {
        if (!open) {
            dispatch(resetDeleteStatus());
            setShowError(false);
        }
    }, [open, dispatch]);

    // Handle successful deletion
    useEffect(() => {
        if (status === 'succeeded' && open) {
            // Call the onDelete callback if provided
            if (onDelete) {
                onDelete(projectId);
            }
            onClose();
        }
    }, [status, open, onClose, onDelete, projectId]);

    const axiosInstance = useAxios();
    const { currentPage, rowsPerPage } = useSelector(selectPaginationState);

       const handleDelete = async () => {
        if (projectId) {
            try {
                const resultAction = await dispatch(deleteProjectThunk({ axiosInstance, projectId }));
                console.log(resultAction.payload);
                if (deleteProjectThunk.fulfilled.match(resultAction)) {
                    dispatch(fetchProjects({ axiosInstance, page: currentPage, limit: rowsPerPage }));
                    if (showSnackbar) showSnackbar('Project deleted successfully', 'success');
                } else if (deleteProjectThunk.rejected.match(resultAction)) {
                    setShowError(true);
                    if (showSnackbar) showSnackbar(String(resultAction.payload), 'error');
                    onClose();
                }
            } catch (err) {
                console.error('Failed to delete project:', err);
                setShowError(true);
                if (showSnackbar) showSnackbar('Failed to delete project', 'error');
            }
        }
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={status !== 'loading' ? onClose : undefined}
                aria-labelledby="delete-project-modal-title"
                aria-describedby="delete-project-modal-description"
            >
                <Box sx={{ ...styles, width: 400 }} className={styles.modalContainer}>
                    <p className={styles.closeButton} onClick={status !== 'loading' ? onClose : undefined}>
                        <CloseIcon />
                    </p>
                    <p className={styles.modalDescription}>
                        Are you sure you want to delete this project?
                    </p>
                    
                    {/* Show error message if deletion failed */}
                    {showError && error && (
                        <div className={styles.errorMessage || 'error-message'}>
                            {error}
                        </div>
                    )}
                    
                    <div className={styles.modalButtonContainer}>
                        <button 
                            onClick={onClose} 
                            className={styles.cancelButton}
                            disabled={status === 'loading'}
                        >
                            Cancel
                        </button>
                        <PrimaryButton 
                            className={styles.deleteButton}
                            onClick={handleDelete}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? (
                                <>
                                    <CircularProgress size={16} color="inherit" style={{ marginRight: '8px' }} />
                                    Deleting...
                                </>
                            ) : 'Delete'}
                        </PrimaryButton>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default DeleteProjectModal;