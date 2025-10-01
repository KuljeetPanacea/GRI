import { AxiosInstance } from "axios";
import { Evidence } from "../redux/assessmentSlice";
 
export type CustomizedEnumType = 'yes' | 'no';
export type ModeEnumType = 'Remote' | 'In Person' | 'Hybrid';
 
export interface RocControlFindingDTO {
  projectId: string;
  assessmentId: string;
  controlNo: string;
  controlAssessmentFinding: 'In Place' | 'Not in Place' | 'Not Tested' | 'Not Applicable';
  detailed_finding: string;
 evidences: Evidence[];
 compensatingControl: boolean;
 customizedApproach: boolean;
  modeOfAssessment: {
    mode: ModeEnumType;
    compensation: string;
  };
}
 
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
 
export const fetchRocData = async (
    axiosInstance: AxiosInstance,
    projectId: string,
    reqNo: string,
    subReqNo: string,
    controlNo: string,
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/RocAssetControl/req-data/${projectId}/${reqNo}/${subReqNo}/${controlNo}`,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
  export const fetchAEData = async (
    axiosInstance: AxiosInstance,
    projectId: string
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/RocAssetControl/ae-data/${projectId}`,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
  export const fetchDeviceHeaderApi = async (
    axiosInstance: AxiosInstance,
    projectId: string
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/RocAssetControl/device-data/${projectId}`,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
  export const fetchAEDataControl = async (
    axiosInstance: AxiosInstance,
    projectId: string,
    nameStakeHolder: string
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/RocAssetControl/ae-data/${projectId}/${nameStakeHolder}`,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
  export const fetchAEDataSubControl = async (
    axiosInstance: AxiosInstance,
    projectId: string,
    nameStakeHolder: string,
    subReqNo:string,
    controlNo: string
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/RocAssetControl/ae-data/${projectId}/${nameStakeHolder}/${subReqNo}/${controlNo}`,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
  export const fetchDeviceSideBarData = async (
    axiosInstance: AxiosInstance,
    projectId: string,
    deviceType: string,
    deviceRef:string
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/RocAssetControl/device-data/${projectId}/${deviceType}/${deviceRef}`,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
  export const fetchDeviceControlData = async (
    axiosInstance: AxiosInstance,
    projectId: string,
    deviceType: string,
    deviceRef:string,
    subReqNo:string,
    controlNo: string
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/RocAssetControl/device-data/${projectId}/${deviceType}/${deviceRef}/${subReqNo}/${controlNo}`,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
export const fetchRocSideBarData = async (
    axiosInstance: AxiosInstance,
    projectId: string,
    rocNo: string
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/RocAssetControl/unique-req-no/${projectId}/${rocNo}`,
        {
          withCredentials: true,
        }
      );
     
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
  export const submitControlAssessment = async (
    axiosInstance: AxiosInstance,
    data: RocControlFindingDTO
  ) => {
    try {
      const response = await axiosInstance.post(
        `/api/rocControlFinding/create-roc`, data,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
  export const fetchControlAssessment = async (
    axiosInstance: AxiosInstance,
    controlNo: string,
    assessmentId: string,
    projectId: string,
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/rocControlFinding/getroc/${controlNo}/${assessmentId}/${projectId}`,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
  export const fetchControlQuestions = async (
    axiosInstance: AxiosInstance,
    controlNo: string,
    projectId: string,
    deviceRef: string
  ) => {
    console.log(controlNo, projectId, deviceRef);
    try {
      const response = await axiosInstance.get(
        `/api/rocAssetControlQstn/rocAssetControlget/${projectId}/${controlNo}/${deviceRef}`,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
  export const saveDeviceRefFinding = async (
    axiosInstance: AxiosInstance,
    deviceRefType: string,
    controlNo: string,
    data: {deviceRefFinding: string}
  ) => {
    try {
      const response = await axiosInstance.post(
        `/api/RocAssetControl/devicereffinding/${deviceRefType}/${controlNo}`,data,
        {
          withCredentials: true,
        }
      );
 
      return response;
    } catch (error) {
      console.error("Error fetching roc data", error);
      throw error;
    }
  };
 
interface EvidenceDto {
  name: string;
  type: string;
  url: string;
  questionId: string;
  qstnrId?: string;
  evidenceCategory?: string;
  refName?: string;
}
 
export const saveIdentifiedGaps = async (
  axiosInstance: AxiosInstance,
  deviceRefType: string,
  controlNo: string,
  data: { identifiedGaps: { gapDesc: string, status: string, evidences: EvidenceDto[], oldEvidence?: EvidenceDto[] }[] }
) => {
  try {
    const response = await axiosInstance.post(
      `/api/RocAssetControl/identifiedGaps/${deviceRefType}/${controlNo}`,
      data.identifiedGaps,
      {
        withCredentials: true,
      }
    );
 
    return response;
  } catch (error) {
    console.error("Error saving identified gaps", error);
    throw error;
  }
}
 

export const downloadRoc = async (
  axiosInstance: AxiosInstance,
  projectId: string
) => {
  try {
    const response = await axiosInstance.get(
      `/api/generate-roc/download/${projectId}`,
      {
        withCredentials: true,
        responseType: "blob", 
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching roc data", error);
    throw error;
  }
};

export const getIdentifiedGaps = async (
  axiosInstance: AxiosInstance,
  deviceRefType: string,
  controlNo: string,
) => {
  try {
    const response = await axiosInstance.get(
      `/api/RocAssetControl/getassessmntgaps/${controlNo}/${deviceRefType}`,
      {
        withCredentials: true,
      }
    );
 
    return response;
  } catch (error) {
    console.error("Error saving identified gaps", error);
    throw error;
  }

}
 
 
