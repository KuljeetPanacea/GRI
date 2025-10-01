import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  scopingQSTRNR,
  setSelectedQSTNR,
} from "../../redux/projectManagementSlice";
import { fetchProjectQuestionaire } from "../../api/project";
import useAxios from "../../api/useAxios";

const useAEPoc = () => {
  const axiosInstance = useAxios();
  const [complianceType, setComplianceType] = useState("");
  const [activeTab, setActiveTab] = useState("Current");
  const [currentTab, setCurrentTab] = useState("In Progress");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [scopingDataArray, setScopingDataArray] = useState<scopingQSTRNR[]>([]);
  const project =
    useSelector((state: RootState) => state.projectView.selectedProject) ||
    JSON.parse(localStorage.getItem("selectedProject") || "null");

  const handleComplianceChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setComplianceType(event.target.value as string);
  };
  const handleQstnrChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setComplianceType(event.target.value as string);
  };
  const handleViewQSTNR = (qstnr: scopingQSTRNR) => {
    dispatch(setSelectedQSTNR(qstnr));
    navigate("/landing/question-attempt");
  };
  useEffect(() => {
    const fetchData = async () => {
      if (project?._id) {
        const data = await fetchProjectQuestionaire(axiosInstance, project._id);
        setScopingDataArray(data);
      }
    };

    fetchData();
  }, [project]);
  return {
    complianceType,
    setComplianceType,
    activeTab,
    setActiveTab,
    handleComplianceChange,
    currentTab,
    setCurrentTab,
    handleQstnrChange,
    project,
    navigate,
    dispatch,
    handleViewQSTNR,
    scopingDataArray,
    setScopingDataArray
  };
};

export default useAEPoc;
