import { useState, useRef, useEffect } from "react";
import { uploadCdeDocument, saveCdeDocumentInfo, fetchCdeDocuments, getCdeDocumentPresignedUrl } from "../../../../api/project.ts";
import useAxios from "../../../../api/useAxios.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const validateFile = (file: File): boolean => {
  const allowedTypes = [".pdf", ".docx", ".doc"];
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    alert("Please upload only PDF or DOCX files");
    return false;
  }

  const maxSize = 100 * 1024 * 1024; // 100 MB
  if (file.size > maxSize) {
    alert("File size must be less than 100MB");
    return false;
  }
  return true;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const useAssuranceReport = () => {
  const axiosInstance = useAxios();
  
  // Get project from Redux state
  const selectedProject = useSelector(
    (state: RootState) => state.projectView.selectedProject
  ) || JSON.parse(localStorage.getItem("selectedProject") || "null");
  const [completed, setCompleted] = useState<{
    limited: boolean;
    reasonable: boolean;
  }>({
    limited: false,
    reasonable: false,
  });

  const [limitedAssuranceFile, setLimitedAssuranceFile] = useState<File | null>(null);
  const [reasonableAssuranceFile, setReasonableAssuranceFile] = useState<File | null>(null);

  const [loading, setLoading] = useState<{
    limited: boolean;
    reasonable: boolean;
  }>({
    limited: false,
    reasonable: false,
  });

  const [initialLoading, setInitialLoading] = useState(true);

  const [dragOver, setDragOver] = useState<{
    limited: boolean;
    reasonable: boolean;
  }>({
    limited: false,
    reasonable: false,
  });
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [viewingFileName, setViewingFileName] = useState<string>("");

  const limitedFileInputRef = useRef<HTMLInputElement | null>(null);
  const reasonableFileInputRef = useRef<HTMLInputElement | null>(null);
  const [limitedAssuranceKey, setLimitedAssuranceKey] = useState<string | null>(null);
  const [reasonableAssuranceKey, setReasonableAssuranceKey] = useState<string | null>(null);

  const [replaceModal, setReplaceModal] = useState<{
    open: boolean;
    file: File | null;
    type: "limited" | "reasonable" | null;
  }>({
    open: false,
    file: null,
    type: null,
  });

  const processNewFile = async (file: File, type: "limited" | "reasonable") => {
    setLoading((prev) => ({ ...prev, [type]: true }));

    if (!selectedProject?._id) {
      alert("No project selected. Please select a project first.");
      setLoading((prev) => ({ ...prev, [type]: false }));
      return;
    }

    try {
      // Upload file to S3 using CDE document API
      const key = await uploadCdeDocument(axiosInstance, file, selectedProject._id, type);

      // Save document info to project's cdeDocs field
      const cdeDocument = {
        fileName: file.name,
        fileType: file.type,
        folderName: `projects/${selectedProject._id}/cde-docs`,
        s3Path: key,
        status: "uploaded",
        uploadedAt: new Date(),
        uploadedBy: "current-user", // You might want to get this from auth context
        cdeType: type,
        tags: ["assurance-report"]
      };

      await saveCdeDocumentInfo(axiosInstance, selectedProject._id, cdeDocument);

      // Save the key in state and create a mock File object for UI
      if (type === "limited") {
        setLimitedAssuranceKey(key);
        setLimitedAssuranceFile(file);
      } else {
        setReasonableAssuranceKey(key);
        setReasonableAssuranceFile(file);
      }

      setCompleted((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCompleted((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleFileSelect = async (file: File, type: "limited" | "reasonable") => {
    if (!validateFile(file)) return;

    // Always show replace modal if there's an existing file
    if (
      (type === "limited" && limitedAssuranceFile) ||
      (type === "reasonable" && reasonableAssuranceFile)
    ) {
      setReplaceModal({ open: true, file, type });
      return;
    }

    await processNewFile(file, type);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: "limited" | "reasonable") => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: false }));
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileSelect(files[0], type);
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "limited" | "reasonable"
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) handleFileSelect(files[0], type);
    if (e.target) {
      e.target.value = '';
    }
  };

  const downloadFile = async (file: File, type: "limited" | "reasonable") => {
    try {
      const key = type === "limited" ? limitedAssuranceKey : reasonableAssuranceKey;
      if (!key) return;

      const url = await getCdeDocumentPresignedUrl(axiosInstance, key);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Download failed. Please try again.");
    }
  };

  const viewFile = async (file: File, type: "limited" | "reasonable") => {
    try {
      const key = type === "limited" ? limitedAssuranceKey : reasonableAssuranceKey;
      if (!key) return;

      const url = await getCdeDocumentPresignedUrl(axiosInstance, key);
      setViewingFile(url);
      setViewingFileName(file.name);
    } catch (error) {
      console.error("Error viewing file:", error);
      alert("Cannot view file. Please try again.");
    }
  };

  const closeViewer = () => {
    setViewingFile(null);
    setViewingFileName("");
  };

  const confirmReplace = () => {
    if (replaceModal.file && replaceModal.type) {
      processNewFile(replaceModal.file, replaceModal.type);
    }
    setReplaceModal({ open: false, file: null, type: null });
  };

  const cancelReplace = () => {
    setReplaceModal({ open: false, file: null, type: null });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProject?._id) {
        console.log("No project selected, skipping file fetch");
        setInitialLoading(false);
        return;
      }
      
      console.log("Fetching CDE documents for project:", selectedProject._id);
      setInitialLoading(true);
      
      try {
        // Fetch CDE documents from project
        const response = await fetchCdeDocuments(axiosInstance, selectedProject._id);
        console.log("Fetched CDE documents response:", response);
        
        // Extract the data array from the response
        const data = response.data || response;
        console.log("CDE documents data:", data);
        
        // Find limited and reasonable assurance documents
        const limitedDoc = data.find((doc: { cdeType: string }) => doc.cdeType === "limited");
        const reasonableDoc = data.find((doc: { cdeType: string }) => doc.cdeType === "reasonable");

        console.log("Limited doc:", limitedDoc);
        console.log("Reasonable doc:", reasonableDoc);

        // Create mock File objects for existing files
        if (limitedDoc) {
          setLimitedAssuranceKey(limitedDoc.s3Path);
          setLimitedAssuranceFile({ 
            name: limitedDoc.fileName,
            size: 0,
            type: limitedDoc.fileType,
            lastModified: new Date(limitedDoc.uploadedAt).getTime(),
          } as File);
          console.log("Set limited assurance file:", limitedDoc.fileName);
        } else {
          // Reset if no document found
          setLimitedAssuranceKey(null);
          setLimitedAssuranceFile(null);
          console.log("No limited assurance file found");
        }

        if (reasonableDoc) {
          setReasonableAssuranceKey(reasonableDoc.s3Path);
          setReasonableAssuranceFile({ 
            name: reasonableDoc.fileName,
            size: 0,
            type: reasonableDoc.fileType,
            lastModified: new Date(reasonableDoc.uploadedAt).getTime(),
          } as File);
          console.log("Set reasonable assurance file:", reasonableDoc.fileName);
        } else {
          // Reset if no document found
          setReasonableAssuranceKey(null);
          setReasonableAssuranceFile(null);
          console.log("No reasonable assurance file found");
        }
      } catch (error) {
        console.error("Error fetching CDE documents:", error);
        // Reset state on error
        setLimitedAssuranceKey(null);
        setLimitedAssuranceFile(null);
        setReasonableAssuranceKey(null);
        setReasonableAssuranceFile(null);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [axiosInstance, selectedProject?._id]);

  return {
    completed,
    limitedAssuranceFile,
    reasonableAssuranceFile,
    loading,
    initialLoading,
    dragOver,
    viewingFile,
    viewingFileName,
    limitedFileInputRef,
    reasonableFileInputRef,
    replaceModal,
    handleDrop,
    handleFileInputChange,
    downloadFile,
    viewFile,
    closeViewer,
    confirmReplace,
    cancelReplace,
    setDragOver,
  };
};

export default useAssuranceReport;