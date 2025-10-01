import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  setModalData,
  setSelectedRow,
} from "../../../../redux/assessmentSlice";
import { useState } from "react";
import useAxios from "../../../../api/useAxios";
import { getEvidenceTracker } from "../../../../api/project";
export interface Comment {
  Date: string;
  Comment: string;
}

export interface DeviceReference {
  DeviceName: string;
  AssessmentQuestion: string;
  ClientResponse: string;
  QuestionFinding: string;
  ResponseReason: string;
}

export interface Comment {
  Date: string;
  Comment: string;
}

export interface AssessmentData {
  DeviceType: string;
  Questionnaire: string;
  AEInternalAssessor: string;
  DeviceReference: DeviceReference[];
  Comments: Comment[];
}

export interface TableRow {
  id: string;
  groupId: string;
  deviceType: string;
  questionnaire: string;
  stakeholder: string;
  deviceName: string;
  assessmentQuestion: string;
  clientResponse: string;
  questionFinding: string;
  responseReason: string;
  rowData: {
    rowIndex: number;
    refIndex: number;
    itemComments: Comment[];
  };
  isFirstInGroup: boolean;
  groupLength: number;
  _deviceType: string;
  _questionnaire: string;
  _stakeholder: string;
  _addComment: boolean;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: T[keyof T], row: T) => JSX.Element | null;
}
type EvidenceEntry = {
  id: string;
  deviceRefName: string;
  deviceType: string;
  questionnaire: string;
  question: string;
  description?: string;
  controlReference?: string;
  latestEvidence: string[];
  previousEvidence?: string[];
  previousDate?: string;
  AEInternalAssessor: string;
  SubmittedOn?: string;
  resolutionDate?: string;
  Status: string;
};

const useAssessmentDrawer = () => {
  const axiosInstance = useAxios();
  const projectId = useSelector(
    (state: RootState) => state.projectView.selectedProject?._id
  );
  const [AssessmentEvidenceTracker, setAssessmentEvidenceTracker] = useState<
    EvidenceEntry[]
  >([]);
  const [selectedTableRow, setSelectedtableRow] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [assessorFilter, setAssessorFilter] = useState(
    "All AE Internal Assessors"
  );
  const { modalData, newComment, selectedRow } = useSelector(
    (state: RootState) => state.assessment
  );
  const dispatch = useDispatch();
  const handleRowClick = (deviceName: string, rowIndex: string) => {
    dispatch(setSelectedRow({ row: rowIndex, deviceName }));
  };

  const openModal = (comments: Comment[], rowIndex: string) => {
    dispatch(
      setModalData({ id: rowIndex, content: "Comment Section", comments })
    );
  };

  const closeModal = () => {
    dispatch(setModalData(null));
  };

  const getEvidenceTrackerdata = async () => {
    try {
      const response = await getEvidenceTracker(axiosInstance, projectId ?? "");
      setAssessmentEvidenceTracker(response);
    } catch (error) {
      console.error("Error fetching evidence tracker data:", error);
    }
  };
  const filteredData = AssessmentEvidenceTracker.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deviceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deviceRefName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.questionnaire?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "All Categories" || item.deviceType === categoryFilter;

    const matchesAssessor =
      assessorFilter === "All AE Internal Assessors" ||
      item.AEInternalAssessor === assessorFilter;

    const matchesTab =
      activeTab === "all" || item.Status?.toLowerCase() === activeTab;

    return matchesSearch && matchesCategory && matchesAssessor && matchesTab;
  });

  const getTabCount = (tabType: string) => {
    return AssessmentEvidenceTracker.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(tabType) ||
        item.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deviceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deviceRefName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.questionnaire?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "All Categories" ||
        item.deviceType === categoryFilter;

      const matchesAssessor =
        assessorFilter === "All AE Internal Assessors" ||
        item.AEInternalAssessor === assessorFilter;
 
      const matchesTabType =
        tabType === "all" || item.Status?.toLowerCase() === tabType;
      return (
        matchesSearch && matchesCategory && matchesAssessor && matchesTabType
      );
    }).length;
  };
  const tabs = [
    { id: "all", label: "All Evidence", count: getTabCount("all") },
    { id: "uploaded", label: "Uploaded", count: getTabCount("uploaded") },
    { id: "missing", label: "Missing", count: getTabCount("missing") },
  ];

  const uniqueCategories = Array.from(
    new Set(AssessmentEvidenceTracker.map((item) => item.deviceType))
  );
  const uniqueAssessors = Array.from(
    new Set(AssessmentEvidenceTracker.map((item) => item.AEInternalAssessor))
  );

  const completionPercentage = Math.round(
    (AssessmentEvidenceTracker.filter(
      (item) => item.Status.toLowerCase() === "uploaded"
    ).length /
      Math.max(AssessmentEvidenceTracker.length, 1)) *
      100
  );
  return {
    closeModal,
    openModal,
    handleRowClick,
    modalData,
    newComment,
    selectedRow,
    getEvidenceTrackerdata,
    selectedTableRow,
    setSelectedtableRow,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    assessorFilter,
    setAssessorFilter,
    filteredData,
    getTabCount,
    tabs,
    uniqueCategories,
    uniqueAssessors,
    completionPercentage,
    axiosInstance,
  };
};

export default useAssessmentDrawer;
