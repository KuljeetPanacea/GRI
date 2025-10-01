import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { setFilter, resetFilters, FilterState, createQstnrThunk } from "../../../redux/defineQstnrSlice";
import { setName, setDescription } from "../../../redux/defineQstnrSlice";
import { useNavigate } from "react-router-dom";
import useAxios from "../../../api/useAxios";
export const useDefineQstnrModal = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
   const dispatch = useDispatch<AppDispatch>();
  const modalState = useSelector((state: RootState) => state.defineQstnr);
  const createQstnrFilter = useSelector(
    (state: RootState) => state.defineQstnr.filters
  );
  async function onCreate(setSnackbarMessage: (msg: string) => void, setSnackbarOpen: (open: boolean) => void) {
    try {
      const payload = {
        complianceType: createQstnrFilter.complianceType,
        description: modalState.description,
        industrySize: createQstnrFilter.industrySize,
        industryType: createQstnrFilter.industryType,
        phase: createQstnrFilter.phase,
        deviceType:createQstnrFilter.deviceType,
        questions: [],
        title: modalState.title,
      };
  
      const response = await dispatch(createQstnrThunk({ data: payload, axiosInstance })).unwrap();
  
      if (!response || !response.id) {
        throw new Error("Invalid response: " + JSON.stringify(response));
      }
  
      const questionnaireId = response.id;
      console.log("Questionnaire created with ID:", questionnaireId);
      const t1 = performance.now();
      console.log("Navigating at", t1);
      navigate(`/landing/add-question?questionnaireId=${questionnaireId}`);
      const t2 = performance.now();
      console.log("After navigate() call", t2);
      setTimeout(() => {
        dispatch(setName(""));
        dispatch(setDescription(""));
        dispatch(resetFilters());
      }, 100);

      setSnackbarMessage("Questionnaire created successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      setSnackbarMessage("Failed to create questionnaire.");
      setSnackbarOpen(true);
    }
  }
  
  

  return {
    ...modalState,
    filters: createQstnrFilter,
    setName: (name: string) => dispatch(setName(name)),
    setDescription: (desc: string) => dispatch(setDescription(desc)),
    updateFilter: (filterKey: keyof FilterState, value: string) =>
      dispatch(setFilter({ key: filterKey, value })),
    onCreate
  };
};
