import  { AxiosInstance } from "axios";


export const  deleteEvidenceGap = async ( axiosInstance: AxiosInstance, assessmentId: string, questionId: string) => {
    try {
        const response = await axiosInstance.delete(`/api/assesment-task/delete-evidence/${assessmentId}/${questionId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error deleting evidence:", error);
        throw error;
    }
};

export const UploadedEvidence = async ( axiosInstance: AxiosInstance, assessmentId: string) => {
    try {
        console.log("assessmentId", assessmentId);
        const response = await axiosInstance.get(`/api/assesment-task/get-Uploaded-evidence/${assessmentId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error deleting evidence:", error);
        throw error;
    }
};

export const fetchAssessorRevises = async ( axiosInstance: AxiosInstance, projectId: string, assessorId: string, assessmentId?: string) => {
    try {
        const url = assessmentId
            ? `/api/RocAssetControl/asssessorrevise/${projectId}/${assessorId}/${assessmentId}`
            : `/api/RocAssetControl/asssessorrevise/${projectId}/${assessorId}`;
        const response = await axiosInstance.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching assessor revises:", error);
        throw error;
    }
};
 

export const submitResolutionComment = async ( axiosInstance: AxiosInstance, projectId: string, controlNo: string,selectedReviseQstnId: string, resolution: string) => {
    try {
        const response = await axiosInstance.post(`/api/RocAssetControl/submitresolutionComment/${projectId}/${controlNo}/${selectedReviseQstnId}`, { resolution }, { withCredentials: true }); 
        return response.data;
    } catch (error) {
        console.error('Error deleting users:', error);
        throw error;
    }
};

export const GenerateAIResponse = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  controlNo: string,
  deviceRef: string,
  deviceType: string,
  requirementDesc: string,
  subRequirementDesc: string,
  controlDesc: string
) => {
  try {
    if (!deviceRef || deviceRef.trim() === "") {

      return "Please select a device before generating AI response." ;
    }
    // Send all required data in the POST body
    const response = await axiosInstance.post(
      `/api/RocAssetControl/GenerateAIResponse`,
      {
        projectId,
        controlNo,
        deviceRef,
        deviceType,
        requirementDesc,
        subRequirementDesc,
        controlDesc,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};