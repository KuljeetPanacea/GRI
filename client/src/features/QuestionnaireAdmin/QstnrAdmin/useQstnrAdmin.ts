import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store"; 
import { setFilter, resetFilters ,setViewMode} from "../../../redux/qstnrFilterSlice";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../../api/useAxios";
import { clearQstnr, deleteQstnrThunk, duplicateQstnrThunk, getQstnrThunk,setCurrentPage } from "../../../redux/defineQstnrSlice";
import { createDebounce } from "../../../common/hooks/useDebouncedValue";
import { setSearchFilter } from "../../../redux/qstnrFilterSlice";

export const useQstnrAdmin = () => {
  const axiosInstance = useAxios();
  const filtersState = useSelector((state: RootState) => state.filters);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [excelOpen, setExcelOpen] = useState(false); 
  const { qstnrList, currentPage, totalPages, totalCount } = useSelector((state: RootState) => state.defineQstnr);
  const [questionnaireTypeOptions, setQuestionnaireTypeOptions] = useState<string[]>([]);
  const [industryOptions, setIndustryOptions] = useState<string[]>([]);
  const [industrySizeOptions, setIndustrySizeOptions] = useState<string[]>([]);
  const [complianceOptions, setComplianceOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions]= useState<string[]>([]);
  const [deviceOptions, setDeviceOptions]= useState<string[]>([]);

const [localSearch, setLocalSearch] = useState(filtersState.search);

 const debouncedSearch = useCallback(
    createDebounce((...args: unknown[]) => {
      const value = args[0] as string;
      dispatch(setSearchFilter(value));
    }, 1000),
    [dispatch]
  );

   const setSearchValue = (value:string) => {
    setLocalSearch(value);
   debouncedSearch(value);
   
  };
  const handleNewQuestionnaire = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleExcelUpload = () => {
    setExcelOpen(true);
  };
  const handleExcelClose = () => {
    setExcelOpen(false);
  };
  const handleEdit = (id: string) => {
    navigate(`/landing/add-question?questionnaireId=${id}`);
  };
  const updateFilter = (key: keyof typeof filtersState, value: string) => {
    dispatch(setFilter({ key, value }));
  };
  const clearFilters = () => {
    dispatch(resetFilters());
  };

  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
        if(validPage !== currentPage){
          dispatch(setCurrentPage(validPage));
        }
    setCurrentPage(page);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(getQstnrThunk({ filters: filtersState, axiosInstance ,currentPage,limit:5}));
        // const result = await getQuestionnaires(filtersState, axiosInstance);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filtersState,currentPage]);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: "list" | "grid" | null
  ) => {
  if (newViewMode) {
    console.log("newViewMode", event);
    dispatch(setViewMode(newViewMode));
  }
  
};
const handleDelete = async(id:string) =>{
    try {
      await dispatch(deleteQstnrThunk({ id, axiosInstance }));
      dispatch(clearQstnr());
      dispatch(getQstnrThunk({ filters: filtersState, axiosInstance }));
    } catch (error) {
      console.error("Error deleting questionnaire:", error);
    }
  }
const handleDuplicate = async(id:string) =>{
    try {
      await dispatch(duplicateQstnrThunk({ id , axiosInstance }));
      dispatch(clearQstnr());
     dispatch(getQstnrThunk({ filters: filtersState, axiosInstance, currentPage, limit: 5 }));
    } catch (error) {
      console.error("Error duplicating questionnaire:", error);
    }
  }

  return { 
    filters: filtersState, 
    updateFilter, 
    clearFilters, 
    handleNewQuestionnaire, 
    handleClose, 
    open, 
    handleExcelUpload,
    handleExcelClose,
    excelOpen,
    handleDelete,
    handleDuplicate, 
    handleViewChange,
    viewMode: filtersState.viewMode,
    handleEdit,
    handlePageChange,
    selectedRows,
    setSelectedRows,
    qstnrList,
    questionnaireTypeOptions, 
    setQuestionnaireTypeOptions,
    industryOptions, 
    setIndustryOptions,
    industrySizeOptions, 
    setIndustrySizeOptions,
    complianceOptions, 
    setComplianceOptions,
    statusOptions, 
    setStatusOptions,
    deviceOptions,
    setDeviceOptions,
    currentPage,
    totalPages,
    totalCount,
    localSearch,
    setLocalSearch,
    debouncedSearch,
    setSearchValue,
  };
};
