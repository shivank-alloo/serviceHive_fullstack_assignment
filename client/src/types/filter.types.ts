import { LeadStatus, LeadSource, SortOrder } from './lead.types';

export interface LeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}

export const DEFAULT_FILTERS: Required<LeadFilters> = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
  limit: 10,
};
