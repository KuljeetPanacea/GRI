import { AxiosInstance } from 'axios';
export interface AssessedEntity {
  assessedEntityname: string;
  assessedDba: string;
  assessedWebsiteLink: string;
  pocName: string;
  pocPhoneNumber: string;
  pocEmail: string;
  leadershipName?:string;
  leadershipContactNo?: string;
  leadershipEmailId?:string;
}

export const getAssessedEntities = async (clientId:string, axiosInstance:AxiosInstance): Promise<AssessedEntity[]> => {
  try {
    const response = await axiosInstance.get(`/api/client/assessed-entity/${clientId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching assessed entities:', error);
    throw error;
  }
};

 