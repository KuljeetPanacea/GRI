import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { useEffect, useRef, useState } from "react";
import useAxios from "../../../../api/useAxios";
import {
  cdeDocument,
  deleteFile,
  FileType,
  getSignedUrlAPI,
  getSignedUrlAPIForRead,
  updateDceDocument,
} from "../../../../api/project";
import { setSelectedProject } from "../../../../redux/projectViewSlice";
import { showSnackbar } from "../../../../redux/phaseSlice";
import { Project } from "../../../../redux/projectManagementSlice";

export const useDecDocuments = () => {
  const selectedProject = useSelector(
    (state: RootState) => state.projectView.selectedProject
  );
  const loginUser = useSelector((state: RootState) => state.login.user)!;
  const [activeTab, setActiveTab] = useState<string>();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<cdeDocument[]>(
    selectedProject?.cdeDocs || []
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const axiosInstance = useAxios();
  const dispatch = useAppDispatch();

  // Fetch signed URL from API and set image
  const fetchAndSetSignedUrl = async (
    fileName: string,
    setImage: (url: string) => void = setSelectedImageUrl
  ) => {
    try {
      const response = await getSignedUrlAPIForRead(
        axiosInstance,
        fileName,
        selectedProject?._id || ""
      );
      const url = response.data;
      if (url) {
        setImage(url);
      }
    } catch (err) {
      console.error("Failed to get signed URL for viewing", err);
    }
  };

  const removeFile = async (
    s3Path: string
  ) => {
    try {
      const response = await deleteFile(
        axiosInstance,
        selectedProject?._id || "",
        s3Path
      );
      if(response){
        dispatch(
          showSnackbar({
            message: "Document Deleted successfully!",
            severity: "success",
          })
        );
      }
    } catch (err) {
      console.error("Failed to get signed URL for viewing", err);
    }
  };

  // Handle sidebar click
  const handleTabClick = (doc: cdeDocument) => {
    setActiveTab(doc.fileName); 
    fetchAndSetSignedUrl(doc.fileName);
    console.log("Clicked document:", activeTab, doc.fileName);
  };

  // Upload a file and update state
  const handleUpload = async (file: File) => {
    try {
      const response = await getSignedUrlAPI(
        axiosInstance,
        file.name,
        file.type,
        selectedProject?._id || ""
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
        throw new Error(
          `Failed to upload file to S3: ${uploadResponse.statusText}`
        );
      }

      const dceData: cdeDocument = {
        fileName: file.name,
        fileType: FileType.DOCUMENT,
        folderName: "PI-dev-temp",
        s3Path: uploadedUrl,
        status: "uploaded",
        uploadedAt: new Date(),
        uploadedBy: loginUser.id,
        // url: undefined,
      };

      const newCdeDocs = [...uploadedDocs, dceData];
      const updatedProject: Project = {
        ...selectedProject!,
        cdeDocs: newCdeDocs,
      };

      setUploadedDocs(newCdeDocs);
      dispatch(setSelectedProject(updatedProject));
      dispatch(
        showSnackbar({
          message: "Document uploaded successfully!",
          severity: "success",
        })
      );
      console.log("type of ", typeof(selectedProject!._id) )
      await updateDceDocument(axiosInstance, selectedProject!._id || "", dceData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };


  // File input change handler
  const onFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleUpload(file);
      event.target.value = "";
    }
  };

  // Show first document on initial render
  useEffect(() => {
    if (uploadedDocs.length > 0 && !selectedImageUrl) {
      const firstDoc = uploadedDocs[0];
      setActiveTab(firstDoc.status);
      fetchAndSetSignedUrl(firstDoc.fileName);
    }
  }, [uploadedDocs]);

  return {
    selectedProject,
    uploadedDocs,
    fileInputRef,
    onFileChange,
    activeTab,
    setActiveTab,
    fetchAndSetSignedUrl,
    selectedImageUrl,
    handleTabClick,
    removeFile
  };
};
