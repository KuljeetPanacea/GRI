import { AxiosInstance } from 'axios';
import { Client } from '../redux/AddNewClientSlice';
import { ClientDataFilter } from '../redux/clientManagementSlice';
export const getClients = async (
    axiosInstance: AxiosInstance,
    page?:number,
    limit?:number,
    filters?: ClientDataFilter 
) => {
    try {
        const response = await axiosInstance.get('/api/client/all-client', { 
            withCredentials: true ,
            params:{
                page,
                limit,
                createDtTime:filters?.onboarding,               
                industry:filters?.industry,
                entitySize:filters?.industrySize,           
                status:filters?.status,
                clientName:filters?.search
            },
           
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
};
 
export const addClients = async (axiosInstance: AxiosInstance, client: Client) => {
    try {
        console.log("Making API request with data:", client);
        const response = await axiosInstance.post('/api/client/createclient', client,
            { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error creating client:', error);
        throw error;
    }
};
 
export const deleteClients = async (axiosInstance: AxiosInstance, clientId: string) => {
    try {
        const response = await axiosInstance.delete(`/api/client/deleteclient/${clientId}`,
            { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error deleting client:', error);
        throw error;
    }
};

export const updateClient = async(
    axiosInstance: AxiosInstance,
    clientId: string,
    clientData: Client
) => {
    try {
        const response = await axiosInstance.patch(
            `/api/client/updateclient/${clientId}`,
            clientData,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating client:', error);
        throw error;
    }
};
 