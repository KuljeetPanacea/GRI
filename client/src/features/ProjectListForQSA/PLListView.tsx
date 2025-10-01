import React, { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import EnhancedTable from "../../common/ui/EnhancedTable";
import Pagination from "../../common/ui/Pagination";
import useAxios from "../../api/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../redux/store";
import {
  fetchProjectById,
  Project,
  selectPaginationState,
  setCurrentPage,
} from "../../redux/projectManagementSlice";
import { setSelectedProject } from "../../redux/projectViewSlice";
import { setSelectedPhase } from "../../redux/phaseSlice";

const PLListView: React.FC = () => {
  const columns = [
    { key: "projectName", header: "Project Name" },
    {
      key: "company",
      header: "Company",
      render: (_: number, row: Project) => <p>{row.clientInfo?.clientName}</p>,
    },
    {
      key: "assignedDate",
      header: "Assigned Date",
      render: (_: number, row: Project) => (
        <p>{row.createDtTime?.split("T")[0]}</p>
      ),
    },
    { key: "status", header: "Status" },

    {
      key: "createdByName",
      header: "PMO",
      render: (_: number, row: Project) => (
        <Tooltip title={row.createdByEmail}>
          <p>{row.createdByName}</p>
        </Tooltip>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <Tooltip title="Comment">
          <IconButton size="small">
            <CommentIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
  const dispatch = useDispatch<AppDispatch>();
  const axiosInstance = useAxios();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const loginUser = useSelector((state: RootState) => state.login.user);
  const projects = useSelector(
    (state: RootState) => state.projectManagement.projects
  );

  const { totalPages, totalCount, currentPage } = useSelector(
    selectPaginationState
  );
  const { projectStatus, ongoingProjects, search } = useAppSelector(
    (state: RootState) => state.projectManagement
  );

  useEffect(() => {
    dispatch(
      fetchProjectById({
        axiosInstance,
        userId: loginUser?.id as string,
        role: loginUser?.roles as string[],
        page: currentPage as number,
        limit: 5,
        ongoingProjects,
        projectStatus,
        search,
      })
    );
  }, [
    dispatch,
    axiosInstance,
    currentPage,
    loginUser?.id,
    loginUser?.roles,
    ongoingProjects,
    projectStatus,
    search,
  ]);

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    console.log("validPage", currentPage, newPage);
    if (validPage !== currentPage) {
      dispatch(setCurrentPage(validPage));
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <EnhancedTable
        columns={columns}
        data={projects}
        showCheckbox={false}
        selectedRows={selectedRows}
        onRowSelect={setSelectedRows}
        idField="id"
        getRowLink={(row) => {
          dispatch(setSelectedProject(row));
          dispatch(setSelectedPhase(row.currentAuditStage));
          return "/landing/ProjectView";
        }}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={5}
        totalItems={totalCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PLListView;
