import { useEffect } from "react";
import {
  deleteProject,
  fetchProjects,
} from "../../../redux/projectManagementSlice";
import { closeDeleteModal } from "../../../redux/DeleteProjectModalSlice";
import {
  Box,
  Card,
  CardActions,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import DeleteProjectModal from "./DeleteProjectModal";
import { Edit, Delete, AccountBalance, MoreHoriz } from "@mui/icons-material";
import styles from "./ProjectManagementGridView.module.css";
import useProjectManagementTable from "../hooks/useProjectManagementTable";
import { Project } from "../../../redux/projectManagementSlice";
import { AlertColor } from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { RootState, useAppSelector } from "../../../redux/store";
const ProjectManagementGridView: React.FC<{ showSnackbar: (msg: string, severity?: AlertColor) => void }> = ({ showSnackbar }) => {
   const {
    isDeleteModalOpen,
    projects,
    currentPage,
    axiosInstance,
    dispatch,
    error,
    loading,
    selectedProjectId,
    selectedProject,
    anchorEl,
    handleMenuClose,
    handleMenuOpen,
    handleDeleteProject,
    handleEditProjectFromTable,
  } = useProjectManagementTable();


 const {
    projectStatus,
    projectStage,
    ongoingProjects,
    qsa,
    search
  } = useAppSelector((state: RootState) => state.projectManagement);



 useEffect(() => {
    dispatch(fetchProjects({
      axiosInstance,
      page: currentPage,
      limit: 5,
      projectStatus,
      projectStage,
      ongoingProjects,
      qsa,
      search
    }));
  }, [dispatch, axiosInstance, currentPage, projectStatus, projectStage, ongoingProjects, qsa, search]);

  const navigate = useNavigate();
  

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  return (
    <Grid container spacing={2} sx={{ mt: 2 }} className={styles.gridContainer}>
      {projects.map((project: Project) => (
        <Grid item xs={12} sm={6} md={3} key={project._id}>
          <Card className={styles.gridCard}>
            <div className={styles.cardHeaderContainer}>
              <div className={styles.cardContentContainer}>
                <AccountBalance />
                <Typography variant="h2">{project.projectName}</Typography>
              </div>

              <Divider />
              <Box className={styles.data}>
                <Typography variant="body2">
                  QSA: {project.assignedTo?.find((entity) => entity.role === "QSA")?.name}
                </Typography>
              </Box>
              <Box className={styles.data}>
                <Typography variant="body2">
                  AE POC: {project.auditEntity?.pocName}
                </Typography>
              </Box>
              <Box className={styles.data}>
                <Typography variant="body2">
                  Last Updated:{" "}
                  {new Date(project.updateDtTime).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                </Typography>
              </Box>
            </div>
            <Divider />
            <CardActions className={styles.cardActions}>
              <div
                className={
                  project.status === "Inactive"
                    ? styles.inactiveStatusGrid
                    : styles.activeStatusGrid
                }
              >
                {project.status}
              </div>
              <IconButton onClick={(event) => handleMenuOpen(event, project)}>
                <MoreHoriz />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}

      

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
       <MenuItem
  onClick={() => {
    if (selectedProject) {
      handleEditProjectFromTable(selectedProject);
      navigate("/landing/createNewProject"); // <-- Add this line
    }
  }}
>
  <Edit fontSize="small" className={styles.menuIcon} /> Edit
</MenuItem>
        <MenuItem
          onClick={() =>
            selectedProject && handleDeleteProject(selectedProject._id || "")
          }
        >
          <Delete fontSize="small" className={styles.deleteIcon} /> Delete
        </MenuItem>
      </Menu>

      <DeleteProjectModal
        open={isDeleteModalOpen}
        onClose={() => dispatch(closeDeleteModal())}
        projectId={selectedProjectId}
        showSnackbar={showSnackbar}
        onDelete={() => {
          if (selectedProjectId) {
            dispatch(deleteProject(selectedProjectId));
            dispatch(closeDeleteModal());
          }
        }}
      />
    </Grid>
    
  );
};

export default ProjectManagementGridView;
