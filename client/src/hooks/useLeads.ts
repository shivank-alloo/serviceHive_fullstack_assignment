import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi } from '@/api/lead.api';
import { LeadFilters } from '@/types/filter.types';
import { CreateLeadPayload, UpdateLeadPayload } from '@/types/lead.types';
import toast from 'react-hot-toast';
import { getApiError } from '@/context/AuthContext';

export const LEADS_QUERY_KEY = 'leads' as const;

export const useLeads = (filters: LeadFilters) => {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, filters],
    queryFn: () => leadApi.getLeads(filters),
    placeholderData: (prev) => prev, // Keep stale data while fetching next page
    staleTime: 30_000,
  });
};

export const useLeadById = (id: string) => {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, id],
    queryFn: () => leadApi.getLeadById(id),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadApi.createLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      toast.success('Lead created successfully');
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) =>
      leadApi.updateLead(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      toast.success('Lead updated successfully');
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      toast.success('Lead deleted successfully');
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
};
