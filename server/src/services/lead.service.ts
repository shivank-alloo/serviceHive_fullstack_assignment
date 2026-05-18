import { FilterQuery, Types } from 'mongoose';
import { Lead } from '../models/Lead.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import {
  ILeadDocument,
  CreateLeadPayload,
  UpdateLeadPayload,
  LeadQueryFilters,
} from '../types/lead.types';
import { UserRole } from '../types/user.types';

export class LeadService {
  async getLeads(
    userId: string,
    userRole: UserRole,
    filters: LeadQueryFilters,
  ): Promise<ApiResponse<ILeadDocument[]>> {
    const { status, source, search, sort = 'latest', page = 1, limit = 10 } = filters;

    const query: FilterQuery<ILeadDocument> = {};

    // RBAC: Sales users only see their own leads
    if (userRole === 'sales') {
      query['createdBy'] = new Types.ObjectId(userId);
    }

    if (status) query['status'] = status;
    if (source) query['source'] = source;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query['$or'] = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === 'latest' ? -1 : 1;
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('createdBy', 'name email role')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(query),
    ]);

    return ApiResponse.paginated<ILeadDocument[]>(
      leads as unknown as ILeadDocument[],
      total,
      page,
      limit,
      'Leads fetched successfully',
    );
  }

  async getLeadById(leadId: string, userId: string, userRole: UserRole): Promise<ILeadDocument> {
    const lead = await Lead.findById(leadId).populate('createdBy', 'name email role');

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    // Sales users can only access their own leads
    if (userRole === 'sales' && lead.createdBy.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to view this lead');
    }

    return lead;
  }

  async createLead(userId: string, payload: CreateLeadPayload): Promise<ILeadDocument> {
    const lead = await Lead.create({
      ...payload,
      createdBy: new Types.ObjectId(userId),
    });

    return lead.populate('createdBy', 'name email role');
  }

  async updateLead(
    leadId: string,
    userId: string,
    userRole: UserRole,
    payload: UpdateLeadPayload,
  ): Promise<ILeadDocument> {
    const lead = await Lead.findById(leadId);

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    // Sales users can only update their own leads
    if (userRole === 'sales' && lead.createdBy.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to update this lead');
    }

    const updatedLead = await Lead.findByIdAndUpdate(leadId, payload, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email role');

    if (!updatedLead) {
      throw ApiError.notFound('Lead not found after update');
    }

    return updatedLead;
  }

  async deleteLead(leadId: string): Promise<void> {
    const lead = await Lead.findByIdAndDelete(leadId);
    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }
  }

  async exportLeads(
    userId: string,
    userRole: UserRole,
    filters: Omit<LeadQueryFilters, 'page' | 'limit'>,
  ): Promise<ILeadDocument[]> {
    const query: FilterQuery<ILeadDocument> = {};

    if (userRole === 'sales') {
      query['createdBy'] = new Types.ObjectId(userId);
    }

    if (filters.status) query['status'] = filters.status;
    if (filters.source) query['source'] = filters.source;

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query['$or'] = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = filters.sort === 'oldest' ? 1 : -1;

    const leads = await Lead.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: sortOrder })
      .lean();

    return leads as unknown as ILeadDocument[];
  }
}

export const leadService = new LeadService();
