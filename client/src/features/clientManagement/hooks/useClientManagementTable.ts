import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../../redux/store";
import useAxios from "../../../api/useAxios";
import { Client, fetchClients, selectFilteredClients, setCurrentPage } from "../../../redux/clientManagementSlice";
import { openEditClientModal, setClientId } from "../../../redux/AddNewClientSlice";
import { openDeleteModal, closeDeleteModal } from "../../../redux/DeleteClientModalSlice";

export const useClientManagementTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const axiosInstance = useAxios();

  // State from Redux
  const { 
    clients, 
    currentPage, 
    rowsPerPage,
    totalPages,
    totalCount, 
    search, 
    status, 
    loading, 
    error,
    
  } = useSelector((state: RootState) => state.clientManagement);

  const filteredClientData = useAppSelector(selectFilteredClients);
  const isDeleteModalOpen = useSelector(
    (state: RootState) => state.clientDeleteModal.isDeleteModalOpen
  );

  // Local state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Menu handlers for grid view
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    client: Client
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClient(null);
  };


  // Edit and delete handlers
  const handleEditClient = (client: Client) => {
    dispatch(openEditClientModal(client));
    dispatch(setClientId(client.clientId || ""));
    handleMenuClose();
  };

  const handleDeleteClient = (clientId: string) => {
    setSelectedClientId(clientId);
    dispatch(openDeleteModal(true));
    handleMenuClose();
  };

  // Modal handlers
  const handleCloseDeleteModal = () => {
    dispatch(closeDeleteModal());
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    console.log("validPage", validPage);
    if(validPage !== currentPage){
      dispatch(setCurrentPage(validPage));
    }
  };
 const { industry, industrySize , onboarding} = useSelector((state: RootState) => state.clientManagement);
  // Load clients on component mount
  const loadClients = () => {
    dispatch(fetchClients({axiosInstance, page: currentPage, limit:5 ,filters: {onboarding, industry, industrySize, status,search }}));
  };

  return {
    // Data
    clients,
    filteredClientData,
    totalPages,
    currentPage,
    rowsPerPage,
    loading,
    error,
    
    // Grid view specific
    anchorEl,
    selectedClient,
    handleMenuOpen,
    handleMenuClose,
    
    // Common
    selectedClientId,
    setSelectedClientId,
    isDeleteModalOpen,
    search,
    status,
    dispatch,
    axiosInstance,
    totalCount,
    
    
    // Actions
    handleEditClient,
    handleDeleteClient,
    handleCloseDeleteModal,
    handlePageChange,
    loadClients,
    industry,
    industrySize,
    onboarding
  };
};

export default useClientManagementTable;