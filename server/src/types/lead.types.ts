import { Document, Types } from 'mongoose';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
export type LeadSource = 'website' | 'instagram' | 'referral';
export type SortOrder = 'latest' | 'oldest';

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead, Document {
  _id: Types.ObjectId;
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

export interface LeadQueryFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}
