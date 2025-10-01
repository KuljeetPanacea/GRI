import { AxiosInstance } from 'axios';

export const uploadEvidence = async(
    axiosInstance: AxiosInstance,
    assesmentId: string,
    Evidence: object
) => {
    try {
        const response = await axiosInstance.patch(
            `/api/assesment-task/updateassesment/${assesmentId}`,
            Evidence,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating client:', error);
        throw error;
    }
};
 