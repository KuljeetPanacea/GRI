import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedDeviceKey,
  selectedEvidences,
  selectSelectedControl,
  setSelectedEvidences as setSelectedEvidencesAction,
  SelectedControlQuestions,
  selectCurrentQuestionIndex,
} from "../../../../../redux/assessmentSlice";
import {
  getAssessmentSignedUploadUrl,
  getNewEvidence,
  getSignedUrlAssessment,
  uploadNewEvidence,
} from "../../../../../api/project";
import useAxios from "../../../../../api/useAxios";
import { showSnackbar } from "../../../../../redux/phaseSlice";

export type EvidenceType = {
  name: string;
  type: string;
  url: string;
  questionId: string;
  evidenceCategory: string;
  refName: string;
};

export const useEvidenceUpload = (questionId?: string) => {
  const [selectedDocument, setSelectedDocument] = useState<EvidenceType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const axiosInstance = useAxios();
  const documents = useSelector(selectedEvidences);
  const selectedControl = useSelector(selectSelectedControl)?.title || "";
  const deviceRefKey = useSelector(selectedDeviceKey);
  const assessmentQuestions = useSelector(SelectedControlQuestions);
  const currentQuestionIndex = useSelector(selectCurrentQuestionIndex);
  const dispatch = useDispatch();

  // Function to get the current question's evidenceReference
  const getCurrentQuestionEvidenceReference = (): 'document' | 'interview' | 'others' => {
    // If a specific questionId is provided, find that question
    if (questionId) {
      const targetQuestion = assessmentQuestions.find(q => q.qstnID === questionId);
      return targetQuestion?.evidenceReference || 'document';
    }
    
    // Otherwise use the current question index
    const currentQuestion = assessmentQuestions[currentQuestionIndex];
    return currentQuestion?.evidenceReference || 'document';
  };

  const fetchNewEvidence = async () => {
    if (!deviceRefKey || !selectedControl) {
      dispatch(setSelectedEvidencesAction([]))
    }

    try {
      const res = await getNewEvidence(
        axiosInstance,
        selectedControl,
        deviceRefKey.split("_")[1]
      );
      dispatch(setSelectedEvidencesAction(res));

      if (res.length > 0) {
        const previewRes = await getSignedUrlAssessment(axiosInstance, res[0].name);
        setSelectedDocument({ ...res[0], url: previewRes.data });
      }
    } catch (error) {
      dispatch(setSelectedEvidencesAction([]))
      console.error("Failed to fetch new evidences:", error);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const response = await getAssessmentSignedUploadUrl(
        axiosInstance,
        file.name,
        file.type
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
        throw new Error(`Failed to upload file to S3: ${uploadResponse.statusText}`);
      }

      // Get the evidenceReference from the current question
      const evidenceCategory = getCurrentQuestionEvidenceReference();

      const data: EvidenceType = {
        name: file.name,
        type: file.type,
        url: uploadedUrl,
        questionId: "new",
        evidenceCategory,
        refName: "", 
        
      };
      const res = await uploadNewEvidence(
        axiosInstance,
        selectedControl,
        deviceRefKey.split("_")[1],
        [data]
      );

      if (res) {
        try {
          const previewRes = await getSignedUrlAssessment(axiosInstance, data.name);
          const previewUrl = previewRes.data;

          const updatedData = { ...data, url: previewUrl };
          setSelectedDocument(updatedData);

          dispatch(setSelectedEvidencesAction([...documents, updatedData]));
          dispatch(
            showSnackbar({
              message: "Document uploaded successfully!",
              severity: "success",
            })
          );
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
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && deviceRefKey !== "") {
      await handleUpload(file);
      event.target.value = "";
    } else {
      dispatch(
        showSnackbar({
          message: "Kindly select a Asset Reference and Upload a Document",
          severity: "warning",
        })
      );
    }
  };

  const fetchAndSetSignedUrlForDoc = async (doc: EvidenceType) => {
    try {
      const response = await getSignedUrlAssessment(axiosInstance, doc.name);
      const signedUrl = response.data;
    
      if (signedUrl) {
        setSelectedDocument({ ...doc, url: signedUrl });
      }
    } catch (error) {
      console.error("Failed to fetch signed URL for preview", error);
      dispatch(
        showSnackbar({
          message: "Unable to load document preview.",
          severity: "error",
        })
      );
    }
  };

  useEffect(() => {
    fetchNewEvidence();
  }, [deviceRefKey, selectedControl]);

  return {
    selectedDocument,
    setSelectedDocument,
    documents,
    onFileChange,
    fileInputRef,
    fetchAndSetSignedUrlForDoc,
    handleUpload
  };
};
