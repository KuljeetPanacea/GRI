import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../../redux/store";
import { Project, selectFilteredProjects, selectPaginationState, setCurrentPage, setEditingProject } from "../../../redux/projectManagementSlice";
import { useState } from "react";
import { openDeleteModal } from "../../../redux/DeleteProjectModalSlice";
import useAxios from "../../../api/useAxios";
import { setFormType, setProjectId, setStep, updateFormField, updateSelectedClient } from "../../../redux/createNewProjectSlice";

export const useProjectManagementTable = () => {
    const axiosInstance = useAxios();
    const dispatch = useDispatch<AppDispatch>();
    const filteredProjects = useSelector(selectFilteredProjects);
    const rowsPerPage = useSelector((state: RootState) => state.projectManagement.rowsPerPage);
    const [selectedProject, setSelectedProject] = useState<Project>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isDeleteModalOpen = useSelector(
        (state: RootState) => state.projectDeleteModal.isDeleteModalOpen
    );
    const loading = useSelector(
        (state: RootState) => state.projectManagement.loading
    );
    const error = useSelector(
        (state: RootState) => state.projectManagement.error
    );
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");

      const {currentPage, totalPages, totalCount} = useAppSelector(selectPaginationState)
   

    const handleMenuOpen = (
        event: React.MouseEvent<HTMLElement>,
        project: Project
    ) => {
        setAnchorEl(event.currentTarget);
        setSelectedProject(project);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProject({} as Project);
    };

    const handleEditProjectFromTable = (project: Project) => {
      dispatch(setStep(0));
      dispatch(setFormType("edit"));
        dispatch(setEditingProject(project));
        dispatch(setProjectId(project._id || ""));

        // Set up the form fields based on the project
        dispatch(updateFormField({
            field: "projectName",
            value: project.projectName,
        }));
        dispatch(updateFormField({
            field: "description",
            value: project.description,
        }));
        dispatch(updateFormField({
            field:'scopingQSTRNR',
            value: project.scopingQSTRNR,
        }))

        // If client info exists, update client-related fields
        if (project.clientInfo) {
            dispatch(updateFormField({
                field: "client",
                value: project.clientInfo.clientId || "",
            }));
            dispatch(updateSelectedClient({
                clientId: project.clientInfo.clientId || "",
                clientName: project.clientInfo.clientName || "",
                clientDBA: project.clientInfo?.businessName || "",
                clientEmailAddress: project.clientInfo?.pocEmailId || "",
                clientContactNumber: project.clientInfo?.pocContactNumber || "",
                clientPocName: project.clientInfo?.pocName || "",
                clientWebsiteLink: project.clientInfo?.websiteLink || "",
                leadershipContactNo: project.clientInfo?.leadershipContactNo || "",
                leadershipEmailId: project.clientInfo?.leadershipEmailId || "",
                leadershipName: project.clientInfo?.leadershipName || "",

            }));
        }

        // Update audit entity if exists
        if (project.auditEntity) {
            dispatch(updateFormField({
                field: "auditEntity",
                value: project.auditEntity,
            }));
        }

        // Handle QSA and QA info if they exist
        if (project.assignedTo && project.assignedTo.length > 0) {
            dispatch(updateFormField({
                field: "assignedTo",
                value: project.assignedTo,
            }));
        }

        // Close the menu after selecting the edit option
        handleMenuClose();
    };

    const handleDeleteProject = (projectId: string) => {
        setSelectedProjectId(projectId);
        dispatch(openDeleteModal(true));
    };

      const handlePageChange = (newPage: number) => {
          const validPage = Math.max(1, Math.min(newPage, totalPages));
          if (validPage !== currentPage) {
            dispatch(setCurrentPage(validPage));
          }
        };
        

    return {
        projects: filteredProjects,
        loading,
        anchorEl,
        handleMenuOpen,
        handleMenuClose,
        error,
        selectedProject,
        setSelectedProject,
        dispatch,
        axiosInstance,
        totalPages,
        currentPage,
        totalCount,
        rowsPerPage,
        isDeleteModalOpen,
        handleDeleteProject,
        selectedProjectId,
        setSelectedProjectId,
        handleEditProjectFromTable,
        handlePageChange
    };
};

export default useProjectManagementTable;
