import { useEffect, useState } from 'react';
import { RootState, useAppSelector } from '../../../../redux/store';
import useAxios from '../../../../api/useAxios';
import { createAppendixC, getAppendix } from '../../../../api/partOne';
import { useDispatch } from "react-redux";
import { markAsClean, markAsDirty } from "../../../../redux/rocSlice";

export interface AppendixCFormData {
  requirementNumber: string;
  requirementDefinition: string;
  constraints: string;
  compensatingControlsDefinition: string;
  originalObjective: string;
  compensatingObjective: string;
  identifiedRisk: string;
  validationMethod: string;
  maintenanceProcess: string;
}

const initialData: AppendixCFormData = {
  requirementNumber: '',
  requirementDefinition: '',
  constraints: '',
  compensatingControlsDefinition: '',
  originalObjective: '',
  compensatingObjective: '',
  identifiedRisk: '',
  validationMethod: '',
  maintenanceProcess: '',
};

export const useAppendixCForm = () => {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const selectedProjectId = useAppSelector(
    (state: RootState) => state.projectView.selectedProject?._id
  );
    const [initialFormData, setInitialFormData] =
      useState<AppendixCFormData>(initialData);
    const [isDirty, setIsDirty] = useState(false);
  
    const deepEqual = (
      a: AppendixCFormData,
      b: AppendixCFormData
    ): boolean => JSON.stringify(a) === JSON.stringify(b);
  
  const axiosInstance = useAxios();

  const handleInputChange = (field: keyof AppendixCFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  function fetchFormData() {
    if (selectedProjectId) {
      getAppendix(selectedProjectId, "appendix-c", axiosInstance)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedProjectId) {
        await createAppendixC(formData, selectedProjectId, axiosInstance);
        setInitialFormData(formData);
        setSnackbar({ open: true, message: "Appendix C saved successfully!", severity: 'success' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({ open: true, message: "Error saving Appendix C.", severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const isFormValid = () => {
    return formData.requirementNumber.trim() !== '' &&
           formData.constraints.trim() !== '' &&
           formData.compensatingControlsDefinition.trim() !== '';
  };

  
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
