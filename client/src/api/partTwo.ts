import { AxiosInstance } from "axios";

export const getControlData = async (axiosInstance: AxiosInstance, projectId: string, controlNo: string) => {
    try {
        const response = await axiosInstance.get(`/api/rocControlFinding/getControlData/${projectId}/Control-${controlNo}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching control data:", error);
        throw error;
    }
};