import axiosInstance from './axios';
import { ApiResponse } from '@/types/api.types';
import { User, LoginPayload, RegisterPayload } from '@/types/user.types';

interface AuthData {
  user: User;
  token: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthData>> => {
    const { data } = await axiosInstance.post<ApiResponse<AuthData>>('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<AuthData>> => {
    const { data } = await axiosInstance.post<ApiResponse<AuthData>>('/auth/login', payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return data;
  },
};
