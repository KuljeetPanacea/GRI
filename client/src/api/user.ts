import { AxiosInstance } from 'axios';
import { User } from '../redux/AddNewUserSlice';
import { userDataFilter } from '../redux/userManagementSlice';

export const getUsers = async (
    axiosInstance: AxiosInstance,
    page?:number,
    limit?:number,
    filters?: userDataFilter
) => {
    try {
        const response = await axiosInstance.get('/api/users/search', { 
            withCredentials: true,
            params:{
                page,
                limit,
                createDtTime:filters?.usersOnboarded,         
                status:filters?.status,
                name:filters?.search,
                roles:filters?.roles
            
         }
        }); 
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getAllRoles = async (axiosInstance: AxiosInstance, ) => {
    try {
        const response = await axiosInstance.get('/api/lookup/lookupcategory/CreateUserRole', { withCredentials: true });
        return response;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
    
}
export const getUserByRole = async (axiosInstance: AxiosInstance, Role: string) => {
    try{
        const response = await axiosInstance.get(`/api/users/roles/${Role}`, { withCredentials: true });
        return response.data;
    }
    catch(error){
    if (error instanceof Error) {
        console.error('Error fetching users:', error);
        throw error;
    }
    }
}

export const addUsers = async (axiosInstance: AxiosInstance, user: User) => {
    try {
        const response = await axiosInstance.post('/api/users/createuser', user, 
            { withCredentials: true }); 
        return response.data;
    } catch (error) {
        console.error('Error creating users:', error);
        throw error;
    }
};

export const updateUsers = async (axiosInstance: AxiosInstance, user: User, id: string) => {
    try {
        const response = await axiosInstance.patch(`/api/users/updateuser/${id}`, user, 
            { withCredentials: true }); 
        return response.data;
    } catch (error) {
        console.error('Error updating users:', error);
        throw error;
    }
};

export const deleteUsers = async (axiosInstance: AxiosInstance, userId: string) => {
    try {
        const response = await axiosInstance.delete(`/api/users/deleteuser/${userId}`, 
            { withCredentials: true }); 
        return response.data;
    } catch (error) {
        console.error('Error deleting users:', error);
        throw error;
    }
};


export const getUserById = async (axiosInstance: AxiosInstance, userId: string | undefined) => {
    try {
        const response = await axiosInstance.get(`/api/users/by-id/${userId}`, 
            { withCredentials: true }); 
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}