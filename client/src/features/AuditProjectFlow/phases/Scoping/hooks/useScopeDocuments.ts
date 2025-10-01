import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { setActiveTab } from "../../../../../redux/scopeDocumentSlice";
import { useState, useEffect } from "react";
import { fetchProjectQuestionaire } from "../../../../../api/project";
import useAxios from "../../../../../api/useAxios";
import { scopingQSTRNR } from "../../../../../redux/projectManagementSlice";

const headingToIdMap: Record<string, string> = {
    "Objective": "objective",
    "Business Overview": "businessOverview",
    "Cardholder Data Environment": "Cardholder Data Environment",
    "Connected Systems": "connectedSystems",
    "Third Parties": "Third Parties",
    "Out-of-Scope Systems": "outOfScope",
    "Data Flows": "dataFlow",
    "Risk Assessment": "riskAssessment"
};

export const useScopeDocument = () => {
    const axiosInstance = useAxios();
    const dispatch = useDispatch();
    const headings = Object.keys(headingToIdMap);
    const activeTab = useSelector((state: RootState) => state.scopeDocument.activeTab);
    const scopingdata = useSelector((state: RootState) => state.projectView.selectedProject?.ScopeDocument);
    // States from Questionnaire
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [selectedScopingIndex, setSelectedScopingIndex] = useState(0);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
    const [scopingDataArray, setScopingDataArray] = useState<scopingQSTRNR[]>([]);
    const [expandedAccordions, setExpandedAccordions] = useState<{[key: number]: boolean}>({
        0: false // Keep first accordion expanded by default
    });

    const selectedProject = useSelector(  
        (state: RootState) => state.projectView.selectedProject
      );

    const currentScopingData = scopingDataArray[selectedScopingIndex] ?? {};
    const selectedQuestion = currentScopingData?.questions?.[selectedQuestionIndex];

    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSelectedAnswer(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
          if (selectedProject?._id) {
            const data = await fetchProjectQuestionaire(axiosInstance, selectedProject._id);
            setScopingDataArray(data);
          }
        };
      
        fetchData();
      }, [selectedProject]);

    const handleAccordionToggle = (index: number) => {
        setExpandedAccordions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleQuestionSelect = (scopingIndex: number, questionIndex: number) => {
        setSelectedScopingIndex(scopingIndex);
        setSelectedQuestionIndex(questionIndex);
        
        // Set the selected answer based on userResponse
        const question = scopingDataArray[scopingIndex]?.questions?.[questionIndex];
        if (question?.userResponse) {
            if (Array.isArray(question.userResponse)) {
                setSelectedAnswer(question.userResponse[0] || "");
            } else {  // For single response (string) - used for single_choice, long_text, short_text
                setSelectedAnswer(question.userResponse);
            }
        } else {
            setSelectedAnswer(""); // Reset if no userResponse
        }
    };

    useEffect(() => {
        if (selectedQuestion?.userResponse) {
            if (Array.isArray(selectedQuestion.userResponse)) {
                setSelectedAnswer(selectedQuestion.userResponse[0] || "");
            } else {
                setSelectedAnswer(selectedQuestion.userResponse);
            }
        } else {
            setSelectedAnswer("");
        }
    }, [selectedQuestion]);

    const handleTabClick = (heading: string) => {
        dispatch(setActiveTab(heading));
        const targetId = headingToIdMap[heading];
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

   


    return {
        activeTab,
        handleTabClick,
        headings,
        // New returns from Questionnaire
        selectedAnswer,
        selectedScopingIndex,
        selectedQuestionIndex,
        expandedAccordions,
        scopingDataArray,
        currentScopingData,
        selectedQuestion,
        handleAnswerChange,
        handleAccordionToggle,
        handleQuestionSelect,
        scopingdata
    };
};
