import { useState, useRef, useEffect } from "react";
import { fetchAssuranceFiles, getAssurancePresignedUrl, saveAssuranceFileInfo, uploadAssuranceFile } from "../../../api/project.ts";
import useAxios from "../../../api/useAxios";

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

      const selectedProjectId = localStorage.getItem("selectedProjectId")?.replace(/"/g, "");

    try {
      const key = await uploadAssuranceFile(axiosInstance, file);

    await saveAssuranceFileInfo(axiosInstance, selectedProjectId!, type, key);

      // 3. Save the key in state and create a mock File object for UI
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

      const url = await getAssurancePresignedUrl(axiosInstance, key);
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

      const url = await getAssurancePresignedUrl(axiosInstance, key);
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
      const selectedProjectId = localStorage.getItem("selectedProjectId")?.replace(/"/g, "");
      if (!selectedProjectId) return;
      
      try {

        const data = await fetchAssuranceFiles(axiosInstance, selectedProjectId);
        const limitedKey = data.limited;
        const reasonableKey = data.reasonable;

        // Create mock File objects for existing files
        if (limitedKey) {
          setLimitedAssuranceKey(limitedKey);
          setLimitedAssuranceFile({ 
            name: limitedKey.split("/").pop() || "limited_assurance.pdf",
            size: 0,
            type: "application/pdf",
            lastModified: Date.now(),
          } as File);
        }

        if (reasonableKey) {
          setReasonableAssuranceKey(reasonableKey);
          setReasonableAssuranceFile({ 
            name: reasonableKey.split("/").pop() || "reasonable_assurance.pdf",
            size: 0,
            type: "application/pdf",
            lastModified: Date.now(),
          } as File);
        }
      } catch (error) {
        console.error("Error fetching assurance files:", error);
      }
    };

    fetchData();
  }, []);

  return {
    completed,
    limitedAssuranceFile,
    reasonableAssuranceFile,
    loading,
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