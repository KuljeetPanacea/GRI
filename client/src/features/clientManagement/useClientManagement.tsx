import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../redux/store";
import {
  closeAddNewClientModal,
  openAddNewClientModal,
} from "../../redux/AddNewClientSlice";
import {
  fetchClients,
  setViewMode,
  showSnackbar,
  closeSnackbar,
  Client,
  resetFilters,
} from "../../redux/clientManagementSlice";
import useAxios from "../../api/useAxios";
import { AppDispatch } from "../../redux/store";
import { addClients, updateClient } from "../../api/client";

// You can still define the type here for convenience
type SnackbarSeverity = "success" | "error" | "info" | "warning";

const useClientManagement = () => {
  const dispatch: AppDispatch = useDispatch();
  const viewMode = useSelector(
    (state: RootState) => state.clientManagement.viewMode
  );
  const editingClient = useSelector(
    (state: RootState) => state.clientmodal.editingClient
  );
  const isEditMode = useSelector(
    (state: RootState) => state.clientmodal.isEditMode
  );
  const clientId = useSelector(
    (state: RootState) => state.clientmodal.clientId
  );

  // Get snackbar state from Redux instead of local state
  const snackbar = useSelector(
    (state: RootState) => state.clientManagement.snackbar
  );

  // Update snackbar handlers to use Redux actions
  const handleSnackbarClose = () => {
    dispatch(closeSnackbar());
  };

  const showSnackbarMessage = (
    message: string,
    severity: SnackbarSeverity = "info"
  ) => {
    dispatch(showSnackbar({ message, severity }));
    console.log("Snackbar message:", message);
  };

  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [demography, setDemography] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [businessEntity, setBusinessEntity] = useState<string>("");
  const [entitySize, setEntitySize] = useState<string>("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [pocName, setPocName] = useState("");
  const [leadershipName, setLeadershipName] = useState("");
  const [pocContactNumber, setPocContactNumber] = useState("");
  const [leadershipContactNo, setLeadershipContactNo] = useState("");
  const [pocEmailId, setPocEmailId] = useState("");
  const [leadershipEmailId, setLeadershipEmailId] = useState("");
  const axiosInstance = useAxios();
  const [demographyOptions, setDemographyOptions] = useState<string[]>([]);
  const [industryOptions, setIndustryOptions] = useState<string[]>([]);
  const [businessEntityOptions, setBusinessEntityOptions] = useState<string[]>(
    []
  );
  const [entitySizeOptions, setEntitySizeOptions] = useState<string[]>([]);
  const { industrySize, onboarding,search } = useSelector(
    (state: RootState) => state.clientManagement
  );

  const { currentPage } = useAppSelector(
    (state: RootState) => state.clientManagement
  );

  const [updatedFields, setUpdatedFields] = useState<Partial<Client>>({});

  const handleFieldChange = (field: string, value: string) => {
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
    // Also update the individual field state if needed
  };

  const handleNewClient = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setClientName("");
    setBusinessName("");
    setDemography("");
    setIndustry("");
    setBusinessEntity("");
    setEntitySize("");
    setWebsiteLink("");
    setCompanyLogo("");
    setPocName("");
    setPocContactNumber("");
    setLeadershipContactNo("");
    setLeadershipEmailId("");
    setLeadershipName("");
    setPocEmailId("");
    resetFilters();
    dispatch(closeAddNewClientModal());
    dispatch(
      fetchClients({
        axiosInstance,
        page: currentPage,
        limit: 5,
        filters: { onboarding, industry, industrySize, status,search },
      })
    );
  };

  const handleAddNewClientClick = () => {
    dispatch(openAddNewClientModal());
  };

  const handleAddNewClientClose = () => {
    dispatch(closeAddNewClientModal());
  };

  const handleViewChange = (newViewMode: "list" | "grid" | null) => {
    if (newViewMode) {
      dispatch(setViewMode(newViewMode));
    }
  };

  const handleCreateClient = async () => {
    if (pocContactNumber.length < 10) {
    showSnackbarMessage("Enter 10 digit number for POC contact", "error");
    return;
  }

  if (leadershipContactNo.length < 10) {
    showSnackbarMessage("Enter 10 digit number for Leadership contact", "error");
    return;
  }
  const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/\S*)?$/i;
  if (websiteLink && !urlRegex.test(websiteLink)) {
    showSnackbarMessage("Enter a valid website URL", "error");
    return;
  }
    const clientData = {
      clientName,
      businessName,
      demography,
      industry,  
      businessEntity,
      entitySize,
      websiteLink,
      companyLogo,
      pocName,
      pocContactNumber,
      pocEmailId,
      leadershipContactNo,
      leadershipEmailId,
      leadershipName,
    };

    try {
      if (isEditMode) {
        if (clientId) {
          await updateClient(axiosInstance, clientId, updatedFields as Client);
          resetFilters();
          showSnackbarMessage("Client updated successfully", "success");
          setUpdatedFields({});
        } else {
          console.error("Client ID is undefined. Cannot update client.");
          showSnackbarMessage(
            "Client ID is undefined. Cannot update client.",
            "error"
          );
          return;
        }
      } else {
        await addClients(axiosInstance, clientData);
        showSnackbarMessage("New Client Added Successfully", "success");
      }

      dispatch(
        fetchClients({
          axiosInstance,
          page: currentPage,
          limit: 5,
          filters: { onboarding, industry, industrySize, status ,search},
        })
      );

      setClientName("");
      setBusinessName("");
      setDemography("");
      setIndustry("");
      setBusinessEntity("");
      setEntitySize("");
      setWebsiteLink("");
      setCompanyLogo("");
      setPocName("");
      setPocContactNumber("");
      setPocEmailId("");
      setLeadershipContactNo("");
      setLeadershipEmailId("");
      setLeadershipName("");
      
      handleClose();
    } catch (error) {
      console.error("Error creating/updating client:", error);
      if ((error as { status?: number }).status === 409) {
        showSnackbarMessage("Duplicate record found.", "error");
      } else {
        showSnackbarMessage(
          "Error processing client data. Please try again.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    if (editingClient && isEditMode) {
      setClientName(editingClient.clientName || "");
      setBusinessName(editingClient.businessName || "");
      setDemography(editingClient.demography || "");
      setIndustry(editingClient.industry || "");
      setBusinessEntity(editingClient.businessEntity || "");
      setEntitySize(editingClient.entitySize || "");
      setWebsiteLink(editingClient.websiteLink || "");
      setCompanyLogo(editingClient.companyLogo || "");
      setPocName(editingClient.pocName || "");
      setPocContactNumber(editingClient.pocContactNumber || "");
      setPocEmailId(editingClient.pocEmailId || "");
      setLeadershipContactNo(editingClient.leadershipContactNo || "");
      setLeadershipEmailId(editingClient.leadershipEmailId || "");
      setLeadershipName(editingClient.leadershipName || "");

    }
  }, [editingClient, isEditMode]);

  return {
    handleNewClient,
    handleClose,
    open,
    handleViewChange,
    viewMode,
    handleAddNewClientClick,
    handleAddNewClientClose,
    clientName,
    setClientName,
    businessName,
    setBusinessEntity,
    demography,
    setDemography,
    industry,
    setIndustry,
    businessEntity,
    entitySize,
    setEntitySize,
    websiteLink,
    setWebsiteLink,
    companyLogo,
    setCompanyLogo,
    pocName,
    setPocName,
    pocContactNumber,
    setPocContactNumber,
    pocEmailId,
    setPocEmailId,
    setBusinessName,
    handleCreateClient,
    isEditMode, 
    snackbar,
    handleSnackbarClose,
    showSnackbar: showSnackbarMessage,
    demographyOptions,
    setDemographyOptions,
    entitySizeOptions,
    setEntitySizeOptions,
    businessEntityOptions,
    setBusinessEntityOptions,
    industryOptions,
    setIndustryOptions,
    handleFieldChange,
    leadershipContactNo,
    leadershipEmailId,
    leadershipName,
    setLeadershipContactNo,
    setLeadershipEmailId,
    setLeadershipName,
  };
};

export default useClientManagement;
