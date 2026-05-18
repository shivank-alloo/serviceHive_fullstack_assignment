export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
export type LeadSource = 'website' | 'instagram' | 'referral';
export type SortOrder = 'latest' | 'oldest';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

export const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'lost', label: 'Lost' },
];

export const LEAD_SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'referral', label: 'Referral' },
];
