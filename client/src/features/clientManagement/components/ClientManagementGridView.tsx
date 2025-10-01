import {
  Box,
  Card,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
  Divider,
  
} from "@mui/material";
import { MoreHoriz, Edit, Delete } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import useClientManagementTable from "../hooks/useClientManagementTable";
import DeleteClientModal from "./DeleteClientModal";
import { Client } from "../../../redux/clientManagementSlice";
import style from "../styles/ClientManagement.module.css";
import FeedbackSnackbar from "../../../common/ui/FeedbackSnackbar";
import useClientManagement from "../useClientManagement";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Pagination from "../../../common/ui/Pagination";
import { useEffect } from "react";
const ClientManagementGridView = () => {
  const {
    filteredClientData,
    loading,
    error,
    anchorEl,
    selectedClient,
    selectedClientId,
    isDeleteModalOpen,
    handleMenuOpen,
    handleMenuClose,
    handleEditClient,
    handleDeleteClient,
    handleCloseDeleteModal,
    currentPage,
    totalPages,
    rowsPerPage,
    totalCount,
    handlePageChange,
    loadClients,
    industrySize,
    onboarding,search, industry
  } = useClientManagementTable();

    const { handleSnackbarClose } = useClientManagement();
    const snackbar = useSelector((state: RootState) => state.clientManagement.snackbar);
     useEffect(() => {
        loadClients();
      }, [industry, industrySize, status,currentPage,onboarding,search]);
      
  if (loading) {
    return (
      <Box className={style.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box className={style.errorContainer}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  return (

    <>
    <Grid container spacing={2} className={style.gridContainer}>
      {filteredClientData.map((client: Client) => (
        <Grid item xs={12} sm={6} md={3} key={client.clientId}>
          <Card className={style.gridCard}>
            <div className={style.cardHeaderContainer}>
              <div className={style.cardContentContainer}>
                <AccountBalanceIcon />
                <Typography variant="h2">{client.clientName}</Typography>
              </div>
              <Divider />
              <Box className={style.data}>
                <Typography variant="body1">
                  Client POC {client.pocName}
                </Typography>
              </Box>
              <Box className={style.data}>
                <Typography variant="body1">
                  Last Update {client.updateDtTime 
                    ? new Date(client.updateDtTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : new Date(client.createDtTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                </Typography>
              </Box>
            </div>
            <Divider />
            <div className={style.cardActions}>
              <div
                className={
                  client.status === "inActive"
                    ? style.inactiveStatusGrid
                    : style.activeStatusGrid
                }
              >
                {client.status === "inActive" ? "Inactive" : "Active"}
              </div>
              <IconButton onClick={(event) => handleMenuOpen(event, client)}>
                <MoreHoriz />
              </IconButton>
            </div>
          </Card>
        </Grid>
      ))}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => selectedClient && handleEditClient(selectedClient)}
        >
          <Edit className={style.edit} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedClient?.clientId &&
            handleDeleteClient(selectedClient.clientId)
          }
        >
          <Delete className={style.delete} /> Delete
        </MenuItem>
      </Menu>
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
    </Grid>

     <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={rowsPerPage}
            totalItems={totalCount}
            onPageChange={handlePageChange}
          />

          </>
  );
};

export default ClientManagementGridView;