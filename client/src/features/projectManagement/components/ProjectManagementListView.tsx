import { useEffect } from "react";
import useProjectManagementTable from "../hooks/useProjectManagementTable";
import {
  deleteProject,
  fetchProjects,
} from "../../../redux/projectManagementSlice";
import { IconButton } from "@mui/material";
import { AccountBalance, Delete, Edit } from "@mui/icons-material";
import EnhancedTable from "../../../common/ui/EnhancedTable";
import Pagination from "../../../common/ui/Pagination";
import { closeDeleteModal } from "../../../redux/DeleteProjectModalSlice";
import DeleteProjectModal from "./DeleteProjectModal";
import styles from "../ProjectManagement.module.css";
import { Project } from "../../../redux/projectManagementSlice";
import { NavLink } from "react-router-dom";
import { AlertColor } from '@mui/material/Alert';
import { RootState, useAppSelector } from "../../../redux/store";

const ProjectManagementListView: React.FC<{ showSnackbar: (msg: string, severity?: AlertColor) => void }> = ({ showSnackbar }) => {
   const {
    projects,
    currentPage,
    totalCount,
    totalPages,
    rowsPerPage,
    isDeleteModalOpen,
    selectedProjectId,
    handleDeleteProject,
    dispatch,
    axiosInstance,
    handleEditProjectFromTable,
    handlePageChange,
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

  const columns = [
    {
      key: "projectName",
      header: "Name",
      render: (_: number, row: Project) => (
        <div className={styles.name}>
          <AccountBalance /> {row.projectName}
        </div>
      ),
    },
    { key: "currentAuditStage", header: "Project Stage" },
    {
      key: "QSA",
      header: "QSA",
      render: (_: number, row: Project) => (
        <div className={styles.name}>{row.assignedTo?.find((entity) => entity.role === "QSA")?.name}</div>
      ),
    },
    {
      key: "qsaAssignedDate",
      header: "QSA Assigned date",
      render: (_: number, row: Project) => (
        <div className={styles.name}>
          {row.createDtTime
            ? new Date (row.createDtTime).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            : ""}
        </div>
      ),
    },
    {
      key: "updateDtTime",
      header: "Last Updated",
      render: (_: number, row: Project) => (
        <div className={styles.name}>
          {row.updateDtTime ? new Date (row.updateDtTime).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }) : ""}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_: number, row: Project) => (
        <div
          className={
            row.status === "Inactive"
              ? styles.inactiveStatus
              : styles.activeStatus
          }
        >
          {row.status}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: number, row: Project) => (
        <>
          <IconButton
             onClick={() => handleEditProjectFromTable(row)}
          >
            <NavLink to={`/landing/createNewProject`}>
              <Edit className={styles.tableIcon} />
            </NavLink>
          </IconButton>
          <IconButton onClick={() => handleDeleteProject(row._id || "")}>
            <Delete className={styles.tableIcon} />
          </IconButton>
        </>
      ),
    },
  ];



  return (
    <div className={styles.listViewContainer}>
      <EnhancedTable
        columns={columns}
        data={projects}
        showCheckbox={false}
        idField="projectId"
      />
      <div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={rowsPerPage}
        totalItems={totalCount}
        onPageChange={handlePageChange}
        />
        </div>

      <DeleteProjectModal
        open={isDeleteModalOpen}
        onClose={() => dispatch(closeDeleteModal())}
        projectId={selectedProjectId ?? ""}
        showSnackbar={showSnackbar}
        onDelete={() => {
          if (selectedProjectId) {
            dispatch(deleteProject(selectedProjectId));
            dispatch(closeDeleteModal());
          }
        }}
      />
    </div>
  );
};

export default ProjectManagementListView;
