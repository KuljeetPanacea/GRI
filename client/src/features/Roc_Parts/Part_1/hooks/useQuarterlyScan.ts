import { useState, useCallback, useEffect } from "react";
import { RootState, useAppSelector } from "../../../../redux/store";
import useAxios from "../../../../api/useAxios";
import { createQuarterlyScanForm, getTypeInfo } from "../../../../api/partOne";
import { AlertColor } from "@mui/material";
import { useDispatch } from "react-redux";
import { markAsClean, markAsDirty } from "../../../../redux/rocSlice";

export interface ExternalScanResult {
  QuarterlyASVScanDates: string;
  ASVNamePerformingScan: string;
  VulnerabilitiesFoundFailedInitialScan_Yes: boolean;
  VulnerabilitiesFoundFailedInitialScan_No: boolean;
  RescanDatesAfterVulnerabilitiesCorrected: string;
}

export interface InternalScanResult {
  QuarterlyInternalVulnerabilityScanDates: string;
  AuthenticatedScanPerformed_Yes: boolean;
  AuthenticatedScanPerformed_No: boolean;
  HighRiskCriticalVulnerabilitiesFound_Yes: boolean;
  HighRiskCriticalVulnerabilitiesFound_No: boolean;
  RescanDates_CorrectedVulnerabilities: string;
}

export interface QuarterlyScanFormData {
  externalScans: ExternalScanResult[];
  internalScans: InternalScanResult[];

  Initial_Assessment_Yes: boolean;
  Initial_Assessment_No: boolean;
  QuarterlyScanDocName: string;
  External_Scan_AssessorComments: string;

  isASVScanCompliant_Yes: boolean;
  isASVScanCompliant_No: boolean;

  Internal_InitialCompliant_Yes: boolean;
  Internal_InitialCompliant_No: boolean;
  InternalScanPolicyDocName: string;
  Internal_Scan_AssessorComments: string;
}

const initialData: QuarterlyScanFormData = {
  externalScans: [
    {
      QuarterlyASVScanDates: "",
      ASVNamePerformingScan: "",
      VulnerabilitiesFoundFailedInitialScan_Yes: false,
      VulnerabilitiesFoundFailedInitialScan_No: false,
      RescanDatesAfterVulnerabilitiesCorrected: "",
    },
  ],
  internalScans: [
    {
      QuarterlyInternalVulnerabilityScanDates: "",
      AuthenticatedScanPerformed_Yes: false,
      AuthenticatedScanPerformed_No: false,
      HighRiskCriticalVulnerabilitiesFound_Yes: false,
      HighRiskCriticalVulnerabilitiesFound_No: false,
      RescanDates_CorrectedVulnerabilities: "",
    },
  ],
  Initial_Assessment_Yes: false,
  Initial_Assessment_No: false,
  QuarterlyScanDocName: "",
  External_Scan_AssessorComments: "",
  isASVScanCompliant_Yes: false,
  isASVScanCompliant_No: false,
  Internal_InitialCompliant_Yes: false,
  Internal_InitialCompliant_No: false,
  InternalScanPolicyDocName: "",
  Internal_Scan_AssessorComments: "",
};

export const useQuarterlyScanForm = () => {
  const [formData, setFormData] = useState<QuarterlyScanFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedProjectId = useAppSelector(
    (state: RootState) => state.projectView.selectedProject?._id
  );
  const [initialFormData, setInitialFormData] =
    useState<QuarterlyScanFormData>(initialData);
  const [isDirty, setIsDirty] = useState(false);

  const deepEqual = (
    a: QuarterlyScanFormData,
    b: QuarterlyScanFormData
  ): boolean => JSON.stringify(a) === JSON.stringify(b);

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
  const updateExternalScanField = useCallback(
    (
      index: number,
      field: keyof ExternalScanResult,
      value: string | boolean
    ) => {
      setFormData((prev) => {
        const updated = [...prev.externalScans];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, externalScans: updated };
      });
    },
    []
  );

  const updateInternalScanField = useCallback(
    (
      index: number,
      field: keyof InternalScanResult,
      value: string | boolean
    ) => {
      setFormData((prev) => {
        const updated = [...prev.internalScans];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, internalScans: updated };
      });
    },
    []
  );

  const handleInputChange = useCallback(
    (name: keyof QuarterlyScanFormData, value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  useEffect(() => {
    function fetchFormData() {
      if (selectedProjectId) {
        getTypeInfo("quarterlyScanForm", selectedProjectId, axiosInstance)
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

  const handleCheckboxChange = useCallback(
    (name: keyof QuarterlyScanFormData, checked: boolean) => {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    },
    []
  );

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

  const addRow = useCallback((type: "externalScans" | "internalScans") => {
    setFormData((prev) => {
      const newRow =
        type === "externalScans"
          ? {
              QuarterlyASVScanDates: "",
              ASVNamePerformingScan: "",
              VulnerabilitiesFoundFailedInitialScan_Yes: false,
              VulnerabilitiesFoundFailedInitialScan_No: false,
              RescanDatesAfterVulnerabilitiesCorrected: "",
            }
          : {
              QuarterlyInternalVulnerabilityScanDates: "",
              AuthenticatedScanPerformed_Yes: false,
              AuthenticatedScanPerformed_No: false,
              HighRiskCriticalVulnerabilitiesFound_Yes: false,
              HighRiskCriticalVulnerabilitiesFound_No: false,
              RescanDates_CorrectedVulnerabilities: "",
            };
      return {
        ...prev,
        [type]: [...prev[type], newRow],
      };
    });
  }, []);

  const removeRow = useCallback(
    (type: "externalScans" | "internalScans", index: number) => {
      setFormData((prev) => {
        const updated = [...prev[type]];
        if (updated.length > 1) updated.splice(index, 1);
        return {
          ...prev,
          [type]: updated,
        };
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted:", formData);
      try {
        if (selectedProjectId) {
          const data = {
            projectId: selectedProjectId,
            quarterlyScanFormData: formData,
          };
          await createQuarterlyScanForm(data, axiosInstance);
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
        console.error("Submission error:", error);
      }
    },
    [formData]
  );

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleCheckboxChange,
    updateExternalScanField,
    updateInternalScanField,
    addRow,
    removeRow,
    handleSubmit,
    snackbar,
    handleCloseSnackbar,
    isDirty
  };
};
