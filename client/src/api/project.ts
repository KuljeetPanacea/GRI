import { AxiosInstance } from "axios";
import { NewProject } from "../redux/createNewProjectSlice";
import { device } from "../redux/projectManagementSlice";
import { EvidenceType } from "../features/AuditProjectFlow/phases/Assessment/components/useEvidenceUpload";

export interface cdeDocument {
  fileName: string;
  fileType: FileType;
  folderName: string;
  s3Path: string;
  status: string;
  uploadedAt: Date;
  uploadedBy: string;
  cdeType?: CdeType;
  tags?: string[];
}

export interface userResponseDto {
  choiceValue: string[];
  questionId: string;
  
}
interface GenerateDocumentPayload {
  projectId: string;
  fileNames: string[];
  // Add other expected payload properties
}
export enum CdeType {
  ASSET_INVENTORY = 'assetInventory',
  DATA_FLOW = 'dataFlow',
  NETWORK_DIAGRAM = 'networkDiagram',
}

export enum FileType {
  EVIDENCE = 'evidence',
  DOCUMENT = 'document',
}

export const getProjects = async (
  axiosInstance: AxiosInstance,
  page?: number,
  limit?: number,
  projectStatus?: string,
  projectStage?: string,
  ongoingProjects?: string,
  qsa?: string,
  search?:string
) => {
  const params: Record<string, unknown> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (projectStatus) params.projectStatus = projectStatus;
  if (projectStage) params.projectStage = projectStage;
  if (ongoingProjects) params.ongoingProjects = ongoingProjects;
  if (qsa) params.qsa = qsa;
  if(search) params.projectName = search;
  try {
    const response = await axiosInstance.get("/api/project/all-project", {
      withCredentials: true,
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const addProjects = async (
  axiosInstance: AxiosInstance,
  project: NewProject
) => {
  try {
    const response = await axiosInstance.post(
      "/api/project/createproject",
      project,
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const fetchProjectsOfLoginUser = async (
  axiosInstance: AxiosInstance,
  userId: string | undefined,
  role: string[] | undefined,
  page?: number,
  limit?: number,
  projectStatus?: string,
  OngoingProjects?: string,
  search?:string
) => {
  const params: Record<string, unknown> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (projectStatus) params.projectStatus = projectStatus;
  if (OngoingProjects) params.ongoingProjects = OngoingProjects;
  if (search) params.projectName = search;
  try {
    const response = await axiosInstance.get(
      `/api/project/my-projects/${userId}/${(role ?? [])[0]}`,
      { withCredentials: true, params}
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const deleteProjects = async (
  axiosInstance: AxiosInstance,
  projectId: string
) => {
  try {
    const response = await axiosInstance.delete(
      `/api/project/deleteproject/${projectId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const addDevice = async (
  axiosInstance: AxiosInstance,
  payload: device
) => {
  try {
    const response = await axiosInstance.post(
      `/api/assesment-task/create-assesment-task`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding device: ", error);
    throw error;
  }
};

export const deviceLookUp = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get(
      "/api/lookup/lookupcategory/DeviceType",
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.log("Error fetching devices", error);
    throw error;
  }
};
export const updateProject = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  updatedProjectData: Partial<NewProject>
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/project/updateproject/${projectId}`,
      updatedProjectData,
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const scopingOnboardAEPOC = async (
  axiosInstance: AxiosInstance,
  projectId: string
) => {
  try {
    const response = await axiosInstance.post(
      `/api/project/scoping-onboard-aepoc/${projectId}`,
      {},
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const fetchAuditDevices = async (
  axiosInstance: AxiosInstance,
  projectId: string| undefined,
) => {
  try {
    const response = await axiosInstance.get(
      `/api/assesment-task/all-assesment-task/${projectId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};
export const getProject = async (
  axiosInstance: AxiosInstance,
  projectId: string| undefined,
) => {
  try { 
    const response = await axiosInstance.get(
      `/api/project/project-leadership/${projectId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getSignedUrlAPI = async (
  axiosInstance: AxiosInstance,
  fileName: string,
  fileType: string,
  projectId:string
) => {
  try {
    const response = await axiosInstance.get(
      `/api/S3/upload-url`,
      {
        params: {
          fileName,
          fileType,
          projectId
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching signed URL", error);
    throw error;
  }
};

export const updateDceDocument = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  dceData: cdeDocument 
) => {
  try {
    // POST request to update DCE document
    const response = await axiosInstance.post(
      `/api/project/dce-docs/${projectId}`,
      dceData, 
      {
        withCredentials: true,
      }
    );
    
    return response;
  } catch (error) {
    console.error("Error updating DCE document", error);
    throw error;
  }
};

export const getSignedUrlAPIForRead = async (
  axiosInstance: AxiosInstance,
  fileName: string,
  projectId: string
) => {
  try {
    const response = await axiosInstance.get(
      `/api/S3/download-url`,
      {
        params: {
          fileName,
          projectId,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching signed URL", error);
    throw error;
  }

};

export const deleteFile = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  s3PathToRemove: string,
) => {
  try {
    const response = await axiosInstance.delete(
      `/api/project/dce-docs/${projectId}`,
      {
        withCredentials: true,
        data: {
          s3Path: s3PathToRemove,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error deleting file", error);
    throw error;
  }
};



export const storeUserResponse = async (
  Role: string,
  axiosInstance: AxiosInstance,
  userRespnseToStore: userResponseDto
) => {
  try {

    if(Role ==="AEStakeholder"){
      const response = await axiosInstance.patch(
        `/api/assesment-task/userresponse`,
        userRespnseToStore,
        { withCredentials: true }
      );
      console.log("response", response);
      return response.data;
    }else{
 const response = await axiosInstance.patch(
      `/api/project/userresponse`,
      userRespnseToStore,
      { withCredentials: true }
    );
    console.log("response", response);
    return response.data;
    }
   
  } catch (error) {
    console.error("Error storing user response:", error);
    throw error;
  }
}

export interface gapCommentDto {
  questionId: string;
  gapComment: string;
  clientComment?: string;
  status?: string;
  assessmentId?: string;
}

export const storeGapComment = async (
  axiosInstance: AxiosInstance,
  gapCommentData: gapCommentDto
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/project/gap-comment`,
      gapCommentData,
      { withCredentials: true }
    );
    console.log("gap comment response", response);
    return response.data;
  } catch (error) {
    console.error("Error storing gap comment:", error);
    throw error;
  }
}


export const fetchAssessorGaps = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  primaryAEStakeholderId: string
) => {
  try {
  
    const response = await axiosInstance.get(
      `/api/RocAssetControl/find-revise-Gaps/${projectId}/${primaryAEStakeholderId}`,
      { withCredentials: true }
    );
 
    return response.data;
  } catch (error) {
    console.error("Error fetching audit tasks:", error);
   return error;
  } 
}
export const fetchAudittask = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  primaryAEStakeholderId: string
) => {
  try {
  
    const response = await axiosInstance.get(
      `/api/assesment-task/assesment-task-AEStakeholder/${projectId}/${primaryAEStakeholderId}`,
      { withCredentials: true }
    );
 
    return response.data;
  } catch (error) {
    console.error("Error fetching audit tasks:", error);
   return error;
  } 
}

export const fetchAllAudittask = async (
  axiosInstance: AxiosInstance,
  projectId: string,
) => {
  try {
    const response = await axiosInstance.get(
      `/api/assesment-task/all-assesment-task-AEStakeholder/${projectId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching audit tasks:", error);
   return error;
  } 
}


export const gapEvidence = async (
  axiosInstance: AxiosInstance,
  assesmentId: string
)=>{
  try {
    const response = await axiosInstance.get(
      `/api/assesment-task/Gap-evidence/${assesmentId}`,
      { withCredentials: true }
    );
 
    return response.data;
  } catch (error) {
    console.error("Error fetching audit tasks:", error);
   return error;
  }
}
export const generateDocument = async (
  axiosInstance: AxiosInstance, 
  payload: GenerateDocumentPayload
) => {
  try {
    const response = await axiosInstance.post(
      `/api/project/gen-report`,
      payload,
      { 
        withCredentials: true,
        timeout: 300000, // 5 minutes timeout for long operations
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating document:", error);
    throw error;
  }
};

// src/api/project.ts
export const fetchCdeDocs = async (axiosInstance: AxiosInstance, projectId: string) => {
  const response = await axiosInstance.get(`/api/project/dce-docs/${projectId}`, { withCredentials: true });
  return response.data.data; // assuming your backend returns { success: true, data: [...] }
};

export const submitAssessmentResponse = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  assessmentId: string
) => {
  try {
    const response = await axiosInstance.post(
      `/api/assesment-task/Submit-response/${projectId}/${assessmentId}`,{},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding device: ", error);
    throw error;
  }
};

export const fetchProjectDevices = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  options?: { page?: number; limit?: number; search?: string; deviceType?: string; department?: string }
) => {
  try {
    const params: Record<string, unknown> = {};
    if (options) {
      if (options.page) params.page = options.page;
      if (options.limit) params.limit = options.limit;
      if (options.search) params.search = options.search;
      if (options.deviceType) params.deviceType = options.deviceType;
      if (options.department) params.department = options.department;
    }
    const response = await axiosInstance.get(
      `/api/project/devices/${projectId}`,
      { withCredentials: true, params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project devices:", error);
    throw error;
  }
}
export const fetchProjectQuestionaire = async (
  axiosInstance: AxiosInstance,
  projectId: string
) => {
  try {
    const response = await axiosInstance.get(
      `/api/project/projectQuestionaire/${projectId}`,
      { withCredentials: true }
    );
 
    return response.data;
  } catch (error) {
    console.error("Error fetching audit tasks:", error);
   return error;
  } 
}

export const getDeviceIdentification = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  options?: { page?: number; limit?: number; search?: string; deviceType?: string; department?: string }
) => {
  try {
    const params: Record<string, unknown> = {};
    if (options) {
      if (options.page) params.page = options.page;
      if (options.limit) params.limit = options.limit;
      if (options.search) params.search = options.search;
      if (options.deviceType) params.deviceType = options.deviceType;
      if (options.department) params.department = options.department;
    }
    const response = await axiosInstance.get(
      `/api/project/${projectId}/devices`,
      { withCredentials: true, params }
     
    );
    return response.data;
  } catch (error) {
    console.error("Error adding device: ", error);
    throw error;
  }
};

export const getAEProjects = async (
  axiosInstance: AxiosInstance,
  projectId: string
) => {
  try {
    const response = await axiosInstance.get(
      `/api/project/${projectId}/AE`,
      { withCredentials: true }
     
    );
    return response.data;
  } catch (error) {
    console.error("Error adding device: ", error);
    throw error;
  }
};

export const getAssessmentSignedUploadUrl = async (
  axiosInstance: AxiosInstance,
  fileName: string,
  fileType: string
) => {
  try {
    const response = await axiosInstance.get(
      `/api/S3/assessment-upload-url`,
      {
        params: {
          fileName,
          fileType,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching signed URL", error);
    throw error;
  }
};

export const getSignedUrlAssessment = async (
  axiosInstance: AxiosInstance,
  fileName: string
) => {
  try {
    const response = await axiosInstance.get(
      `/api/S3/download-url-assessment`,
      {
        params: {
          fileName
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching signed URL", error);
    throw error;
  }
};

export const uploadNewEvidence = async(
    axiosInstance: AxiosInstance,
    controlNo: string,
    deviceRef: string,
    data: EvidenceType[]
) => {
  console.log("data", data,controlNo,deviceRef);
  try {
      const response = await axiosInstance.patch(
          `/api/RocAssetControl/evidenceresponse/${controlNo}/${deviceRef}`,
          data,
          { withCredentials: true }
      );
      return response.data;
  } catch (error) {
      console.error('Error updating client:', error);
      throw error;
  }
};

export const getNewEvidence = async(
  axiosInstance: AxiosInstance,
  controlNo: string,
  deviceRef: string
) => {
try {
    const response = await axiosInstance.get(
        `/api/RocAssetControl/assessmntevidences/${controlNo}/${deviceRef}`,
        { withCredentials: true }
    );
    return response.data;
} catch (error) {
    console.error('Error updating client:', error);
    throw error;
}
};

export const getOldEvidence = async(
  axiosInstance: AxiosInstance,
  controlNo: string,
  deviceRef: string,
) => {
try {
    const response = await axiosInstance.get(
        `/api/RocAssetControl/assessmntevidences-old/${controlNo}/${deviceRef}`,
        { withCredentials: true }
    );
    return response.data;
} catch (error) {
    console.error('Error updating client:', error);
    throw error;
}
};

export const getAllAssestEvidences = async(
  axiosInstance: AxiosInstance,
  title: string,
  device:string
) => {
try {
    const response = await axiosInstance.get(
        `api/RocAssetControl/assessmntevidencesall/${
          title
        }/${device}`,
        { withCredentials: true }
    );
    return response.data;
} catch (error) {
    console.error('Error updating client:', error);
    throw error;
}
};

export const getAllControlEvidences = async(
  axiosInstance: AxiosInstance,
  title: string
) => {
try {
    const response = await axiosInstance.get(
        `api/RocAssetControl/assessmnt-control-evidences/${
          title
        }`,
        { withCredentials: true }
    );
    return response.data;
} catch (error) {
    console.error('Error updating client:', error);
    throw error;
}
};

export const deleteDeviceFromProject = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  deviceRefName: string
) => {
  try {
    const response = await axiosInstance.delete(
      `/api/project/${projectId}/device/${deviceRefName}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting device:", error);
    throw error;
  }
};

export const sendAssessmentTaskEmails = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  sendType: 'latest' | 'all',
  stakeholderEmails: string[]
) => {
  try {
    const response = await axiosInstance.post(
      `/api/assesment-task/send-emails/${projectId}`,
      { sendType, stakeholderEmails },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending assessment task emails:", error);
    throw error;
  }


};

export const getEvidenceTracker = async (
  axiosInstance: AxiosInstance,
  projectId: string,
) => {
  try {
    const response = await axiosInstance.get(
      `/api/assesment-task/evidenceTracker/${projectId}`,
      { withCredentials: true }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching evidence tracker data:", error);
    throw error;
  }
};


//Assurance 
export const uploadAssuranceFile = async (
  axiosInstant: AxiosInstance,
  file: File
): Promise<string> => {
  const { data } = await axiosInstant.post(
    "/api/additionalInfo/generate-presigned-url",
    {
      fileName: file.name,
      fileType: file.type,
    },
    { withCredentials: true }
  );
  
  const { url, key } = data;
  
  const uploadResponse = await axiosInstant.put(url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
  
  if (uploadResponse.status === 200) {
    return key;
  } else {
    throw new Error("Upload failed");
  }
};

export const saveAssuranceFileInfo = async (
  axiosInstance: AxiosInstance,
  projectId: string,
  type: "limited" | "reasonable",
  key: string
) => {
  try {
    const payload = { projectId, [type]: key };
    const response = await axiosInstance.post(
      "/api/additionalInfo/save",
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving assurance file info:", error);
    throw error;
  }
};

export const fetchAssuranceFiles = async (
  axiosInstance: AxiosInstance,
  projectId: string
) => {
  try {
    const response = await axiosInstance.get(
      `/api/additionalInfo/by-project/${projectId}`,
      { withCredentials: true }
    );
    return response.data; // { limited: string, reasonable: string }
  } catch (error) {
    console.error("Error fetching assurance files:", error);
    throw error;
  }
};

export const getAssurancePresignedUrl = async (
  axiosInstance: AxiosInstance,
  key: string
) => {
  try {
    const response = await axiosInstance.post(
      "/api/additionalInfo/get-presigned-url",
      { fileKey: key },
      { withCredentials: true }
    );
    return response.data.url;
  } catch (error: unknown) {
    console.error("Error getting presigned URL:", error);
    throw error;
  }
};