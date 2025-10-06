import { useEffect, useState, useCallback, useRef } from 'react';
import { SelectChangeEvent } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { GapsRemediation, setActiveFilterRedux, setSelectedReqNo, setsetAEInternalAssesorGap } from '../../../../redux/GapsRemediationSlice';
import { AppDispatch, RootState } from '../../../../redux/store';
import usePhaseBreadcrumbs from '../../hooks/useAuditProjectPhases';
import {

  setSelectedControlNoGap,
  setSelectedReqNoGap,
  setSelectedSubReqNoGap,
  resetSelectedReqNoGap,
} from "../../../../redux/GapsRemediationSlice";
import { useNavigate, useLocation } from 'react-router-dom';
import useAxios from '../../../../api/useAxios';
import { getSignedUrlAssessment, storeGapComment } from '../../../../api/project';
import { Evidence } from '../../../../redux/assessmentSlice';
import { createDebounce } from '../../../../common/hooks/useDebouncedValue';
interface HoverData {
  color: string | undefined;
  percentage: number;
  x: number;
  y: number;
}
export interface GapRemediationDropdown {
  title: string;
  options: string[];
}

export interface GapCardProps {
  title: string;
  description?: string;
  totalGaps: number;
  completedGaps: number;
  onClick: () => void;
}

export type IdentifiedGap = {
  _id: string;
  gapDesc: string;
  status: string;
  evidences: Evidence[];
  oldEvidence: Evidence[];
  resolutionComment?: string;
  // add other properties if needed
};

type StakeholderGap = {
  totalGaps: number;
  completedGaps: number;
  AEInternalAssessor: string;
};

type DeviceType = { _id: string; name: string };

type DeviceGap = {
  deviceType?: string;
  deviceRef?: string;
  totalGaps: number;
  completedGaps: number;
};

// Define the type for the flattened gap object
interface FlattenedGap {
  id: string;
  description: string;
  controlReference: string;
  AEInternalAssessor: string;
  Status: string;
  previousEvidence: Evidence[];
  previousDate: string;
  latestEvidence: Evidence[];
  latestDate: string;
  resolutionComment: string;
  resolutionDate: string;
  originalId: string;
  ReqNo: string;
  subReqNo: string;
  originalIndex?: number;
  isFirstInGroup?: boolean;
  rowSpan?: number;
  uploadedAt?: string;
}

// Define the type for questionnaire gaps
interface QuestionnaireGap {
  id: string;
  questionText: string;
  userResponse: string;
  gapComment: string;
  questionnaireTitle: string;
  questionnairePhase: string;
  questionId: string;
  status?: string;
  clientComment?: string;
  questionType?: string;
  choices?: Array<{ value: string }>;
}

interface Question {
  _id: string;
  text: string;
  type: string;
  choices?: Array<{ value: string }>;
  requirements?: string | null;
  subRequirements?: string | null;
  subControl?: string | null;
  userResponse?: string;
  gaps?: {
    gaps?: string;
    clientComment?: string;
    status?: string;
  };
}
export const useGapAndRemediationView = () => {
  const axiosInstance = useAxios();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [alldeviceGaps, setAlldeviceGaps] = useState<DeviceGap[]>([]);
  const [allStakeholderGaps, setAllStakeholderGaps] = useState<StakeholderGap[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [assessorFilter, setAssessorFilter] = useState("All Assessors");
  const [requirementFilter, setRequirementFilter] = useState("Req 1");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoverData, setHoverData] = useState<HoverData | null>(null);
  const [questionnaireGaps, setQuestionnaireGaps] = useState<QuestionnaireGap[]>([]);
  const [isQuestionnaireView, setIsQuestionnaireView] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string>("");
  const [isAEPocView, setIsAEPocView] = useState(false);
  const { totalNoOfGaps, PendingClient, PendingQsa, selectedReqNo,gapRemediationDropdown, gapRemediationData, ActiveFilter ,requirementsData} =
      useSelector((state: RootState) => state.gapsRemediation);
  const selectedProject = useSelector(
    (state: RootState) => state.projectView.selectedProject
  );
  
  // Get user role from Redux store
  const userRole = useSelector((state: RootState) => state.login.user?.roles?.[0]);
  const isAEPocUser = userRole === "AEPoc" || userRole === "AEPoC";

console.log("gapRemediationData", gapRemediationData);
  const { handlePhaseClick } = usePhaseBreadcrumbs();
  const [activeFilter, setActiveFilter] = useState<{
  type: "tab" | "device" | null;
  value: string;
}>({ type: "tab", value: ActiveFilter.value ?? "Questionnaire" });

useEffect(() => {
  dispatch(setActiveFilterRedux(activeFilter));

}, [activeFilter, dispatch]);

// Handle questionnaire data from navigation state
useEffect(() => {
  if (location.state) {
    const { questionnaireData, questionsWithGaps, isAEPoc } = location.state;
    if (questionnaireData && questionsWithGaps) {
      setIsQuestionnaireView(true);
      setIsAEPocView(isAEPoc || false);
      console.log('AEPoc view set to:', isAEPoc || false);
      console.log('User role:', userRole, 'isAEPocUser:', isAEPocUser);

      // Transform questionnaire gaps to table format
      const transformedGaps: QuestionnaireGap[] = questionsWithGaps.map(
        (question: Question, index: number) => ({
          id: `QSTNR-GAP-${String(index + 1).padStart(3, "0")}`,
          questionText: question.text || "No question text",
          userResponse: question.userResponse || "No response",
          gapComment: question.gaps?.gaps || "", // QSA gap comment
          questionnaireTitle:
            questionnaireData.title || "Unknown Questionnaire",
          questionnairePhase: questionnaireData.phase || "Unknown Phase",
          questionId: question._id || `q-${index}`,
          status: question.gaps?.status || "Finding Open",
          clientComment: question.gaps?.clientComment || "", // AEPoc client comment
          questionType: question.type || "short_text", // Add question type
          choices: question.choices || [], // Add choices for single/multiple choice
        })
      );

      setQuestionnaireGaps(transformedGaps);
      
      // Set available questionnaires (only those with gaps)
      const uniqueQuestionnaires = Array.from(
        new Set(transformedGaps.map(gap => gap.questionnaireTitle))
      );
      // Set default selected questionnaire to the first one
      if (uniqueQuestionnaires.length > 0) {
        setSelectedQuestionnaire(uniqueQuestionnaires[0]);
      }
    }
  }
}, [location.state, userRole, isAEPocUser]);


const setDropdownFilter = async (value: string) => {
    await dispatch(setSelectedReqNo(value));
    setRequirementFilter(value);
  };
const handleTabClick = (tabName: string) => {
  setActiveFilter({ type: "tab", value: tabName });
};

const handleDeviceChange = (event: SelectChangeEvent<string>) => {
  setActiveFilter({ type: "device", value: event.target.value });
};

const handleEvidenceClick = async (evidenceUrl: string) => {
    try {
      const response = await getSignedUrlAssessment(axiosInstance, evidenceUrl);
      const signedUrl = response.data;
      window.open(signedUrl, "_blank"); // Open in new tab
    } catch (error) {
      console.error("Error fetching signed URL:", error);
    }
  };
const handleMouseLeave = () => {
    setHoverData(null);
  };

const handleMouseEnter = (
    percentage: number,
    color: string,
    event: React.MouseEvent<SVGCircleElement, MouseEvent>
  ) => {
    const { clientX, clientY } = event;
    setHoverData({ percentage, x: clientX, y: clientY, color });
  };
const handleResolveClick = (
  reqNo: string,
  controlNo: string,
  subReqNo: string,
  AEInternalAssesor: string
) => {
  console.log(reqNo, controlNo, subReqNo);
  // Dispatch values to Redux
  dispatch(setSelectedReqNoGap(reqNo));
  dispatch(setSelectedControlNoGap(controlNo));
  dispatch(setSelectedSubReqNoGap(subReqNo));
  dispatch(setsetAEInternalAssesorGap(AEInternalAssesor));

  handlePhaseClick("assessment");
  resetSelectedReqNoGap();
};
const handleRowClick = (index: number) => {
    setSelectedRow(selectedRow === index ? null : index);
  };

// Process gaps for merging cells
const processGapsForMerging = (gaps: FlattenedGap[]): FlattenedGap[] => {
  const processed: FlattenedGap[] = [];
  const gapGroups: { [key: string]: FlattenedGap[] } = {};

  // Group gaps by ID and control reference
  gaps.forEach((gap, index: number) => {
    const groupKey = `${gap.id}-${gap.controlReference}`;
    if (!gapGroups[groupKey]) {
      gapGroups[groupKey] = [];
    }
    gapGroups[groupKey].push({ ...gap, originalIndex: index });
  });

  // Process each group
  Object.keys(gapGroups).forEach((groupKey: string) => {
    const group = gapGroups[groupKey];
    group.forEach((gap, indexInGroup: number) => {
      processed.push({
        ...gap,
        isFirstInGroup: indexInGroup === 0,
        rowSpan: group.length,
      });
    });
  });

  return processed;
};

// Filter questionnaire gaps based on selected questionnaire
const filteredQuestionnaireGaps = questionnaireGaps.filter(gap => {
  if (!selectedQuestionnaire) return true; // Show all if no selection
  return gap.questionnaireTitle === selectedQuestionnaire;
});

const getStatusChip = (status: string) => {
  let colorClass = "";

  switch (status.toLowerCase()) {
    case "pending client":
      colorClass = "statusClient";
      break;
    case "pending qsa":
      colorClass = "statusQsa";
      break;
    case "yet to sent":
      colorClass = "statusYet";
      break;
    case "resolved":
      colorClass = "statusResolved";
      break;
    default:
      colorClass = "statusDefault";
  }

  return colorClass;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Finding Closed":
      return "#10b981"; // Green
    case "Finding Open":
      return "#f59e0b"; // Amber
    case "Client input pending":
      return "#3b82f6"; // Blue
    case "Under Auditor Review":
      return "#8b5cf6"; // Purple
    default:
      return "#f59e0b"; // Default to amber
  }
};

const getStatusTextColor = () => {
  return "#ffffff"; // White text for all statuses
};

// Create a stable debounced function using useRef
const debouncedSaveRef = useRef<ReturnType<typeof createDebounce> | null>(null);

// Initialize the debounced function only once
if (!debouncedSaveRef.current) {
  debouncedSaveRef.current = createDebounce((...args: unknown[]) => {
    const [questionId, clientResponse] = args as [string, string];
    
    // Save client response to database
    const saveClientResponse = async () => {
      try {
        console.log('Saving client response:', { questionId, clientResponse });
        
        // Get current questionnaire gaps from state
        setQuestionnaireGaps((currentGaps) => {
          const currentGap = currentGaps.find(gap => gap.questionId === questionId);
          const existingGapComment = currentGap?.gapComment || "";
          
          const gapCommentData = {
            questionId,
            gapComment: existingGapComment, // Keep existing gap comment for QSA
            clientComment: clientResponse, // Update client comment for AEPoc
            assessmentId: selectedProject?._id
          };
          
          // Make API call
          storeGapComment(axiosInstance, gapCommentData)
            .then(() => {
              console.log('Client response saved successfully');
            })
            .catch((error) => {
              console.error('Error saving client response:', error);
            });
          
          return currentGaps; // Return unchanged state
        });
        
      } catch (error) {
        console.error('Error saving client response:', error);
      }
    };
    
    saveClientResponse();
  }, 1000);
}

// Handle client response change with debouncing
const handleClientResponseChange = useCallback((questionId: string, clientResponse: string) => {
  // Update local state immediately for UI responsiveness
  setQuestionnaireGaps((prevGaps) =>
    prevGaps.map((g) =>
      g.questionId === questionId
        ? { ...g, clientComment: clientResponse }
        : g
    )
  );
  
  // Use the stable debounced save function
  if (debouncedSaveRef.current) {
    debouncedSaveRef.current(questionId, clientResponse);
  }
}, []);

 
const filteredData = gapRemediationData?.filter((gap) => {
const matchesSearch =
    (gap.id?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (gap.controlNo?.toLowerCase() ?? "").includes(searchTerm.toLowerCase());
 const normalizedStatusFilter = statusFilter.trim().toLowerCase();
const matchesStatus =
  normalizedStatusFilter === "all status" ||
  ((gap.identifiedGaps[0] as unknown) as GapsRemediation).status?.toLowerCase() === normalizedStatusFilter;

const normalizedAssessorFilter = assessorFilter.trim().toLowerCase();
const matchesAssessor =
  normalizedAssessorFilter === "all assessors" ||
  (gap.AEInternalAssessor?.toLowerCase() ?? "").includes(normalizedAssessorFilter);

  return matchesSearch && matchesStatus && matchesAssessor;
});

  let globalGapCounter = 1;
  const flattenedGaps = filteredData.flatMap((item) =>
    Array.isArray(item.identifiedGaps) && item.identifiedGaps.length > 0
      ? (item.identifiedGaps as unknown as IdentifiedGap[]).map((gap) => {
          const previousEvidences = gap.oldEvidence;
          const latestEvidences = gap.evidences || [];

          return {
            id: `GAP-${String(globalGapCounter++).padStart(3, "0")}`,
            description: gap?.gapDesc || "No description available",
            controlReference: item.controlNo || "N/A",
            AEInternalAssessor: item.AEInternalAssessor || "N/A",
            Status: gap.status,
            previousEvidence: previousEvidences,
            previousDate: "",
            latestEvidence: latestEvidences,
            latestDate: "",
            resolutionComment:gap.resolutionComment || "",
            resolutionDate: "",
            originalId: gap._id,
            ReqNo: item.reqNo,
            subReqNo: item.subReqNo,
          };
        })
      : [
          {
            id: `GAP-${String(globalGapCounter++).padStart(3, "0")}`,
            description: "No gaps identified",
            controlReference: item.controlNo || "N/A",
            AEInternalAssessor: item.AEInternalAssessor || "N/A",
            Status: item.status,
            previousEvidence: [],
            previousDate: "",
            latestEvidence: [],
            latestDate: "",
            resolutionComment: "",
            resolutionDate: "",
            originalId: item.id,
            ReqNo: item.reqNo,
            subReqNo: item.subReqNo,
          },
        ]
  );

  const processedGaps = processGapsForMerging(flattenedGaps);
 // Calculate questionnaire gaps count
 const questionnaireGapsCount = questionnaireGaps.length;
 
 // Calculate combined status data
 const statusData = [
    { 
      label: "Total gaps", 
      count: isQuestionnaireView ? questionnaireGapsCount : totalNoOfGaps, 
      color: "#1E88E5", 
      type: "total" 
    },
    { 
      label: "Pending client", 
      count: isQuestionnaireView ? questionnaireGapsCount : PendingClient, 
      color: "#EC8526", 
      type: "completed" 
    },
    { 
      label: "Pending Auditor", 
      count: isQuestionnaireView ? questionnaireGapsCount : PendingQsa, 
      color: "#DD524C", 
      type: "pending" 
    },
  ];
  return {
    handleDeviceChange,
    activeFilter, 
    hoverData, 
    handleMouseLeave, 
    handleMouseEnter, 
    handleTabClick,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    assessorFilter,
    setAssessorFilter,
    requirementFilter,
    setRequirementFilter,
    selectedRow,
    setSelectedRow, 
    totalNoOfGaps,
    selectedReqNo,
    gapRemediationData,
    ActiveFilter,
    selectedProject,
    handlePhaseClick,
    handleResolveClick,
    handleRowClick,
    filteredData,
    deviceTypes,
    setDeviceTypes,
    alldeviceGaps,
    setAlldeviceGaps,
    allStakeholderGaps,
    setAllStakeholderGaps,
    requirementsData,
    axiosInstance,
    dispatch,
    navigate,
    gapRemediationDropdown,
    setSelectedReqNoGap,
    PendingClient,
    PendingQsa,
    setDropdownFilter,
    handleEvidenceClick,
    flattenedGaps,
    statusData,
    // New questionnaire-related state and functions
    questionnaireGaps,
    setQuestionnaireGaps,
    isQuestionnaireView,
    setIsQuestionnaireView,
    selectedQuestionnaire,
    setSelectedQuestionnaire,
    isAEPocView,
    setIsAEPocView,
    userRole,
    isAEPocUser,
    location,
    processGapsForMerging,
    filteredQuestionnaireGaps,
    getStatusChip,
    getStatusColor,
    getStatusTextColor,
    processedGaps,
    handleClientResponseChange,
    questionnaireGapsCount
  };
};

