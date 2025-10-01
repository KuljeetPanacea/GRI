import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import EnhancedTable from "../../../common/ui/EnhancedTable";
import { AccountBalance, Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Pagination from "../../../common/ui/Pagination";
import useClientManagementTable from "../hooks/useClientManagementTable";
import DeleteClientModal from "./DeleteClientModal";
import style from "../styles/ClientManagement.module.css";
import { Client } from "../../../redux/clientManagementSlice";
import FeedbackSnackbar from "../../../common/ui/FeedbackSnackbar";
import useClientManagement from "../useClientManagement";

const ClientManagementListView: React.FC = () => {
  const {
    totalPages,
    totalCount,
    currentPage,
    rowsPerPage,
    filteredClientData,
    loading,
    error,
    handleEditClient,
    handleDeleteClient,
    handleCloseDeleteModal,
    handlePageChange,
    isDeleteModalOpen,
    selectedClientId,
    loadClients, industry, industrySize, status  ,onboarding,search
  } = useClientManagementTable();
  
  // Get handleSnackbarClose from our hook, but get the snackbar state directly from Redux
  const { handleSnackbarClose } = useClientManagement();
  
  // Get snackbar state directly from Redux store
  const snackbar = useSelector((state: RootState) => state.clientManagement.snackbar);
  
  
  useEffect(() => {
    loadClients();
  }, [industry, industrySize, status,currentPage,onboarding,search]);
  
  if (loading) return <div>Loading clients...</div>;
  if (error) return <div>Error loading clients: {error}</div>;
  
  const columns = [
    // ...your columns definition remains the same
    {
      key: "clientName",
      header: "Client Name",
      render: (_: number, row: Client) => (
        <div className={style.name}>
          <AccountBalance /> {row.clientName}
        </div>
      ),
    },
    {
      key: "onboardDate",
      header: "Onboarding date",
      render: (_: number, row: Client) => (
        <div className={style.name}>
          {new Date(row.createDtTime).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
        </div>
      ),
    },
    {
      key: "lastUpdated",
      header: "Last updated",
      render: (_: number, row: Client) => (
        <div className={style.name}>
          {row.updateDtTime
            ? new Date(row.updateDtTime).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            : new Date(row.createDtTime).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
        </div>
      ),
    },
    {
      key: "clientPOC",
      header: "Client POC",
      render: (_: number, row: Client) => (
        <div className={style.name}>{row.pocName}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_: number, row: Client) => (
        <div
          className={
            row.status === "Inactive"
              ? style.inactiveStatus
              : style.activeStatus
          }
        >
          {row.status === "Inactive" ? "Inactive" : "Active"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: number, row: Client) => (
        <>
          <IconButton onClick={() => row && handleEditClient(row)}>
            <Edit className={style.tableIcon} />
          </IconButton>
          <IconButton
            onClick={() => row.clientId && handleDeleteClient(row.clientId)}
          >
            <Delete className={style.tableIcon} />
          </IconButton>
        </>
      ),
    },
  ];
  
  return (
    <div className={style.listView}>
      <EnhancedTable
        columns={columns}
        data={filteredClientData}
        showCheckbox={false}
        idField="clientId"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={rowsPerPage}
        totalItems={totalCount}
        onPageChange={handlePageChange}
      />
      <DeleteClientModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        clientId={selectedClientId ?? ""}
        onDelete={handleCloseDeleteModal}
      />
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </div>
  );
};

export default ClientManagementListView;