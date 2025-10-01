import { useState, useCallback, useEffect } from "react";
import { RootState, useAppSelector } from "../../../../redux/store";
import { createBusinessOverview, getTypeInfo } from "../../../../api/partOne";
import useAxios from "../../../../api/useAxios";
import { AlertColor } from "@mui/material";
import { useDispatch } from "react-redux";
import { markAsClean, markAsDirty } from "../../../../redux/rocSlice";

export interface BusinessOverviewData {
  businessNatureDescription: string;
  accountDataHandlingDescription: string;
  securityImpactingServices: string;
  paymentChannels: {
    cardPresent: boolean;
    moto: boolean;
    ecommerce: boolean;
  };
  otherDetails: string;
}

export interface BusinessOverviewErrors {
  [key: string]: string | undefined;
}

const initialData: BusinessOverviewData = {
  businessNatureDescription: "",
  accountDataHandlingDescription: "",
  securityImpactingServices: "",
  paymentChannels: {
    cardPresent: false,
    moto: false,
    ecommerce: false,
  },
  otherDetails: "",
};

export const useBusinessOverview = () => {
  const [formData, setFormData] = useState<BusinessOverviewData>(initialData);
  const [errors, setErrors] = useState<BusinessOverviewErrors>({});
  const [initialFormData, setInitialFormData] =
    useState<BusinessOverviewData>(initialData);
  const [isDirty, setIsDirty] = useState(false);

  const deepEqual = (a: BusinessOverviewData, b: BusinessOverviewData): boolean => JSON.stringify(a) === JSON.stringify(b);

  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedProjectId = useAppSelector(
    (state: RootState) => state.projectView.selectedProject?._id
  );
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const axiosInstance = useAxios();
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setFormData((prev) => {
        const updated = { ...prev };
        switch (name) {
          case "Card_Present_Yes":
            updated.paymentChannels.cardPresent = checked;
            break;
          case "Mail_Tele_Order_Yes":
            updated.paymentChannels.moto = checked;
            break;
          case "E-com_Yes":
            updated.paymentChannels.ecommerce = checked;
            break;
          default:
            break;
        }
        return updated;
      });
    },
    []
  );

  useEffect(() => {
    function fetchFormData() {
      if (selectedProjectId) {
        getTypeInfo("businessOverview", selectedProjectId, axiosInstance)
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

  const validateForm = useCallback(() => {
    const newErrors: BusinessOverviewErrors = {};

    if (!formData.businessNatureDescription.trim()) {
      newErrors.businessNatureDescription = "This field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        if (selectedProjectId) {
          const data = {
            projectId: selectedProjectId,
            businessOverviewData: formData,
          };
          await createBusinessOverview(data, axiosInstance);
          setInitialFormData(formData);
          setSnackbar({
            open: true,
            message: "Data saved successfully!",
            severity: "success",
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to save ContactInfo",
          severity: "error",
        });
        console.error("Submission Error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm]
  );

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, []);
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    resetForm,
    validateForm,
    snackbar,
    handleCloseSnackbar,
    isDirty 
  };
};
