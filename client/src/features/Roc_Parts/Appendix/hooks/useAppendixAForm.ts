// hooks/useAppendixAForm.ts - WITH DISCARD FUNCTION
import { useState, useEffect } from "react";
import { MergedPCIDSSData, AppendixMergedControl } from "../../Part_2/types";
import {
  AppendixPayload,
  createAppendixA,
  getAppendixAControl,
} from "../../../../api/partOne";
import { RootState, useAppSelector } from "../../../../redux/store";
import useAxios from "../../../../api/useAxios";
import { useDispatch } from "react-redux";
import { markAsClean, markAsDirty } from "../../../../redux/rocSlice";

export interface AssessorResponseDto {
  id: number;
  comment?: string;
  evidenceCategory?: string;
  refName?: string;
  reportingInstructionId: string;
}

export interface AppendixA {
  title: string;
  assessmentFinding:
    | "In Place"
    | "Not Applicable"
    | "Not Tested"
    | "Not in Place";
  compensatingControl: boolean;
  customizedApproach: boolean;
  assessmentFindingDesc: string;
  assessorResponse: AssessorResponseDto[];
}

export interface SnackbarState {
  open: boolean;
  message: string;
  type: "success" | "error" | "info";
}

interface useAppendixAFormReturn {
  formData: { [controlId: string]: AppendixA };
  updateFormData: (
    controlId: string,
    field: keyof Omit<AppendixA, "assessorResponse">,
    value: string | boolean
  ) => void;
  updateOrCreateAssessorResponse: (
    controlId: string,
    reportingInstructionId: string,
    responseIndex: number,
    field: keyof AssessorResponseDto,
    value: string
  ) => void;
  handleSubmit: () => void;
  resetForm: () => void;
  discardChanges: () => void; // NEW: Discard changes function
  getControlFormData: (controlId: string) => AppendixA | undefined;
  setControlFormData: (controlId: string, data: Partial<AppendixA>) => void;
  hasChanges: boolean;
  snackbar: SnackbarState;
  closeSnackbar: () => void;
}

// Helper function to create initial data
function createInitialData(data: MergedPCIDSSData): {
  [controlId: string]: AppendixA;
} {
  const initialData: { [controlId: string]: AppendixA } = {};

  data.requirements.forEach((requirement) => {
    requirement.subReq.forEach((subReq) => {
      subReq.controls.forEach((control) => {
        const initialAssessorResponses: AssessorResponseDto[] = [];
        let responseId = 1;

        if (control.testingProcedures && control.testingProcedures.length > 0) {
          control.testingProcedures.forEach((proc) => {
            if (
              proc.reportingInstructions &&
              proc.reportingInstructions.length > 0
            ) {
              proc.reportingInstructions.forEach((instruction, instrIndex) => {
                const uniqueResponseId = `${proc.id}_${instrIndex}`;

                initialAssessorResponses.push({
                  id: responseId++,
                  comment: "",
                  evidenceCategory: instruction.evidenceReference || "",
                  refName: "",
                  reportingInstructionId: uniqueResponseId,
                });
              });
            }
          });
        }

        initialData[control.title] = {
          title: control.title || "",
          assessmentFinding: "In Place",
          compensatingControl: false,
          customizedApproach: false,
          assessmentFindingDesc: "",
          assessorResponse: initialAssessorResponses,
        };
      });
    });
  });

  return initialData;
}

export const useAppendixAForm = (
  data: MergedPCIDSSData,
  expandedControls?: AppendixMergedControl
): useAppendixAFormReturn => {
  const [formData, setFormData] = useState<{ [controlId: string]: AppendixA }>(
    {}
  );
  const [initialFormData, setInitialFormData] = useState<{
    [controlId: string]: AppendixA;
  }>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    type: "info",
  });

  const selectedProjectId = useAppSelector(
    (state: RootState) => state.projectView.selectedProject?._id
  );

  const selectedControl = useAppSelector(
    (state: RootState) => state.complianceReport.selectedControl
  );

  const axios = useAxios();
  const dispatch = useDispatch();

  // Initialize form data when component mounts or data changes
  useEffect(() => {
    if (Object.keys(formData).length === 0) {
      const initialData = createInitialData(data);
      setFormData(initialData);
      setInitialFormData(JSON.parse(JSON.stringify(initialData)));
      setHasChanges(false);
    }
  }, [data, formData]);

  // Load existing data when selectedControl changes
  useEffect(() => {
    const loadExistingData = async () => {
      if (selectedControl && selectedProjectId) {
        try {
          const response = await getAppendixAControl(
            selectedProjectId,
            selectedControl.title,
            axios
          );

          if (response.data) {
            const existingData = response.data;
            const controlData = {
              title: selectedControl.title,
              assessmentFinding: existingData.assessmentFinding || "In Place",
              compensatingControl: existingData.compensatingControl || false,
              customizedApproach: existingData.customizedApproach || false,
              assessmentFindingDesc: existingData.assessmentFindingDesc || "",
              assessorResponse: existingData.assessorResponse || [],
            };

            setFormData((prev) => ({
              ...prev,
              [selectedControl.title]: controlData,
            }));
            
            setInitialFormData((prev) => ({
              ...prev,
              [selectedControl.title]: JSON.parse(JSON.stringify(controlData)),
            }));
          }
        } catch (error) {
          console.error("Error loading existing data:", error);
        }
      }
    };

    loadExistingData();
  }, [selectedControl, selectedProjectId, axios]);

  // Update form data when expandedControls changes
  useEffect(() => {
    if (expandedControls && expandedControls.title) {
      if (!formData[expandedControls.title]) {
        const newControlData = {
          title: expandedControls.title || "",
          assessmentFinding: expandedControls.assessmentFinding || "In Place",
          compensatingControl: expandedControls.compensatingControl || false,
          customizedApproach: expandedControls.customizedApproach || false,
          assessmentFindingDesc: expandedControls.assessmentFindingDesc || "",
          assessorResponse: [],
        };

        setFormData((prev) => ({
          ...prev,
          [expandedControls.title]: newControlData,
        }));

        setInitialFormData((prev) => ({
          ...prev,
          [expandedControls.title]: JSON.parse(JSON.stringify(newControlData)),
        }));
      }
    }
  }, [expandedControls, formData]);

  // Check if form has changes
  useEffect(() => {
    if (selectedControl && selectedControl.title) {
      const currentData = formData[selectedControl.title];
      const initialData = initialFormData[selectedControl.title];
      
      if (currentData && initialData) {
        const hasFormChanges = JSON.stringify(currentData) !== JSON.stringify(initialData);
        setHasChanges(hasFormChanges);

        if (hasFormChanges) {
          dispatch(markAsDirty());
        } else {
          dispatch(markAsClean());
        }
      } else {
        setHasChanges(false);
        dispatch(markAsClean());
      }
    } else {
      setHasChanges(false);
      dispatch(markAsClean());
    }
  }, [formData, initialFormData, selectedControl, dispatch]);

  // Show snackbar
  const showSnackbar = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => {
      closeSnackbar();
    }, 1500);
  };

  // Close snackbar
  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // NEW: Discard changes function
  const discardChanges = () => {
    if (selectedControl && selectedControl.title) {
      const initialData = initialFormData[selectedControl.title];
      if (initialData) {
        setFormData((prev) => ({
          ...prev,
          [selectedControl.title]: JSON.parse(JSON.stringify(initialData)),
        }));
      }
    }
    setHasChanges(false);
    dispatch(markAsClean());
    showSnackbar("Changes discarded", "info");
  };

  // Update form data for a specific control
  const updateFormData = (
    controlId: string,
    field: keyof Omit<AppendixA, "assessorResponse">,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const existingControlData = prev[controlId] || {
        title: "",
        assessmentFinding: "In Place" as const,
        compensatingControl: false,
        customizedApproach: false,
        assessmentFindingDesc: "",
        assessorResponse: [],
      };

      return {
        ...prev,
        [controlId]: {
          ...existingControlData,
          [field]: value,
        },
      };
    });
  };

  // Update or create assessor response
  const updateOrCreateAssessorResponse = (
    controlId: string,
    procedureId: string,
    responseIndex: number,
    field: keyof AssessorResponseDto,
    value: string
  ) => {
    const uniqueResponseId = `${procedureId}_${responseIndex}`;

    setFormData((prev) => {
      const existingControlData = prev[controlId] || {
        title: controlId,
        assessmentFinding: "In Place" as const,
        compensatingControl: false,
        customizedApproach: false,
        assessmentFindingDesc: "",
        assessorResponse: [],
      };

      const currentResponses = [...existingControlData.assessorResponse];
      const existingResponseIndex = currentResponses.findIndex(
        (response) => response.reportingInstructionId === uniqueResponseId
      );

      if (existingResponseIndex !== -1) {
        currentResponses[existingResponseIndex] = {
          ...currentResponses[existingResponseIndex],
          [field]: value,
        };
      } else {
        const newResponse: AssessorResponseDto = {
          id: currentResponses.length + 1,
          comment: "",
          evidenceCategory: "",
          refName: "",
          reportingInstructionId: uniqueResponseId,
          [field]: value,
        };
        currentResponses.push(newResponse);
      }

      const updatedControlData = {
        ...existingControlData,
        assessorResponse: currentResponses,
      };

      return {
        ...prev,
        [controlId]: updatedControlData,
      };
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedProjectId || !selectedControl) {
      showSnackbar("Missing project or control context", "error");
      return;
    }

    const controlId = selectedControl.title;
    const controlData = formData[controlId];

    if (!controlData) {
      showSnackbar("No data found for selected control", "error");
      return;
    }

    const controlAnswer: AppendixA = {
      title: controlData.title,
      assessmentFinding: controlData.assessmentFinding,
      compensatingControl: controlData.compensatingControl,
      customizedApproach: controlData.customizedApproach,
      assessmentFindingDesc: controlData.assessmentFindingDesc,
      assessorResponse: controlData.assessorResponse,
    };

    const payload: AppendixPayload = {
      projectId: selectedProjectId,
      controls: [controlAnswer],
    };

    try {
      await createAppendixA(payload, axios);
      
      setInitialFormData((prev) => ({
        ...prev,
        [controlId]: JSON.parse(JSON.stringify(controlData)),
      }));
      
      setHasChanges(false);
      dispatch(markAsClean());
      showSnackbar("Data submitted successfully!", "success");
    } catch (err) {
      console.error("Error submitting data:", err);
      showSnackbar("Failed to submit data", "error");
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    const initialData = createInitialData(data);
    setFormData(initialData);
    setInitialFormData(JSON.parse(JSON.stringify(initialData)));
    setHasChanges(false);
    dispatch(markAsClean());
    showSnackbar("Form has been reset", "info");
  };

  // Get form data for a specific control
  const getControlFormData = (controlId: string): AppendixA | undefined => {
    return formData[controlId];
  };

  // Set form data for a specific control
  const setControlFormData = (controlId: string, data: Partial<AppendixA>) => {
    setFormData((prev) => ({
      ...prev,
      [controlId]: {
        ...prev[controlId],
        ...data,
      },
    }));
  };

  return {
    formData,
    updateFormData,
    updateOrCreateAssessorResponse,
    handleSubmit,
    resetForm,
    discardChanges, // NEW: Export discard function
    getControlFormData,
    setControlFormData,
    hasChanges,
    snackbar,
    closeSnackbar,
  };
};