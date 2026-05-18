import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiErrorResponse } from '@/types/api.types';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — placeholder for future token injection
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor — normalize errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      // Let callers handle 401 (React Query + AuthContext will redirect)
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
