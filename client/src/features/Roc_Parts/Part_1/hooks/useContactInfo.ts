import { useState, useCallback, useEffect } from "react";
import { createContactInfo, getTypeInfo } from "../../../../api/partOne";
import useAxios from "../../../../api/useAxios";
import { RootState, useAppSelector } from "../../../../redux/store";
import { AlertColor } from "@mui/material";
import { useDispatch } from "react-redux";
import { markAsClean, markAsDirty } from "../../../../redux/rocSlice";

export interface assessmentFinding {
  requirementId: string;
  finding?: "InPlace" | "NotApplicable" | "NotTested" | "NotInPlace";
  compensatingControl?: boolean;
  customizedApproach?: boolean;
}

export interface assessmentSubReq {
  notApplicable?: string[];
  notTested?: string[];
  notInPlaceLegal?: string[];
  notInPlaceNotLegal?: string[];
  compensatingControl?: string[];
  customizedApproach?: string[];
}

export interface ContactInfoData {
  company: {
    name: string;
    dba: string;
    mailingAddress: string;
    website: string;
  };
  contact: {
    name: string;
    title: string;
    phone: string;
    email: string;
  };
  internalSecurityAssessor: {
    name: string;
  };
  qsaCompany: {
    name: string;
    mailingAddress: string;
    website: string;
  };
  leadAssessor: {
    name: string;
    phone: string;
    email: string;
    certificateId: string;
  };
  associateQSA: {
    name: string;
    mentorName: string;
  },
  associateAssessor: {
    name: string;
    mentorName: string;
    certificateId: string;
  };
  qaReviewer: {
    name: string;
    phone: string;
    email: string;
    credentials: string;
  };
  assessmentDates: {
    reportDate: string;
    startDate: string;
    endDate: string;
    onsiteDays: string;
  };
  remoteAssessment: {
    performedOnsite: boolean;
    performedRemotely: boolean;
    combinationRemoteOnsite: boolean;
    justificationIfRemote: string;
  };
  qsaServices: {
    consultationProvided: boolean;
    consultationNotProvided: boolean;
    consultationDetails: string;
    additionalServicesReviewed: string;
    conflictMitigation: string;
  };
  subcontracting: {
    used: boolean;
    notUsed: boolean;
    description: string;
  };
  history: {
    consecutiveRocYears: string;
  };
  assessmentScope: {
    fullAssessment: boolean;
    partialAssessment: boolean;
  };
  assessmentOutcome: {
    compliant: boolean;
    nonCompliant: boolean;
    legalExceptionCompliant: boolean;
  };
  assessmentSubReq: assessmentSubReq;
  assessmentFindings: Record<string, Omit<assessmentFinding, "requirementId">>;
}

export interface ContactInfoErrors {
  [key: string]: string | undefined;
}

const initialData: ContactInfoData = {
  company: {
    name: "",
    dba: "",
    mailingAddress: "",
    website: "",
  },
  contact: {
    name: "",
    title: "",
    phone: "",
    email: "",
  },
  internalSecurityAssessor: {
    name: "",
  },
  qsaCompany: {
    name: "",
    mailingAddress: "",
    website: "",
  },
  leadAssessor: {
    name: "",
    phone: "",
    email: "",
    certificateId: "",
  },
  associateQSA: {
    name: "",
    mentorName: "",
  },
  associateAssessor: {
    name: "",
    mentorName: "",
    certificateId: "",
  },
  qaReviewer: {
    name:"",
    phone: "",
    email: "",
    credentials: "",
  },
  assessmentDates: {
    reportDate: "",
    startDate: "",
    endDate: "",
    onsiteDays: "",
  },
  remoteAssessment: {
    performedOnsite: false,
    performedRemotely: false,
    combinationRemoteOnsite: false,
    justificationIfRemote: "",
  },
  qsaServices: {
    consultationProvided: false,
    consultationNotProvided: false,
    consultationDetails: "",
    additionalServicesReviewed: "",
    conflictMitigation: "",
  },
  subcontracting: {
    used: false,
    notUsed: false,
    description: "",
  },
  history: {
    consecutiveRocYears: "",
  },
  assessmentScope: {
    fullAssessment: false,
    partialAssessment: false,
  },
  assessmentOutcome: {
    compliant: false,
    nonCompliant: false,
    legalExceptionCompliant: false,
  },
  assessmentSubReq: {
    notApplicable: [],
    notTested: [],
    notInPlaceLegal: [],
    notInPlaceNotLegal: [],
    compensatingControl: [],
    customizedApproach: [],
  },
  assessmentFindings: {},
};

export const useContactInfo = () => {
  const [formData, setFormData] = useState<ContactInfoData>(initialData);
  const [errors, setErrors] = useState<ContactInfoErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] =
    useState<ContactInfoData>(initialData);
  const [isDirty, setIsDirty] = useState(false);

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

  const validateForm = useCallback((): boolean => {
    const newErrors: ContactInfoErrors = {};

    if (!formData.company.name.trim()) {
      newErrors["company.name"] = "Company name is required";
    }
    if (!formData.contact.email.trim()) {
      newErrors["contact.email"] = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors["contact.email"] = "Please enter a valid email address";
    }
    if (
      formData.leadAssessor.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.leadAssessor.email)
    ) {
      newErrors["leadAssessor.email"] = "Please enter a valid email address";
    }
    if (
      formData.qaReviewer.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.qaReviewer.email)
    ) {
      newErrors["qaReviewer.email"] = "Please enter a valid email address";
    }
    if (formData.company.website && !isValidUrl(formData.company.website)) {
      newErrors["company.website"] = "Please enter a valid URL";
    }
    if (
      formData.qsaCompany.website &&
      !isValidUrl(formData.qsaCompany.website)
    ) {
      newErrors["qsaCompany.website"] = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    function fetchFormData() {
      if (selectedProjectId) {
        getTypeInfo("contactInfo", selectedProjectId, axiosInstance)
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
    const dirty = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setIsDirty(dirty);

    if (dirty) {
      dispatch(markAsDirty());
    } else {
      dispatch(markAsClean());
    }
  }, [formData, initialFormData, dispatch]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

 function updateNestedValue<T>(
  obj: T,
  path: string,
  value: unknown
): T {
  const keys = path.split(".");
  const updated = { ...obj } as Record<string, unknown>;
  let ref: Record<string, unknown> = updated;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    // Ensure we have a proper object at this level
    if (!ref[key] || typeof ref[key] !== 'object') {
      ref[key] = {};
    } else {
      ref[key] = { ...(ref[key] as Record<string, unknown>) };
    }
    ref = ref[key] as Record<string, unknown>;
  }

  ref[keys[keys.length - 1]] = value;
  return updated as T;
}

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => updateNestedValue(prev, name, newValue));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        if (selectedProjectId) {
          const data = {
            projectId: selectedProjectId,
            contactInfoData: formData,
          };
          await createContactInfo(data, axiosInstance);
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
        console.error("Error submitting form:", error);
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

  const updateField = useCallback((path: string, value: string) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let ref: Record<string, unknown> = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        ref = ref[keys[i]] as Record<string, unknown>;
      }
      ref[keys[keys.length - 1]] = value;
      return updated;
    });
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
    updateField,
    validateForm,
    snackbar,
    handleCloseSnackbar,
    isDirty,
  };
};
