'use client';
import { useMemo } from 'react';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMessage } from '../redux/loginSlice';
import { setForbidden } from '../redux/forbiddenSlice';


// const API_BASE_URL = '/api'; 
  const API_BASE_URL = 'http://localhost:8000';
// const API_BASE_URL = 'https://8614-13-126-133-4.ngrok-free.app/';

interface ErrorResponse {
  message: string;
}
const useAxios = (): AxiosInstance => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const axiosInstance: AxiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const status = error.response?.status;
        const errorMessage = (error.response?.data as ErrorResponse)?.message;
        console.error("API error:", errorMessage, status);
        // 401
        if (status === 401) {
          if (errorMessage === "Authentication required") {
            localStorage.clear();
            console.warn("Token expired, logging out...");
            navigate("/");
            dispatch(setMessage("Please login to continue!"));
          } else if (errorMessage?.includes("Authorization Error")) {
            console.error("Authorization error, redirecting...");
          }
        }

        // 403 (Forbidden)
        if (status === 403) {
           dispatch(setForbidden());
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return axiosInstance;
};

export default useAxios;
