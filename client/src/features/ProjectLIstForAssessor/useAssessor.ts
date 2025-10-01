import { useRef, useState, useEffect } from "react";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  device,
  Project,
  scopingQSTRNR,
  setSelectedQSTNR,
  setSelectedTask,
  setComplianceTypeFilter,
  resetProjectFilters,
} from "../../redux/projectManagementSlice";
import {
  selectAssessmentId,
  selectedEvidences,
  setSelectedAssesmentId,
  setSelectedEvidences as setSelectedEvidencesAction,
} from "../../redux/assessmentSlice";
import {
  fetchAssessorGaps,
  fetchAudittask,
  getSignedUrlAPI,
  getSignedUrlAPIForRead,
  storeUserResponse,
  submitAssessmentResponse,
} from "../../api/project";

import useAxios from "../../api/useAxios";
import { uploadEvidence } from "../../api/digitalAvatar";
import {
  deleteEvidenceGap,
  fetchAssessorRevises,
  submitResolutionComment,
} from "../../api/AssetControl";
import { setSelectedProject } from "../../redux/projectViewSlice";
import { setReviseQstnObject } from "../../redux/GapsRemediationSlice";

import {
  getAssessmentSignedUploadUrl,
  getSignedUrlAssessment,
  uploadNewEvidence,
} from "../../api/project";
import { showSnackbar } from "../../redux/userManagementSlice";
import { EvidenceType } from "../AuditProjectFlow/phases/Assessment/components/useEvidenceUpload";

// Interfaces
export interface Question {
  _id: string;
  text: string;
  subControl: string;
  url: string;
  name: string;
  evidenceReference?: string;
  testingProcedure?: string;
}

export interface UploadedFile {
  id: number;
  name: string;
  size: number;
  date: string;
}

// Evidence Resolution Types
export interface Evidence {
  name: string;
  type: string;
  url: string;
  questionId: string;
  evidenceCategory: string;
  refName: string;
}

export interface IdentifiedGap {
  _id: string;
  gapDesc: string;
  status: string;
  evidences?: Evidence[];
  oldEvidence?: Evidence[];
}

export interface ReviseQstnObject {
  controlNo?: string;
  matchedQuestions?: Question[];
  identifiedGaps?: IdentifiedGap[];
  deviceRef?: string;
}

export interface GapWithQuestion {
  question: Question;
  gap: IdentifiedGap;
}

// Assessor Gaps Interfaces
export interface AssessorGapEvidence {
  name: string;
  type: string;
  url: string;
  questionId: string;
  evidenceNo: string;
}

export interface AssessorIdentifiedGap {
  gapDesc: string;
  status: string;
  oldEvidence: AssessorGapEvidence[];
  evidences: AssessorGapEvidence[];
}

export interface AssessorGap {
  assessmentId: string;
  deviceType: string;
  deviceRef: string;
  projectId: string;
  qstnrId: string;
  identifiedGaps: AssessorIdentifiedGap[];
  evidences: AssessorGapEvidence[];
}

export interface EvidenceResolutionProps {
  question: Question;
  gap: IdentifiedGap;
  onPreviewEvidence: (evidenceName: string) => Promise<void>;
  onSubmitResolution: (resolution: string) => Promise<void>;
  loginUserName: string;
  handleUpload: (file: File) => Promise<void>;
  reviseQstnObject: ReviseQstnObject;
}
const useAssessor = () => {
  const axiosInstance = useAxios();
  const [complianceType, setComplianceType] = useState("");
  const [activeTab, setActiveTab] = useState("Current");
  const [currentTab, setCurrentTab] = useState("In Progress");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, UploadedFile[]>
  >({});
  const [dragStates, setDragStates] = useState<Record<string, boolean>>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const userLogin = useSelector(
    (state: RootState) => state.login.user?.roles[0]
  );
  const selectedTask = useSelector(
    (state: RootState) => state.projectManagement.selectedTask
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [reviseQstn, setReviseQstn] = useState<Question[]>([]);
  const [EvidenceUploaded, setEvidencesUploaded] = useState<Question[]>([]);
  const documents = useSelector(selectedEvidences);
  const selectedProject = useSelector(
    (state: RootState) => state.projectView.selectedProject
  );
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const assessmentId = useSelector(selectAssessmentId);
  const dispatch = useDispatch<AppDispatch>();
  const project =
    useSelector((state: RootState) => state.projectView.selectedProject) ||
    JSON.parse(localStorage.getItem("selectedProject") || "null");
  const loginUser = useSelector((state: RootState) => state.login.user);
  const [auditTasks, setAuditTasks] = useState([]);
  const [assessorGaps, setAssessorGaps] = useState<AssessorGap[]>([]);
  const [filteredAssessorGaps, setFilteredAssessorGaps] = useState<
    AssessorGap[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("");
  const [gapStatusFilter, setGapStatusFilter] = useState("");

  const handleComplianceChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newComplianceType = event.target.value as string;
    setComplianceType(newComplianceType);
    // Dispatch compliance type filter to Redux
    dispatch(setComplianceTypeFilter(newComplianceType));
    // Trigger audit task with new compliance type
    auditTask("", newComplianceType);
  };

  const handleClearFilters = () => {
    setComplianceType("");
    dispatch(resetProjectFilters());
    // Trigger audit task with cleared filters
    auditTask("", "");
  };

  // Evidence Resolution
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reviseQstnObject = useSelector(
    (state: RootState) => state.gapsRemediation.reviseQstnObject
  ) as ReviseQstnObject;
  const [resolution, setResolution] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  //end Evidence Resolution

  const handleQstnrChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newComplianceType = event.target.value as string;
    console.log("Selected compliance type:", newComplianceType);
    setComplianceType(newComplianceType);
    // Trigger audit task with new compliance type
    auditTask("", newComplianceType);
  };

  const handleViewQSTNR = (qstnr: device) => {
    dispatch(setSelectedTask(qstnr));
    dispatch(setSelectedQSTNR(qstnr.questionnaire as scopingQSTRNR));
    dispatch(setSelectedAssesmentId(qstnr._id ?? qstnr.id ?? ""));
    navigate("/landing/digital-avatar");
  };

  const handleSubmit = async () => {
    try {
      if (selectedProject?._id) {
        await submitAssessmentResponse(
          axiosInstance,
          selectedProject._id,
          assessmentId
        );
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };
  const auditTask = async (
    searchTerm?: string,
    complianceTypeFilter?: string
  ) => {
    try {
      const response = await fetchAudittask(
        axiosInstance,
        project?.id as string,
        loginUser?.email as string
      );
      let filteredResponse = response;

      // Filter by search term if provided
      if (searchTerm && searchTerm.trim()) {
        filteredResponse = filteredResponse.filter((task: device) => {
          const deviceName = task.deviceRefName?.toLowerCase() || "";
          const taskId = task.id?.toLowerCase() || "";
          const taskOid =
            typeof task._id === "object" && task._id !== null
              ? (task._id as { $oid?: string }).$oid?.toLowerCase() || ""
              : task._id?.toLowerCase() || "";

          return (
            deviceName.includes(searchTerm.toLowerCase()) ||
            taskId.includes(searchTerm.toLowerCase()) ||
            taskOid.includes(searchTerm.toLowerCase())
          );
        });
      }

      // Filter by compliance type if provided
      if (complianceTypeFilter && complianceTypeFilter.trim()) {
        console.log("Filtering by compliance type:", complianceTypeFilter);
        filteredResponse = filteredResponse.filter((task: device) => {
          // Check if the task has compliance type information in the questionnaire
          const taskComplianceType = task.questionnaire?.complianceType;
          console.log(
            "Task compliance type:",
            taskComplianceType,
            "for task:",
            task.deviceRefName
          );

          // If complianceType is missing from questionnaire, log it for debugging
          if (!taskComplianceType) {
            console.log(
              "No compliance type found for task:",
              task.deviceRefName
            );
            return false; // Skip this task if no compliance type is available
          }

          const matches =
            taskComplianceType?.toLowerCase() ===
            complianceTypeFilter.toLowerCase();
          console.log("Matches:", matches);
          return matches;
        });
        console.log("Filtered results count:", filteredResponse.length);
      }

      console.log("Final filtered response:", filteredResponse);
      setAuditTasks(filteredResponse);
    } catch (error) {
      console.error("Error fetching audit tasks:", error);
      setAuditTasks([]);
    }
  };
  const AssessorGaps = async () => {
    const response = await fetchAssessorGaps(
      axiosInstance,
      project?.id as string,
      loginUser?.email as string
    );
    setAssessorGaps(response);
    setFilteredAssessorGaps(response);
  };

  // Filter assessor gaps based on search term and filters
  const filterAssessorGaps = () => {
    let filtered = assessorGaps as AssessorGap[];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((gap: AssessorGap) => {
        const deviceType = gap.deviceType?.toLowerCase() || "";
        const deviceRef = gap.deviceRef?.toLowerCase() || "";
        const assessmentId = gap.assessmentId?.toLowerCase() || "";

        return (
          deviceType.includes(searchTerm.toLowerCase()) ||
          deviceRef.includes(searchTerm.toLowerCase()) ||
          assessmentId.includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filter by device type
    if (deviceTypeFilter) {
      filtered = filtered.filter(
        (gap: AssessorGap) =>
          gap.deviceType?.toLowerCase() === deviceTypeFilter.toLowerCase()
      );
    }

    // Filter by gap status
    if (gapStatusFilter) {
      filtered = filtered.filter((gap: AssessorGap) => {
        return gap.identifiedGaps?.some(
          (identifiedGap: AssessorIdentifiedGap) =>
            identifiedGap.status?.toLowerCase() ===
            gapStatusFilter.toLowerCase()
        );
      });
    }

    setFilteredAssessorGaps(filtered);
  };

  // Handle search term change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle device type filter change
  const handleDeviceTypeChange = (value: string) => {
    setDeviceTypeFilter(value);
  };

  // Handle gap status filter change
  const handleGapStatusChange = (value: string) => {
    setGapStatusFilter(value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDeviceTypeFilter("");
    setGapStatusFilter("");
  };

  // Apply filters whenever search term or filters change
  useEffect(() => {
    filterAssessorGaps();
  }, [searchTerm, deviceTypeFilter, gapStatusFilter, assessorGaps]);

  const onFileUploadGaps = async (
    event: React.ChangeEvent<HTMLInputElement>,
    currentQuestionId: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const handleUpload = async (file: File) => {
        try {
          const response = await getSignedUrlAPI(
            axiosInstance,
            file.name,
            file.type,
            selectedProject?._id || ""
          );

          const signedUrl = response.data?.signedUrl;
          const uploadedUrl = response.data?.fileUrl;

          if (!signedUrl || !uploadedUrl) {
            throw new Error("Missing signed URL or file URL from response.");
          }

          const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!uploadResponse.ok) {
            throw new Error(
              `Failed to upload file to S3: ${uploadResponse.statusText}`
            );
          }

          // Find the question to get its evidenceReference
          const currentQuestion = questions.find(q => q._id === currentQuestionId);
          const evidenceCategory = currentQuestion?.evidenceReference || 'document';
          const testingProcedure = currentQuestion?.testingProcedure || '';

          const newEvidence = {
            name: file.name,
            type: file.type,
            url: uploadedUrl,
            questionId: currentQuestionId,
            evidenceCategory,
            testingProcedure
          };
          await uploadEvidence(
            axiosInstance,
            selectedTask?._id || "",
            newEvidence
          );
        } catch (error) {
          console.error("Upload failed:", error);
        }
      };
      handleUpload(file);

      const userResponseToStore = {
        questionId: currentQuestionId,
        choiceValue: [file.name],
        assessmentId,
      };

      await storeUserResponse(
        userLogin ?? "",
        axiosInstance,
        userResponseToStore
      );
    }
    // Reset input so same file can be re-selected later if needed
    event.target.value = "";
  };

  const handleFileSelect = (questionId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const dt = new DataTransfer();
    dt.items.add(file);

    const inputEl = inputRefs.current[questionId];
    if (inputEl) {
      inputEl.files = dt.files;
      const fakeEvent = {
        target: inputEl,
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileUploadGaps(fakeEvent, questionId);
    }

    const newFile: UploadedFile = {
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      date: new Date().toLocaleDateString("en-GB"),
    };

    setUploadedFiles((prev) => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), newFile],
    }));
  };

  const handleFileRemove = async (questionId: string, fileId: number) => {
    await deleteEvidenceGap(axiosInstance, assessmentId, questionId);

    setUploadedFiles((prev) => ({
      ...prev,
      [questionId]:
        prev[questionId]?.filter((file) => file.id !== fileId) || [],
    }));
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    questionId: string
  ) => {
    e.preventDefault();
    setDragStates((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleDragLeave = (
    e: React.DragEvent<HTMLDivElement>,
    questionId: string
  ) => {
    e.preventDefault();
    setDragStates((prev) => ({ ...prev, [questionId]: false }));
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    questionId: string
  ) => {
    e.preventDefault();
    setDragStates((prev) => ({ ...prev, [questionId]: false }));
    const files = e.dataTransfer.files;
    handleFileSelect(questionId, files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleImagePreview = async (img: Question) => {
    try {
      const res = await getSignedUrlAPIForRead(
        axiosInstance,
        img.name,
        project?._id as string
      );

      console.log("res", res);
      const url = res?.data;
      if (url) {
        setSelectedImage(url);
        setSelectedImageName(img.name);
        setIsModalOpen(true);
        setPreviewImageUrl(url);
      }
    } catch (err) {
      console.error("Preview fetch failed", err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedImageName("");
  };

  const handleViewProject = (project: Project) => {
    dispatch(setSelectedProject(project));

    if (project?.currentAuditStage == "assessment") {
      navigate("/landing/assessor-qstnr");
    } else if (project.currentAuditStage == "gapandRemediation") {
      navigate("/landing/assessor-gaps");
    }
  };

  const fetchRevise = async () => {
    const response = await fetchAssessorRevises(
      axiosInstance,
      project.id,
      loginUser?.email as string,
      assessmentId
    );

    if (response && response.length > 0) {
      dispatch(setReviseQstnObject(response[0]));
      setReviseQstn(response[0].matchedQuestions);
    }
  };

  // Evidence Resolution Functions
  const getGapWithMatchingQuestion = (
    data: ReviseQstnObject | null,
    selectedQuestionId: string
  ): GapWithQuestion | null => {
    if (!data || !selectedQuestionId) return null;

    const matchedQuestion = data.matchedQuestions?.find(
      (q) => q._id === selectedQuestionId
    );
    if (!matchedQuestion) return null;

    let matchedGap = data.identifiedGaps?.find((gap) =>
      (gap.oldEvidence || []).some((ev) => ev.questionId === selectedQuestionId)
    );

    if (!matchedGap) {
      matchedGap = data.identifiedGaps?.find((gap) =>
        (gap.evidences || []).some((ev) => ev.questionId === selectedQuestionId)
      );
    }

    if (!matchedGap) return null;

    const filteredOldEvidence = (matchedGap.oldEvidence || []).filter(
      (ev) => ev.questionId === selectedQuestionId
    );
    const filteredEvidences = (matchedGap.evidences || []).filter(
      (ev) => ev.questionId === selectedQuestionId
    );

    return {
      question: matchedQuestion,
      gap: {
        ...matchedGap,
        oldEvidence: filteredOldEvidence,
        evidences: filteredEvidences,
      },
    };
  };

  const handleSubmitResolution = async (
    resolution: string,
    selectedReviseQstnId: string,
    reviseQstnObject: ReviseQstnObject | null
  ) => {
    try {
      const response = await submitResolutionComment(
        axiosInstance,
        project?.id as string,
        reviseQstnObject?.controlNo || "",
        selectedReviseQstnId,
        resolution
      );
      console.log("Resolution submitted:", response);
      return response;
    } catch (error) {
      console.error("Error submitting resolution:", error);
      throw error;
    }
  };

  const handlePreviewEvidence = async (evidenceName: string) => {
    try {
      const url = await getSignedUrlAPIForRead(
        axiosInstance,
        evidenceName,
        project._id
      );
      if (url) {
        window.open(url.data, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Failed to fetch signed URL", err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleSave = async () => {
    if (!selectedFile) {
      dispatch(
        showSnackbar({
          message: "No file selected to upload.",
          severity: "warning",
        })
      );
      return;
    }

    setIsUploading(true);
    try {
      const response = await getAssessmentSignedUploadUrl(
        axiosInstance,
        selectedFile.name,
        selectedFile.type
      );

      const signedUrl = response.data?.signedUrl;
      const uploadedUrl = response.data?.fileUrl;

      if (!signedUrl || !uploadedUrl) {
        throw new Error("Missing signed URL or file URL from response.");
      }

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error(
          `Failed to upload file to S3: ${uploadResponse.statusText}`
        );
      }

      // Get evidence category from the first matched question's evidence reference
      const firstQuestion = reviseQstnObject?.matchedQuestions?.[0];
      const evidenceCategory = firstQuestion?.evidenceReference || 'document';

      const data: EvidenceType = {
        name: selectedFile.name,
        type: selectedFile.type,
        url: uploadedUrl,
        questionId: "new",
        evidenceCategory,
        refName: "",
      };

      const res = await uploadNewEvidence(
        axiosInstance,
        reviseQstnObject.controlNo || "",
        reviseQstnObject.deviceRef || "",
        [data]
      );

      if (res) {
        try {
          const previewRes = await getSignedUrlAssessment(
            axiosInstance,
            data.name
          );
          const previewUrl = previewRes.data;

          const updatedData = { ...data, url: previewUrl };

          dispatch(setSelectedEvidencesAction([...documents, updatedData]));
          dispatch(
            showSnackbar({
              message: "Document uploaded successfully!",
              severity: "success",
            })
          );
          navigate("/landing/AsssessorRevise");
          // Clear selected file after successful upload
          setSelectedFile(null);
        } catch (error) {
          console.error("Error fetching signed URL after upload:", error);
          dispatch(
            showSnackbar({
              message: "Document uploaded, but preview failed.",
              severity: "warning",
            })
          );
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      dispatch(
        showSnackbar({
          message: "Failed to upload document.",
          severity: "error",
        })
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return {
    complianceType,
    setComplianceType,
    activeTab,
    setActiveTab,
    handleComplianceChange,
    handleClearFilters,
    currentTab,
    setCurrentTab,
    handleQstnrChange,
    project,
    navigate,
    dispatch,
    handleViewQSTNR,
    handleSubmit,
    loginUser,
    auditTasks,
    setAuditTasks,
    auditTask,
    selectedProject,
    axiosInstance,
    onFileUploadGaps,
    questions,
    setQuestions,
    uploadedFiles,
    setUploadedFiles,
    dragStates,
    setDragStates,
    isSubmitDisabled,
    setIsSubmitDisabled,
    previewImageUrl,
    setPreviewImageUrl,
    setSelectedAssesmentId,
    submitted,
    setSubmitted,
    selectedImage,
    setSelectedImage,
    selectedImageName,
    setSelectedImageName,
    isModalOpen,
    setIsModalOpen,
    inputRefs,
    EvidenceUploaded,
    setEvidencesUploaded,
    handleFileSelect,
    handleFileRemove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    formatFileSize,
    handleImagePreview,
    closeModal,
    handleViewProject,
    AssessorGaps,
    assessorGaps,
    assessmentId,
    reviseQstn,
    fetchRevise,
    getGapWithMatchingQuestion,
    handleSubmitResolution,
    handlePreviewEvidence,
    searchTerm,
    handleSearchChange,
    deviceTypeFilter,
    handleDeviceTypeChange,
    gapStatusFilter,
    handleGapStatusChange,
    clearFilters,
    filteredAssessorGaps,
    handleSave,
    resolution,
    setResolution,
    selectedFile,
    setSelectedFile,
    isUploading,
    fileInputRef,
    handleFileChange,
    handleBoxClick,
  };
};
export default useAssessor;
