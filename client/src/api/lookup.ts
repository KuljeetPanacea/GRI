import { AxiosInstance } from 'axios';

export const getLookup = async (category:string, axiosInstance:AxiosInstance) => {
  try {
    const response = await axiosInstance.get(`/api/lookup/lookupcategory/${category}`, { withCredentials: true });
    const formattedOptions = response.data[0].values.map((item: { name: string, value?:string }) => ({
        label: item.name,
        value: item.value ? item.value : item.name,
      }));
    return formattedOptions;
  } catch (error) {
    console.error('Error fetching assessed entities:', error);
    throw error;
  }
};

 