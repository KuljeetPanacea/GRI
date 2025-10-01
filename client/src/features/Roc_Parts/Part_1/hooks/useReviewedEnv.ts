import { useState, useCallback, useEffect } from "react";
import { RootState, useAppSelector } from "../../../../redux/store";
import useAxios from "../../../../api/useAxios";
import { createReviewedEnv, getTypeInfo } from "../../../../api/partOne";
import { AlertColor } from "@mui/material";
import { useDispatch } from "react-redux";
import { markAsClean, markAsDirty } from "../../../../redux/rocSlice";

// === Interfaces ===
export interface AccountDataFlow {
  flow: string;
  description: string;
}

export interface DataStorage {
  dataStore: string;
  fileTableField: string;
  storedElements: string;
  securityMethod: string;
  loggingDescription: string;
}

export interface ServiceProvider {
  companyName: string;
  accountDataImpact: string;
  purpose: string;
  assessedYes: boolean;
  assessedNo: boolean;
  aocDate: string;
  aocVersion: string;
  includedInAssessmentYes: boolean;
  includedInAssessmentNo: boolean;
}

export interface InScopeNetwork {
  name: string;
  type: string;
  purpose: string;
}

export interface Facility {
  type: string;
  count: string;
  location: string;
}

export interface SystemComponent {
  type: string;
  count: string;
  vendor: string;
  product: string;
  role: string;
}

export interface ReviewedEnvData {
  networkDiagrams: File[];
  dataFlowDiagrams: File[];

  accountFlows: AccountDataFlow[];
  accountFlowOptions: Record<string, boolean>; // authorization, capture...

  dataStorage: DataStorage[];
  sadStoredPostAuth_Yes: boolean;
  sadStoredPostAuth_No: boolean;
  sadStoredAsIssuer_Yes: boolean;
  sadStoredAsIssuer_No: boolean;

  serviceProviders: ServiceProvider[];

  inScopeNetworks: InScopeNetwork[];
  connectedNonCDENetworks: InScopeNetwork[];

  facilities: Facility[];

  systemComponents: SystemComponent[];
}

const initialData: ReviewedEnvData = {
  networkDiagrams: [],
  dataFlowDiagrams: [],

  accountFlows: [{ flow: "", description: "" }],
  accountFlowOptions: {
    authorization: false,
    capture: false,
    settlement: false,
    chargebackDispute: false,
    refunds: false,
    other: false,
  },

  dataStorage: [
    {
      dataStore: "",
      fileTableField: "",
      storedElements: "",
      securityMethod: "",
      loggingDescription: "",
    },
  ],
  sadStoredPostAuth_Yes: false,
  sadStoredPostAuth_No: false,
  sadStoredAsIssuer_Yes: false,
  sadStoredAsIssuer_No: false,

  serviceProviders: [
    {
      companyName: "",
      accountDataImpact: "",
      purpose: "",
      assessedYes: false,
      assessedNo: false,
      aocDate: "",
      aocVersion: "",
      includedInAssessmentYes: false,
      includedInAssessmentNo: false,
    },
  ],

  inScopeNetworks: [{ name: "", type: "", purpose: "" }],
  connectedNonCDENetworks: [{ name: "", type: "", purpose: "" }],

  facilities: [{ type: "", count: "", location: "" }],

  systemComponents: [
    { type: "", count: "", vendor: "", product: "", role: "" },
  ],
};

export const useReviewedEnv = () => {
  const [formData, setFormData] = useState<ReviewedEnvData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState({ network: false, dataflow: false });
   const [initialFormData, setInitialFormData] =
      useState<ReviewedEnvData>(initialData);
    const [isDirty, setIsDirty] = useState(false);
  
    const deepEqual = (
      a: ReviewedEnvData,
      b: ReviewedEnvData
    ): boolean => JSON.stringify(a) === JSON.stringify(b);
  
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

  const handleFileUpload = useCallback(
    (files: FileList | null, type: "network" | "dataflow") => {
      if (!files) return;
      const allowed = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      const newFiles = Array.from(files).filter((file) =>
        allowed.includes(file.type)
      );
      setFormData((prev) => ({
        ...prev,
        [type === "network" ? "networkDiagrams" : "dataFlowDiagrams"]: [
          ...prev[type === "network" ? "networkDiagrams" : "dataFlowDiagrams"],
          ...newFiles,
        ],
      }));
    },
    []
  );

  useEffect(() => {
    function fetchFormData() {
      if (selectedProjectId) {
        getTypeInfo("reviewedEnv", selectedProjectId, axiosInstance)
          .then((response) => {
            console.log(response.data);
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

  const removeFile = useCallback(
    (index: number, type: "network" | "dataflow") => {
      setFormData((prev) => ({
        ...prev,
        [type === "network" ? "networkDiagrams" : "dataFlowDiagrams"]: prev[
          type === "network" ? "networkDiagrams" : "dataFlowDiagrams"
        ].filter((_, i) => i !== index),
      }));
    },
    []
  );

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setFormData((prev) => {
        if (name in prev.accountFlowOptions) {
          return {
            ...prev,
            accountFlowOptions: {
              ...prev.accountFlowOptions,
              [name]: checked,
            },
          };
        } else {
          return {
            ...prev,
            [name as keyof ReviewedEnvData]: checked,
          };
        }
      });
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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name as keyof ReviewedEnvData]: value,
      }));
    },
    []
  );

  type ReviewedEnvArray =
    | AccountDataFlow[]
    | DataStorage[]
    | ServiceProvider[]
    | InScopeNetwork[]
    | Facility[]
    | SystemComponent[];

  const updateTableRow = useCallback(
    <T extends ReviewedEnvArray>(
      key: keyof ReviewedEnvData,
      index: number,
      field: string,
      value: string | boolean | number
    ) => {
      setFormData((prev) => ({
        ...prev,
        [key]: (prev[key] as T).map((row, i) =>
          i === index ? { ...row, [field]: value } : row
        ),
      }));
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, type: "network" | "dataflow") => {
      e.preventDefault();
      setDragOver((prev) => ({ ...prev, [type]: true }));
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent, type: "network" | "dataflow") => {
      e.preventDefault();
      setDragOver((prev) => ({ ...prev, [type]: false }));
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, type: "network" | "dataflow") => {
      e.preventDefault();
      setDragOver((prev) => ({ ...prev, [type]: false }));
      handleFileUpload(e.dataTransfer.files, type);
    },
    [handleFileUpload]
  );

  const addRow = useCallback(
    <T extends ReviewedEnvArray>(
      key: keyof ReviewedEnvData,
      row: T[number]
    ) => {
      setFormData((prev) => ({
        ...prev,
        [key]: [...(prev[key] as T), row],
      }));
    },
    []
  );

  // Add removeRow function
  const removeRow = useCallback(
    <T extends ReviewedEnvArray>(key: keyof ReviewedEnvData, index: number) => {
      setFormData((prev) => ({
        ...prev,
        [key]: (prev[key] as T).filter((_, i) => i !== index),
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        if (selectedProjectId) {
          const data = {
            projectId: selectedProjectId,
            reviewedEnvData: formData,
          };
          await createReviewedEnv(data, axiosInstance);
          setInitialFormData(formData);
          setSnackbar({
            open: true,
            message: "Data saved successfully!",
            severity: "success",
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Failed to save ContactInfo",
          severity: "error",
        });
        console.error("Submission failed:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    formData,
    handleInputChange,
    handleCheckboxChange,
    updateTableRow,
    addRow,
    removeRow, // Add removeRow to the returned object
    handleSubmit,
    handleFileUpload,
    removeFile,
    dragOver,
    setDragOver,
    isSubmitting,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setFormData,
    formatFileSize,
    handleCloseSnackbar,
    snackbar,
    isDirty
  };
};
