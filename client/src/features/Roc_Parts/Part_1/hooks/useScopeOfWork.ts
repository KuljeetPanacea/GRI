import { useState, useCallback, useEffect } from "react";
import { RootState, useAppSelector } from "../../../../redux/store";
import useAxios from "../../../../api/useAxios";
import { createScopeOfWork, getTypeInfo } from "../../../../api/partOne";
import { AlertColor } from "@mui/material";
import { useDispatch } from "react-redux";
import { markAsClean, markAsDirty } from "../../../../redux/rocSlice";

export interface ScopeOfWorkProduct {
  id: string;
  name: string;
  version: string;
  standard: string;
  listingReference: string;
  expiryDate: string;
}

export interface ScopeOfWorkData {
  ScopeEvaluationDifference_Description: string;
  AssessorName_ScopeAttestation: string;
  ExcludedScopeAreas_Description: string;
  ScopeReductionFactors_Identification: string;
  SAQEligibilityCriteria_Description: string;
  AssessorsValidation_AddInfo: string;
  ScopeReductionSegmentation_Yes: boolean;
  ScopeReductionSegmentation_No: boolean;
  AssessorNetworkScope: string;
  ImplemetedSeg_Desc: string;
  OutOfScopeEnv_Seg: string;
  Assessor_SegVerification: string;
  UsesValidatedPCIProducts_Yes: boolean;
  UsesValidatedPCIProducts_No: boolean;
  AssessorName_SolutionImplementation: string;
  AdditionalComments_Findings: string;
  ValidatedProducts: ScopeOfWorkProduct[];
}

const initialData: ScopeOfWorkData = {
  ScopeEvaluationDifference_Description: "",
  AssessorName_ScopeAttestation: "",
  ExcludedScopeAreas_Description: "",
  ScopeReductionFactors_Identification: "",
  SAQEligibilityCriteria_Description: "",
  AssessorsValidation_AddInfo: "",
  ScopeReductionSegmentation_Yes: false,
  ScopeReductionSegmentation_No: false,
  AssessorNetworkScope: "",
  ImplemetedSeg_Desc: "",
  OutOfScopeEnv_Seg: "",
  Assessor_SegVerification: "",
  UsesValidatedPCIProducts_Yes: false,
  UsesValidatedPCIProducts_No: false,
  AssessorName_SolutionImplementation: "",
  AdditionalComments_Findings: "",
  ValidatedProducts: [
    {
      id: "1",
      name: "",
      version: "",
      standard: "",
      listingReference: "",
      expiryDate: "",
    },
  ],
};

export const useScopeOfWork = () => {
  const [formData, setFormData] = useState<ScopeOfWorkData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedProjectId = useAppSelector(
    (state: RootState) => state.projectView.selectedProject?._id
  );
  const [initialFormData, setInitialFormData] =
    useState<ScopeOfWorkData>(initialData);
  const [isDirty, setIsDirty] = useState(false);

  const deepEqual = (a: ScopeOfWorkData, b: ScopeOfWorkData): boolean =>
    JSON.stringify(a) === JSON.stringify(b);
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
      const { name, type, value, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    []
  );

  const updateProduct = useCallback(
    (id: string, field: keyof ScopeOfWorkProduct, value: string) => {
      setFormData((prev) => ({
        ...prev,
        ValidatedProducts: prev.ValidatedProducts.map((product) =>
          product.id === id ? { ...product, [field]: value } : product
        ),
      }));
    },
    []
  );

  const addProduct = useCallback(() => {
    setFormData((prev) => {
      const newId = `product-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      return {
        ...prev,
        ValidatedProducts: [
          ...prev.ValidatedProducts,
          {
            id: newId,
            name: "",
            version: "",
            standard: "",
            listingReference: "",
            expiryDate: "",
          },
        ],
      };
    });
  }, []);

  useEffect(() => {
    function fetchFormData() {
      if (selectedProjectId) {
        getTypeInfo("scopeOfWork", selectedProjectId, axiosInstance)
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

  const removeProduct = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      ValidatedProducts: prev.ValidatedProducts.filter(
        (product) => product.id !== id
      ),
    }));
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        if (selectedProjectId) {
          const data = {
            projectId: selectedProjectId,
            scopeOfWorkData: formData,
          };
          await createScopeOfWork(data, axiosInstance);
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    updateProduct,
    addProduct,
    removeProduct,
    snackbar,
    handleCloseSnackbar,
    isDirty,
  };
};
