import { AxiosInstance } from 'axios';
import { ContactInfoData } from '../features/Roc_Parts/Part_1/hooks/useContactInfo';
import { BusinessOverviewData } from '../features/Roc_Parts/Part_1/hooks/useBusinessOverview';
import { ScopeOfWorkData } from '../features/Roc_Parts/Part_1/hooks/useScopeOfWork';
import { ReviewedEnvData } from '../features/Roc_Parts/Part_1/hooks/useReviewedEnv';
import { QuarterlyScanFormData } from '../features/Roc_Parts/Part_1/hooks/useQuarterlyScan';
import { AppendixCFormData } from '../features/Roc_Parts/Appendix/hooks/useAppendixCForm';
import { AppendixEFormData } from '../features/Roc_Parts/Appendix/hooks/useAppendixEForm';
import { AppendixA } from '../features/Roc_Parts/Part_2/types';

interface ContactInfoPayload{
  projectId: string,
  "contactInfoData": ContactInfoData
}

interface BusinessOverviewPayload{
  projectId: string,
  "businessOverviewData": BusinessOverviewData
}

interface ScopeOfWorkPayload{
  projectId: string,
  "scopeOfWorkData": ScopeOfWorkData
}

interface ReviewedEnvPayload{
  projectId: string,
  "reviewedEnvData": ReviewedEnvData
}

interface QuarterlyScanPayload{
  projectId: string,
  "quarterlyScanFormData": QuarterlyScanFormData
}

export interface AppendixPayload{
  projectId?: string,
  controls: AppendixA[];
}


export const getTypeInfo = async (type:string, projectId:string, axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.get(`/api/roc-part-one/${type}/${projectId}`, { withCredentials: true });
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};

export const createContactInfo = async (data: ContactInfoPayload, axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.post(`/api/roc-part-one/contact-info`, data, { withCredentials: true });
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};
export const createBusinessOverview = async (data: BusinessOverviewPayload, axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.post(`/api/roc-part-one/business-overview`, data, { withCredentials: true });
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};
export const createScopeOfWork = async (data: ScopeOfWorkPayload, axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.post(`/api/roc-part-one/scope-of-work`, data, { withCredentials: true });
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};
export const createReviewedEnv = async (data: ReviewedEnvPayload, axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.post(`/api/roc-part-one/reviewed-environment`, data, { withCredentials: true });
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};
export const createQuarterlyScanForm = async (data: QuarterlyScanPayload, axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.post(`/api/roc-part-one/quarterly-scan-form`, data, { withCredentials: true });
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};

export const createAppendixA = async (data:AppendixPayload, axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.post(`/api/appendix/upsert-a`, data, { withCredentials: true }); 
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};

export const createAppendixC = async (data: AppendixCFormData , projectId: string, axiosInstance:AxiosInstance) => {
  try {

    const response = await axiosInstance.post(`/api/appendix/upsert-c`, {...data, "projectId": projectId}, { withCredentials: true }); 
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};
export const createAppendixE = async (data: AppendixEFormData, projectId: string, axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.post(`/api/appendix/upsert-e`, {...data, "projectId": projectId}, { withCredentials: true }); 
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};



export const getAppendixAControl = async (projectId: string, title: string,axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.get(`/api/appendix/${projectId}/appendix-a/control/${title}`, { withCredentials: true }); 
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};

export const getAppendix = async (projectId: string, appendixType: string,axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.get(`/api/appendix/get-appendix-by-type/${projectId}/${appendixType}`, { withCredentials: true }); 
    return response;
  } catch (error) {
    console.error('Error fetching info:', error);
    throw error;
  }
};


 