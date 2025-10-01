// import React from 'react';
import styles from './ProjectManagement.module.css';
import useProjectManagement from './useProjectManagement';
import ProjectManagementHeader from './components/ProjectManagementHeader';
import ProjectFilter from './components/ProjectFilter';
import ProjectManagementListView from './components/ProjectManagementListView';
import ProjectManagementGridView from './components/ProjectManagementGridView';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';


const ProjectManagement = () => {
    const { viewMode } = useProjectManagement();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    const handleSnackbarClose = () => setSnackbarOpen(false);

    // Handler to show snackbar
    const showSnackbar = (message: string, severity: AlertColor = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    return (
        <div className={styles.mainContainer}>
            <ProjectManagementHeader />
            <div className={styles.bodyContainer}>
                <ProjectFilter />
                <div className={styles.scrollableArea}>
                    <div className={styles.gridContainer}></div>
                    {viewMode === 'list' ? (
                        <ProjectManagementListView showSnackbar={showSnackbar}/>
                    ) : (
                        <ProjectManagementGridView showSnackbar={showSnackbar} />
                    )}
                </div>
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
            
        </div>
    )
}
export default ProjectManagement;
