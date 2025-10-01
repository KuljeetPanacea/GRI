import { AxiosInstance } from "axios";
import dayjs from "dayjs";
import { QstnrFilters } from "../redux/qstnrFilterSlice";

export const createQstn = async (qstnrId: string | undefined, data: object, axiosInstance: AxiosInstance) => {
  try {
    console.log("Creating questionnaire with data:", data);
    const response = await axiosInstance.post(`/api/questionnaires/${qstnrId}/questions`, [data], {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error creating questionnaire:", error);
    throw error;
  }
}
export const getQuestionnaires = async (filters: QstnrFilters, axiosInstance: AxiosInstance, currentPage?: number, limit?: number) => {
  try {
    const queryParams = new URLSearchParams();

    // queryParams.append("page", filters.page || "2");
    if (filters.search) queryParams.append("search", filters.search || "");
    if (filters.industry) queryParams.append("industryType", filters.industry);
    if (filters.industrySize) queryParams.append("industrySize", filters.industrySize);
    if (filters.compliance) queryParams.append("complianceType", filters.compliance);
    if (filters.Phase) queryParams.append("phase", filters.Phase);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.datePublished) {
      queryParams.append("createdStartDate", dayjs(filters.datePublished).startOf("day").toISOString());
      queryParams.append("createdEndDate", dayjs(filters.datePublished).endOf("day").toISOString());
    }
    if (filters.deviceType) queryParams.append("deviceType", filters.deviceType);

    const response = await axiosInstance.get(`/api/questionnaires/all-questionnaire`,{withCredentials: true, params:{page:currentPage,limit,...Object.fromEntries(queryParams)}});
    return {
      data: response.data.questionnaires,
      totalPages: response.data.totalPages,
      totalCount: response.data.totalCount,
      currentPage: response.data.currentPage,
    };
  } catch (error) {
    console.error("Error fetching questionnaires:", error);
    throw error;
  }
};


export const getScopingQstnr = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get(`/api/questionnaires/phase/scoping/`, {withCredentials: true});
    return response.data;
  }catch(error) {
    console.error("Error fetching questionnaire:", error);
    throw error;
  }

}
export const createQuestionnaire = async (data: object, axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.post("/api/questionnaires/createquestionnaire", data,{withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error creating questionnaire:", error);
    throw error;
  }
};

export const getQstnrQuestions = async (qstnrId: string, axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get(`/api/questionnaires/${qstnrId}`, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error fetching questionnaire:", error);
    throw error;
  }
}
export const evaluateQstn = async ( payload: object, axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.post(`/api/assesment-task/evaluate`, payload, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error evaluating questionnaire:", error);
    throw error;
  }
}

export const evaluateQuestionnaire = async ( payload: object, axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.post(`/api/questionnaires/evaluate`, payload, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error evaluating questionnaire:", error);
    throw error;
  }
}

export const deleteQuestionnaire = async (id: string, axiosInstance: AxiosInstance) => {
  try {
    const result = axiosInstance.delete(
      `/api/questionnaires/deletequestionnaire/${id}`,
      {withCredentials: true}
    );
    console.log("result", result);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};  

export const duplicateQuestionnaire = async (id: string, axiosInstance: AxiosInstance) => {
  try {
    const result = axiosInstance.post(
      `/api/questionnaires/duplicate/${id}`,{},
      {withCredentials: true}
    );
    console.log("result", result);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const deleteQstn = async (id: string, qstnrid:string, axiosInstance: AxiosInstance) => {
  try {
    const result = axiosInstance.delete(
      `/api/questionnaires/${qstnrid}/delete/${id}`,
      {withCredentials: true}
    );
    console.log("result", result);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const duplicateQstn = async (questionId: string,questionnaireId: string,axiosInstance: AxiosInstance) => {
  try{
    const response = await axiosInstance.post(
      `/api/questionnaires/${questionnaireId}/duplicate/${questionId}`,{},
      {withCredentials: true}
    );
    return response.data;
  }
  catch(error){
    console.error("Error fetching data:", error);
  }
};

export const PublishQstnr = async (qstnrId: string | undefined, data: object, axiosInstance: AxiosInstance) => {
  try {
    console.log("Publishing questionnaire with data:", data);
    const response = await axiosInstance.post(`/api/questionnaires/${qstnrId}/publish`, data , {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error Publishing questionnaire:", error);
    throw error;
  }
};

export const createAEStakeHolder = async (axiosInstance: AxiosInstance,aeStackHolder:string[],projectId:string) => {
  try {
    
    const response = await axiosInstance.post(`/api/project/scoping-onboard-aestakeholder/${projectId}`, aeStackHolder, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error creating questionnaire:", error);
    throw error;
  }
}