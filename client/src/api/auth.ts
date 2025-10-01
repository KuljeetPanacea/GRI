import { AxiosInstance } from 'axios';

interface RegisterData {
  tenantName: string;
  tenantEmail: string;
  password: string;
  tenantPhone: number;
  tenantPhoneCountryCode: number;
}

export const login = async (axiosInstance: AxiosInstance, credentials: { userEmail: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/api/auth/login', credentials, { withCredentials: true });
        return response;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};
 
export const logout = async (axiosInstance: AxiosInstance) => {
    try {
        const response = await axiosInstance.post('/api/auth/logout', {}, { withCredentials: true });
        return response;
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};
 
export const register = async (axiosInstance: AxiosInstance, userData: RegisterData) => {
    try {
        const response = await axiosInstance.post('/api/auth/register', userData, { withCredentials: true });
        return response;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};
 

export const resetPassowrd = async (axiosInstance: AxiosInstance, userId: string,password:string) => {
    try {
        const response = await axiosInstance.post(`/api/auth/reset-password/${userId}`, {password}, { withCredentials: true });
        return response;
    } catch (error) {
        console.error('Error during Update password:', error);
        throw error;
    }
};