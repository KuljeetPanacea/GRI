import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectActiveTab,
  selectSearchTerm,
  selectIsModalOpen,
  selectDevices,
  selectDevicesLoading,
  selectDevicesError,
  selectCurrentPage,
  selectRowsPerPage,
  selectTotalPages,
  selectTotalCount,
  selectFilteredCategory,
  fetchDevicesAsync,
  addDeviceAsync,
  deleteDeviceAsync,
  setCurrentPage,
  setRowsPerPage,
  setFilteredCategory,
  setSearchTerm,
  setModalOpen,
  clearError,
} from "../../../../redux/deviceIdentificationSlice";
import {
  device,
  scopingQSTRNR,
} from "../../../../redux/projectManagementSlice";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { deviceLookUp, sendAssessmentTaskEmails } from "../../../../api/project";
import useAxios from "../../../../api/useAxios";
import { getQuestionnaires, getQstnrQuestions } from "../../../../api/qstnr";
import { showSnackbar } from "../../../../redux/phaseSlice";

export interface DeviceOption {
  label: string;
  value: string;
}

export const useDeviceIdentification = () => {
  const dispatch = useAppDispatch();
  
  // Redux selectors
  const activeTab = useSelector(selectActiveTab);
  const searchTerm = useSelector(selectSearchTerm);
  const isModalOpen = useSelector(selectIsModalOpen);
  const devices = useSelector(selectDevices);
  const loading = useSelector(selectDevicesLoading);
  const error = useSelector(selectDevicesError);
  const currentPage = useSelector(selectCurrentPage);
  const rowsPerPage = useSelector(selectRowsPerPage);
  const totalPages = useSelector(selectTotalPages);
  const totalCount = useSelector(selectTotalCount);
  const filteredCategory = useSelector(selectFilteredCategory);
  
  const projectDevices = useSelector(
    (state: RootState) => state.projectView.selectedProject?.device ?? []
  );
  const selectedProject = useSelector(
    (state: RootState) => state.projectView.selectedProject
  );

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deviceRefName, setDeviceRefName] = useState("");
  const [deviceType, setdeviceType] = useState("");
  const [primaryAEStakeholder, setPrimaryAEStakeholder] = useState<string[]>([]);
  const [department, setDepartment] = useState("");
  // const [ipAddress, setIpAddress] = useState("");
  const [questionnaires, setQuestionnaires] = useState<scopingQSTRNR[]>([]);
  const [questionnaire, setQuestionnaire] = useState<scopingQSTRNR>();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Questionnaire modal state and logic
  const [openQstnModal, setOpenQstnModal] = useState(false);
  const [qstnList, setQstnList] = useState<
    { text: string; choices?: { value: string }[] }[]
  >([]);
  const [qstnLoading, setQstnLoading] = useState(false);
  const [qstnError, setQstnError] = useState<string | null>(null);
  const [qstnIndex, setQstnIndex] = useState(0);

  const axiosInstance = useAxios();

  // Fetch devices from backend with pagination, search, and filters
  const fetchDevices = async () => {
    if (!selectedProject?._id) return;
    
    const options = {
      page: currentPage,
      limit: rowsPerPage,
      search: searchTerm,
      deviceType: filteredCategory !== "All" ? filteredCategory : undefined,
      // department: department, // Add if you want department filter
    };
    
    await dispatch(fetchDevicesAsync({ projectId: selectedProject._id, options, axiosInstance }));
  };

  useEffect(() => {
    fetchDevices();
  }, [selectedProject?._id, currentPage, rowsPerPage, searchTerm, filteredCategory]);
  
  const addNewDevice = async (device: device) => {
    try {
      if (selectedProject?._id) {
        device.projectId = selectedProject._id;
        const response = await dispatch(addDeviceAsync({ device, projectId: selectedProject._id, axiosInstance }));
        
        if (addDeviceAsync.fulfilled.match(response)) {
          dispatch(showSnackbar({ message: response.payload.message, severity: "success" }));
          
          // Refetch devices to update the list with proper pagination
          await fetchDevices();
        } else {
          dispatch(showSnackbar({ message: "Failed to add device", severity: "error" }));
        }
      }
    } catch (error) {
      console.error("Error occurred while adding device", error);
      dispatch(showSnackbar({ message: "Error occurred while adding device", severity: "error" }));
    }

    setDeviceRefName("");
    setdeviceType("");
    setQuestionnaire(undefined);
    setDepartment("");
    setPrimaryAEStakeholder([]);
    // setIpAddress("");
  };

  const deleteDevice = (deviceRefName: string) => {
    // This function is now handled by Redux, but keeping for backward compatibility
    console.log("Delete device:", deviceRefName);
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setFilteredCategory(value));
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId && selectedProject?._id) {
      try {
        const response = await dispatch(deleteDeviceAsync({ projectId: selectedProject._id, deviceRefName: deleteId, axiosInstance }));
        
        if (deleteDeviceAsync.fulfilled.match(response)) {
          setSnackbar({
            open: true,
            message: "Device deleted successfully.",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Failed to delete device.",
            severity: "error",
          });
        }
      } catch {
        setSnackbar({
          open: true,
          message: "Failed to delete device.",
          severity: "error",
        });
      } finally {
        setDeleteId(null);
      }
    }
  };

  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);

  const fetchDeviceOptions = async () => {
    try {
      const res = await deviceLookUp(axiosInstance);
      const lookupValues = res.data?.[0]?.values || [];

      const formattedOptions = lookupValues.map((item: { name: string }) => ({
        label: item.name,
        value: item.name,
      }));

    setDeviceOptions(formattedOptions);
  } catch (err) {
    console.error("Error loading device options", err);
  }
};

  useEffect(() => {
    fetchDeviceOptions();
  }, []);

  const handleDeviceCategoryChange = (selected: string) => {
    fetchQuestionnaires(selected);
  };

  const fetchQuestionnaires = async (deviceType: string) => {
    try {
      const filters = {
        phase: "Assessment",
        deviceType: deviceType,
      };
      const response = await getQuestionnaires(filters, axiosInstance);
      setQuestionnaires(response.data || []);
    } catch (error) {
      console.error("Failed to fetch questionnaires", error);
    }
  };
  const questionnaireOptions = questionnaires.map((q: scopingQSTRNR) => ({
    label: q.title,
    value: q.id,
  }));

  const handlePlayClick = async (questionnaireId?: string) => {
    if (!questionnaireId) return;
    setQstnLoading(true);
    setQstnError(null);
    setOpenQstnModal(true);
    try {
      const res = await getQstnrQuestions(questionnaireId, axiosInstance);
      setQstnList(res.questions || []);
      setQstnIndex(0);
    } catch {
      setQstnError("Failed to load questionnaire");
    } finally {
      setQstnLoading(false);
    }
  };

  const handleSendClick = async (sendType: 'latest' | 'all' = 'all') => {
    try {
      const uniqueStakeholders: string[] = Array.isArray(devices)
        ? [...new Set(
            devices
              .map(device => device.primaryAEStakeholderId)
              .filter((id): id is string => typeof id === 'string' && id.trim() !== '')
          )]
        : [];

      if (selectedProject?._id && uniqueStakeholders.length > 0) {
        const response = await sendAssessmentTaskEmails(
          axiosInstance,
          selectedProject._id,
          sendType,
          uniqueStakeholders
        );

        if (response) {
          setSnackbar({
            open: true,
            message: response.message || "Emails sent successfully",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Please fill out all fields",
            severity: "error",
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: "No stakeholders found to send emails to",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Failed to send emails:", error);
      setSnackbar({
        open: true,
        message: "Failed to send emails",
        severity: "error",
      });
    }
  };

  return {
    activeTab,
    searchTerm,
    isModalOpen,
    projectDevices,
    currentPage,
    setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
    rowsPerPage,
    setRowsPerPage: (rows: number) => dispatch(setRowsPerPage(rows)),
    totalPages,
    totalCount,
    filteredCategory,
    handleCategoryChange,
    deleteId,
    setDeleteId,
    deviceRefName,
    setDeviceRefName,
    deviceType,
    setdeviceType,
    questionnaire,
    setQuestionnaire,
    primaryAEStakeholder,
    setPrimaryAEStakeholder,
    department,
    setDepartment,
    // ipAddress,
    // setIpAddress,
    devices,
    loading,
    error,
    addNewDevice,
    deleteDevice,
    handleDeleteClick,
    confirmDelete,
    selectedProject,
    deviceOptions,
    setDeviceOptions,
    handleDeviceCategoryChange,
    questionnaireOptions,
    questionnaires,
    handleSendClick,
    snackbar, 
    setSnackbar,
    handlePlayClick,
    openQstnModal,
    setOpenQstnModal,
    qstnList,
    qstnLoading,
    qstnError,
    qstnIndex,
    setQstnIndex,
    setSearchTerm: (term: string) => dispatch(setSearchTerm(term)),
    setModalOpen: (open: boolean) => dispatch(setModalOpen(open)),
    clearError: () => dispatch(clearError()),
  };
};
