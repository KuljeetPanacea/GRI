// useComplianceReportView.ts
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../../../redux/store";
import {
  setSelectedReq,
  setSelectedSubReq,
  setSelectedControl,
  togglePageEdit,
  setVariables,
  resetChanges,
  setIsChanged,
  SubRequirement,
} from "../../../../redux/complianceReportSlice";
import { markAsClean, markAsDirty } from "../../../../redux/rocSlice"; // Import ROC actions
import data, { Requirement, Requirements } from "./reqConfig";
import {
  ControlStructure,
  ControlAnswer,
  MergedControl,
  AppendixA,
  AppendixMergedControl,
} from "../../../Roc_Parts/Part_2/types";
import { getAppendixAControl } from "../../../../api/partOne";
import useAxios from "../../../../api/useAxios";
import { getControlData } from "../../../../api/partTwo";
import { AxiosInstance, AxiosError } from "axios";

// Snackbar state interface
interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

// Move these utility functions to the hook

// Utility function to check if error is an AxiosError
const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError)?.isAxiosError === true;
};

// Utility function to get error message from unknown error
const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    if (error.response?.status === 500) {
      return "No data found for this control.";
    } else if (error.response?.status === 404 || !error.response) {
      return "Server error occurred. Please try again later.";
    } else {
      return "Failed to fetch control data. Please try again.";
    }
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "An unexpected error occurred. Please try again.";
  }
};

const fetchAnswersFromDB = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  controlId: string
): Promise<ControlAnswer | null> => {
  try {
    const res = await getControlData(axiosInstance, projectId, controlId);
    console.log("vvvvvvvvvvvvvv", res);
    return res;
  } catch (err: unknown) {
    console.error("DB fetch error:", err);
    throw new Error(getErrorMessage(err));
  }
};

const mergeAppendixControlData = (structure: ControlStructure, answer: AppendixA | null): AppendixMergedControl => {
  console.log("Merging appendix control data:", { structure, answer });
  
  const merged = {
    ...structure,
    assessmentFinding: answer?.assessmentFinding,
    compensatingControl: answer?.compensatingControl,
    customizedApproach: answer?.customizedApproach,
    assessmentFindingDesc: answer?.assessmentFindingDesc,
    assessorResponse: answer?.assessorResponse || [],
  };
  
  console.log("Merged result:", merged);
  return merged;
};

const mergeControlData = (
  structure: ControlStructure,
  answer: ControlAnswer | null
): MergedControl => {
  return {
    ...structure,
    controlAssessmentFinding: answer?.controlAssessmentFinding,
    compensatingControl: answer?.compensatingControl,
    customizedApproach: answer?.customizedApproach,
    detailed_finding: answer?.detailed_finding,
    evidences: answer?.evidences,
  };
};

export const useComplianceReportView = () => {
  const dispatch = useDispatch();
  const {
    selectedReq,
    selectedSubReq,
    selectedControl,
    pageEdit,
    variables,
    isChanged,
  } = useSelector((state: RootState) => state.complianceReport);

  const [mergedControl, setMergedControl] = useState<MergedControl | AppendixMergedControl | null>(
    null
  );
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // State for managing expanded requirements - MOVED FROM COMPONENT
  const [expandedReqs, setExpandedReqs] = useState<number[]>([]);
  const [expandedSubReqs, setExpandedSubReqs] = useState<number[]>([]);
  
  // NEW: Unsaved changes modal state
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // NEW: Snackbar state
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Get both types of unsaved changes
  const rocHasUnsavedChanges = useAppSelector(
    (state: RootState) => state.roc.hasUnsavedChanges
  );
  const complianceReportHasChanges = useSelector(
    (state: RootState) => state.complianceReport.isChanged
  );
  
  // Unified change detection - check both states
  const hasUnsavedChanges = rocHasUnsavedChanges || complianceReportHasChanges;
  
  const axios = useAxios();
  const selectedProjectId = useAppSelector(
    (state: RootState) => state.projectView.selectedProject?._id
  );

  // NEW: Snackbar helper functions
  const showSnackbar = useCallback((message: string, severity: 'error' | 'warning' | 'info' | 'success' = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  }, []);

  const hideSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const getAppendixControlData = useCallback(async (
    selectedControl: ControlStructure
  ): Promise<AppendixA | null> => {
    try {
      if (selectedProjectId && selectedControl?.title) {
        const response = await getAppendixAControl(
          selectedProjectId,
          selectedControl.title,
          axios
        );
        console.log("Fetched appendix control ✨", response);
        
        // If response.data exists, map it to AppendixA format
        if (response.data) {
          const apiData = response.data;
          console.log("API Data:", apiData);
          console.log("Assessor Response:", apiData.assessorResponse);
          
          return {
            title: selectedControl.title,
            assessmentFinding: apiData.assessmentFinding || "In Place",
            compensatingControl: apiData.compensatingControl || false,
            customizedApproach: apiData.customizedApproach || false,
            assessmentFindingDesc: apiData.assessmentFindingDesc || "",
            assessorResponse: apiData.assessorResponse || []
          };
        }
      }
    } catch (error: unknown) {
      console.error("Error fetching appendix control data:", error);
      
      // Handle specific error cases
      if (isAxiosError(error)) {
        if (error.response?.status === 500) {
          showSnackbar("Server error occurred while fetching appendix data. Please try again later.", 'error');
        } else if (error.response?.status === 404 || !error.response) {
          showSnackbar("No data found for this appendix control.", 'warning');
        } else {
          showSnackbar("Failed to fetch appendix control data. Please try again.", 'error');
        }
      } else {
        showSnackbar("An unexpected error occurred while fetching appendix data.", 'error');
      }
    }
    return null;
  }, [selectedProjectId, axios, showSnackbar]);

  // NEW: Function to check if navigation should be blocked
  const shouldBlockNavigation = () => {
    return hasUnsavedChanges;
  };

  // NEW: Function to handle navigation with unsaved changes check
  const handleNavigationWithCheck = (action: () => void) => {
    if (shouldBlockNavigation()) {
      setPendingAction(() => action);
      setShowUnsavedModal(true);
    } else {
      action();
    }
  };

  // NEW: Handle modal actions
  const handleModalSave = async () => {
    setIsSaving(true);
    try {
      await handleSave();
      if (pendingAction) {
        pendingAction();
      }
      setShowUnsavedModal(false);
      setPendingAction(null);
      showSnackbar("Changes saved successfully!", 'success');
    } catch (error) {
      console.error("Error saving changes:", error);
      showSnackbar("Failed to save changes. Please try again.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalDiscard = () => {
    // Clear both types of changes
    dispatch(markAsClean()); // Clear ROC changes
    dispatch(resetChanges()); // Clear compliance report changes
    if (pendingAction) {
      pendingAction();
    }
    setShowUnsavedModal(false);
    setPendingAction(null);
    showSnackbar("Changes discarded", 'info');
  };

  const handleModalCancel = () => {
    setShowUnsavedModal(false);
    setPendingAction(null);
  };

  // Initialize the first part and requirement
  useEffect(() => {
    // Set the first part (part1) as default
    const firstPartKey = Object.keys(data)[0]; 
    setSelectedPart(firstPartKey);

    // Set the first requirement from part1
    const firstPart = data[firstPartKey as keyof typeof data];
    if (
      firstPart &&
      firstPart.requirements &&
      firstPart.requirements.length > 0
    ) {
      const safeReq = {
        ...firstPart.requirements[0],
        id: firstPart.requirements[0].id,
        subReq:
          firstPart.requirements[0].subReq?.map((sub) => ({
            ...sub,
            id: sub.id,
            controls: (sub.controls ?? []).map((control) => ({
              ...control,
              controlId: String(control.id),
              controlTitle: control.title,
            })),
          })) ?? [],
      };
      dispatch(setSelectedReq(safeReq));
    }
  }, [dispatch]);

  // Handle merged control logic
  useEffect(() => {
    const getMergedControl = async () => {
      if (!selectedControl) {
        setMergedControl(null);
        return;
      }

      // Search for the control across all parts and requirements
      let structure: ControlStructure | undefined;

      for (const partKey in data) {
        const part = data[partKey as keyof typeof data];
        if (part && part.requirements) {
          structure = part.requirements
            .flatMap((r) => r.subReq || [])
            .flatMap((s) => s?.controls || [])
            .find(
              (ctrl) => String(ctrl?.title) === String(selectedControl.title)
            );

          if (structure) break;
        }
      }

      if (!structure) {
        setMergedControl(null);
        return;
      }

      try {
        if (selectedControl.title.startsWith("A")) {
          const answer = await getAppendixControlData(selectedControl);
          const merged = mergeAppendixControlData(structure, answer);
          setMergedControl(merged);
          return;
        } else {
          if (selectedProjectId) {
            const answer = await fetchAnswersFromDB(axios, selectedProjectId, selectedControl.title);
            const merged = mergeControlData(structure, answer);
            setMergedControl(merged);
          }
        }
      } catch (error: unknown) {
        console.error("Error in getMergedControl:", error);
        if (error instanceof Error) 
        showSnackbar(error.message || "Failed to load control data", 'error');
        // Set merged control with structure only, without API data
        setMergedControl(structure as MergedControl);
      }
    };

    getMergedControl();
  }, [selectedControl, selectedProjectId, axios, getAppendixControlData, showSnackbar]);

  // Get current requirements based on selected part
  const getCurrentRequirements = () => {
    if (!selectedPart) return [];
    const partKey = selectedPart;
    return (
      (data as Requirements)[partKey as keyof typeof data]?.requirements || []
    );
  };

  // Toggle requirement expansion 
  const toggleReqExpansion = (reqId: number) => {
    setExpandedReqs((prev) =>
      prev.includes(reqId)
        ? prev.filter((id) => id !== reqId)
        : [...prev, reqId]
    );
  };

  // Toggle sub-requirement expansion 
  const toggleSubReqExpansion = (subReqId: number) => {
    setExpandedSubReqs((prev) =>
      prev.includes(subReqId)
        ? prev.filter((id) => id !== subReqId)
        : [...prev, subReqId]
    );
  };

  // Handle requirement click with expansion and unsaved changes check
  const handleReqClickWithExpansion = (req: Requirement) => {
    const action = () => {
      handleReqClick(req);
      dispatch(setSelectedSubReq(null));
      dispatch(setSelectedControl(null));
      setExpandedReqs([]);
      setExpandedSubReqs([]);
      // Only toggle expansion if requirement has sub-requirements
      if (hasSubRequirements(req)) {
        toggleReqExpansion(req.id);
      }
    };
    
    handleNavigationWithCheck(action);
  };

  // Handle sub-requirement click with expansion and unsaved changes check
  const handleSubReqClickWithExpansion = (subReq: SubRequirement) => {
    const action = () => {
      handleSubReqClick(subReq);
      if (hasControls(subReq)) {
        setExpandedSubReqs((prev) => (prev.includes(subReq.id) ? [] : [subReq.id]));
      } else {
        setExpandedSubReqs([]);
      }
    };
    
    handleNavigationWithCheck(action);
  };

  // UPDATED: Handle part click with unsaved changes check
  const handlePartClick = (partKey: string) => {
    const action = () => {
      setSelectedPart(partKey);
      dispatch(setSelectedReq(null));
      dispatch(setSelectedSubReq(null));
      dispatch(setSelectedControl(null));
      setExpandedReqs([]);
      setExpandedSubReqs([]);
    };
    
    handleNavigationWithCheck(action);
  };

  // Handle control click with unsaved changes check
  const handleControlClick = (control: ControlStructure) => {
    const action = () => {
      dispatch(setSelectedControl(control));
    };
    
    handleNavigationWithCheck(action);
  };

  const handleSubReqClick = (sub: SubRequirement) => {
    if (selectedSubReq?.id === sub.id) {
      dispatch(setSelectedSubReq(null));
      dispatch(setSelectedControl(null));
    } else {
      dispatch(setSelectedSubReq({ ...sub, controls: sub.controls ?? [] }));
      dispatch(setSelectedControl(null));
    }
  };

  const handleReqClick = (req: Requirement) => {
    // If requirement has no sub-requirements, handle it directly
    if (!hasSubRequirements(req)) {
      const transformedReq: Requirement = {
        ...req,
        id: req.id,
        subReq: [],
      };
      dispatch(setSelectedReq(transformedReq));
      // Clear sub-req and control selections since this requirement doesn't have them
      dispatch(setSelectedSubReq(null));
      dispatch(setSelectedControl(null));
      setExpandedSubReqs([]);
      setExpandedReqs(
        (prev) => (prev.includes(req.id) ? prev : [req.id]) // only keep current req expanded
      );
      return;
    }

    const transformedReq: Requirement = {
      ...req,
      id: req.id,
      subReq: req.subReq?.map((sub: SubRequirement) => ({
        ...sub,
        id: sub.id,
        controls: (sub.controls ?? []).map((control: ControlStructure) => ({
          ...control,
          id: Number(control.id), 
        })),
      })),
    };
    dispatch(setSelectedReq(transformedReq));
  };

  // UPDATED: Save function with both ROC and compliance report state management
  const handleSave = async () => {
    try {
      console.log("Saving variables:", variables);

      if (selectedControl) {
        console.log("Saving for control:", selectedControl.title);
      } else if (selectedSubReq && !selectedSubReq.controls) {
        console.log("Saving for subReq:", selectedSubReq.title);
      } else if (selectedReq && !hasSubRequirements(selectedReq)) {
        console.log("Saving for req:", selectedReq.reqName);
      }

      dispatch(resetChanges()); // Clear compliance report changes
      dispatch(markAsClean()); // Clear ROC changes
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const axiosError = error as { response?: { data: unknown } };
      console.error(
        "Error updating variables:",
        axiosError.response?.data || errorMessage
      );
      throw error; 
    }
  };

  // NEW: Function to mark as dirty when variables change
  const handleSetVariables = (vars: Record<string, string | number | boolean>) => {
    dispatch(setVariables(vars));
    dispatch(setIsChanged(true));
    dispatch(markAsDirty()); // Mark as dirty when changes are made
  };

  // Helper function to check if requirement has sub-requirements
  const hasSubRequirements = (req: Requirement) => {
    return req.subReq && req.subReq.length > 0;
  };

  // Helper functions for presentation logic
  const hasControls = (subReq: SubRequirement) =>
    subReq.controls && subReq.controls.length > 0;

  const isPartActive = (partKey: string) => selectedPart === partKey;
  const isReqActive = (reqId: number) => selectedReq?.id === reqId;
  const isSubReqActive = (subReqId: number) => selectedSubReq?.id === subReqId;
  const isControlActive = (controlTitle: string) =>
    selectedControl?.title === controlTitle;

  // Component mapping logic
  const getComponentKey = (title: string) => {
    const componentKeys = [
      "Contact Information",
      "Business Overview",
      "Scope of work",
      "Reviewed Environments",
      "Quarterly Scans",
      "Sampling and Evidences",
      "Appendix A3",
      "Appendix-B",
      "Appendix-C",
      "Appendix-D",
      "Appendix-E",
    ];
    return componentKeys.find((key) => key === title) || null;
  };

  // Prepare data for PCIReportView
  const getPCIReportData = () => {
    if (!selectedReq || !selectedSubReq || !selectedControl || !mergedControl) {
      return null;
    }

    return {
      requirements: [
        {
          reqId: selectedReq.id,
          reqTitle: selectedReq.reqName,
          reqDesc: selectedReq.reqDesc,
          subReq: [
            {
              subReqId: selectedSubReq.id,
              subReqTitle: selectedSubReq.title,
              subReqDesc: selectedSubReq.desc,
              controls: [mergedControl],
            },
          ],
          control: selectedControl,
        },
      ],
    };
  };

  return {
    // State
    selectedReq,
    selectedSubReq,
    selectedControl,
    selectedPart,
    pageEdit,
    variables,
    isChanged,
    mergedControl,
    data,
    expandedReqs,
    expandedSubReqs,
    
    // NEW: Unsaved changes modal state
    showUnsavedModal,
    hasUnsavedChanges,
    isSaving,

    // NEW: Snackbar state and functions
    snackbar,
    showSnackbar,
    hideSnackbar,

    // Actions
    handleSubReqClick,
    handleControlClick,
    handleReqClick,
    handlePartClick,
    handleSave,
    togglePageEdit: () => dispatch(togglePageEdit()),
    setSelectedReq: (req: Requirement) => dispatch(setSelectedReq(req)),
    setSelectedControl: (control: ControlStructure) =>
      dispatch(setSelectedControl(control)),
    setVariables: handleSetVariables,

    // NEW: Modal handlers
    handleModalSave,
    handleModalDiscard,
    handleModalCancel,

    // Expansion functions
    toggleReqExpansion,
    toggleSubReqExpansion,
    handleReqClickWithExpansion,
    handleSubReqClickWithExpansion,
    getCurrentRequirements,

    // Helper functions
    hasSubRequirements,
    hasControls,
    isPartActive,
    isReqActive,
    isSubReqActive,
    isControlActive,
    getComponentKey,
    getPCIReportData,
  };
};