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

  // Check if any questionnaire has gaps (questions with gap comments)
  const hasGaps = (qstnr: scopingQSTRNR) => {
    return qstnr.questions?.some(question => {
      if (!question.gaps) return false;
      
      // Handle different types of gaps
      if (typeof question.gaps === 'string') {
        return question.gaps.trim() !== '';
      } else if (Array.isArray(question.gaps)) {
        return (question.gaps as unknown[]).length > 0;
      } else {
        // For other types, convert to string and check
        return String(question.gaps).trim() !== '';
      }
    });
  };

  // Calculate progress percentage for a questionnaire
  const calculateProgress = (qstnr: scopingQSTRNR) => {
    if (!qstnr.questions || qstnr.questions.length === 0) {
      return 0;
    }

    const totalQuestions = qstnr.questions.length;
    const answeredQuestions = qstnr.questions.filter(question => {
      // Check if userResponse exists and is not empty
      if (!question.userResponse) return false;
      
      // Handle different types of userResponse
      if (typeof question.userResponse === 'string') {
        return question.userResponse.trim() !== '';
      } else if (Array.isArray(question.userResponse)) {
        return (question.userResponse as unknown[]).length > 0;
      } else {
        // For other types, convert to string and check
        return String(question.userResponse).trim() !== '';
      }
    }).length;

    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Get progress bar width style
  const getProgressBarStyle = (progress: number) => ({
    width: `${Math.max(progress, 0)}%`,
    transition: 'width 0.3s ease-in-out'
  });

  const handleViewGaps = (qstnr: scopingQSTRNR) => {
    // Find questions with gaps
    const questionsWithGaps = qstnr.questions?.filter(question => {
      if (!question.gaps) return false;
      
      // Handle different types of gaps
      if (typeof question.gaps === 'string') {
        return question.gaps.trim() !== '';
      } else if (Array.isArray(question.gaps)) {
        return (question.gaps as unknown[]).length > 0;
      } else {
        // For other types, convert to string and check
        return String(question.gaps).trim() !== '';
      }
    }) || [];

    // Navigate to gap and remediation screen
    navigate('/landing/gap-remediation', { 
      state: { 
        questionnaireData: {
          id: qstnr.id,
          title: qstnr.title,
          phase: qstnr.phase
        },
        questionsWithGaps: questionsWithGaps,
        isAEPoc: true
      } 
    });
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
    setScopingDataArray,
    hasGaps,
    calculateProgress,
    getProgressBarStyle,
    handleViewGaps
  };
};

export default useAEPoc;
