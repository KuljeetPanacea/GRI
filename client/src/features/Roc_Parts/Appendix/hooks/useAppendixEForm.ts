import { useEffect, useState } from "react";
import { RootState, useAppSelector } from "../../../../redux/store";
import useAxios from "../../../../api/useAxios";
import { createAppendixE, getAppendix } from "../../../../api/partOne";
import { useDispatch } from "react-redux";
import { markAsClean, markAsDirty } from "../../../../redux/rocSlice";

// Form data interface (unchanged)
export interface AppendixEFormData {
  requirementNumber: string;
  requirementDefinition: string;
  customizedControlName: string;
  controlDescription: string;
  objectiveMeeting: string;
  controlsMatrixDocumentation: string;
  targetedRiskAnalysis: string;
  assessorNames: string;
  testingProcedure1: string;
  whatTested1: string;
  evidenceExamined1: string;
  testingResults1: string;
  testingProcedure2: string;
  whatTested2: string;
  evidenceExamined2: string;
  testingResults2: string;
}

// Initial form state (unchanged)
const initialData: AppendixEFormData = {
  requirementNumber: "",
  requirementDefinition: "",
  customizedControlName: "",
  controlDescription: "",
  objectiveMeeting: "",
  controlsMatrixDocumentation: "",
  targetedRiskAnalysis: "",
  assessorNames: "",
  testingProcedure1: "",
  whatTested1: "",
  evidenceExamined1: "",
  testingResults1: "",
  testingProcedure2: "",
  whatTested2: "",
  evidenceExamined2: "",
  testingResults2: "",
};

export const useAppendixEForm = () => {
  const [formData, setFormData] = useState<AppendixEFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [initialFormData, setInitialFormData] =
    useState<AppendixEFormData>(initialData);
  const [isDirty, setIsDirty] = useState(false);

  const deepEqual = (a: AppendixEFormData, b: AppendixEFormData): boolean =>
    JSON.stringify(a) === JSON.stringify(b);

  const selectedProjectId = useAppSelector(
    (state: RootState) => state.projectView.selectedProject?._id
  );
  const axiosInstance = useAxios();

  const handleInputChange = (field: keyof AppendixEFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  function fetchFormData() {
    if (selectedProjectId) {
      getAppendix(selectedProjectId, "appendix-e", axiosInstance)
        .then((response) => {
          if (response.data) {
            setFormData(response.data);
            setInitialFormData(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching form data:", error);
        });
    }
  }

  useEffect(() => {
    fetchFormData();
  }, []);

  
    const dispatch = useDispatch();
  
    useEffect(() => {
      const dirty = !deepEqual(formData, initialFormData);
      setIsDirty(dirty);
  
      if (dirty) {
        dispatch(markAsDirty());
      } else {
        dispatch(markAsClean());
      }
    }, [formData, initialFormData, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedProjectId) {
        await createAppendixE(formData, selectedProjectId, axiosInstance);
        setInitialFormData(formData);
        setSnackbar({
          open: true,
          message: "Appendix E saved successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbar({
        open: true,
        message: "Error saving Appendix E.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const isFormValid = () => {
    return (
      formData.requirementNumber.trim() !== "" &&
      formData.customizedControlName.trim() !== "" &&
      formData.controlDescription.trim() !== ""
    );
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
    isFormValid,
    snackbar,
    handleClose,
    isDirty
  };
};
