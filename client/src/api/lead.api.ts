import axiosInstance from './axios';
import { ApiResponse } from '@/types/api.types';
import { Lead, CreateLeadPayload, UpdateLeadPayload } from '@/types/lead.types';
import { LeadFilters } from '@/types/filter.types';

const buildParams = (filters: LeadFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  if (filters.status) params['status'] = filters.status;
  if (filters.source) params['source'] = filters.source;
  if (filters.search) params['search'] = filters.search;
  if (filters.sort) params['sort'] = filters.sort;
  if (filters.page) params['page'] = String(filters.page);
  if (filters.limit) params['limit'] = String(filters.limit);
  return params;
};

export const leadApi = {
  getLeads: async (filters: LeadFilters): Promise<ApiResponse<Lead[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<Lead[]>>('/leads', {
      params: buildParams(filters),
    });
    return data;
  },

  getLeadById: async (id: string): Promise<ApiResponse<Lead>> => {
    const { data } = await axiosInstance.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data;
  },

  createLead: async (payload: CreateLeadPayload): Promise<ApiResponse<Lead>> => {
    const { data } = await axiosInstance.post<ApiResponse<Lead>>('/leads', payload);
    return data;
  },

  updateLead: async (id: string, payload: UpdateLeadPayload): Promise<ApiResponse<Lead>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Lead>>(`/leads/${id}`, payload);
    return data;
  },

  deleteLead: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(`/leads/${id}`);
    return data;
  },

  exportLeads: async (filters: Omit<LeadFilters, 'page' | 'limit'>): Promise<Blob> => {
    const params = buildParams(filters);
    const { data } = await axiosInstance.get<Blob>('/leads/export', {
      params,
      responseType: 'blob',
    });
    return data;
  },
};
