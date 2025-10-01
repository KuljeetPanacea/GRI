import { AxiosInstance } from 'axios';


export const findAlldeviceGaps = async (axiosInstance: AxiosInstance,projectId: string) => {
        try {
            const response = await axiosInstance.get(`/api/RocAssetControl/find-alldevice-gaps/${projectId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error fetching devices:', error);
            throw error;
        }
    };

export const findAllstakeholderGaps = async (axiosInstance: AxiosInstance,projectId: string) => {
        try {
            const response = await axiosInstance.get(`/api/RocAssetControl/find-Allstakeholder-Gaps/${projectId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error fetching devices:', error);
            throw error;
        }
    };  
export const findstakeholderGaps = async (axiosInstance: AxiosInstance,projectId: string) => {
        try {
            const response = await axiosInstance.get(`/api/RocAssetControl/find-stakeholder-Gaps/${projectId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error fetching devices:', error);
            throw error;
        }
    };  

    export const findDeviceRefGaps = async (axiosInstance: AxiosInstance,projectId: string,deviceRef: string) => {
        try {
            const response = await axiosInstance.get(`/api/RocAssetControl/find-deviceRef-gaps/${projectId}/${deviceRef}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error fetching devices:', error);
            throw error;
        }
    };