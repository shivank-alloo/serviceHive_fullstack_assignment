import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { leadService } from '../services/lead.service';
import {
  CreateLeadPayload,
  UpdateLeadPayload,
  LeadQueryFilters,
  LeadStatus,
  LeadSource,
  SortOrder,
} from '../types/lead.types';
import { ILeadDocument } from '../types/lead.types';

export const getLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const filters: LeadQueryFilters = {
    status: req.query['status'] as LeadStatus | undefined,
    source: req.query['source'] as LeadSource | undefined,
    search: req.query['search'] as string | undefined,
    sort: (req.query['sort'] as SortOrder | undefined) ?? 'latest',
    page: req.query['page'] ? parseInt(req.query['page'] as string, 10) : 1,
    limit: req.query['limit'] ? parseInt(req.query['limit'] as string, 10) : 10,
  };

  const result = await leadService.getLeads(
    req.user!._id.toString(),
    req.user!.role,
    filters,
  );

  res.status(200).json(result);
});

export const getLeadById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const lead = await leadService.getLeadById(
    req.params['id'] as string,
    req.user!._id.toString(),
    req.user!.role,
  );

  res.status(200).json(new ApiResponse(lead, 'Lead fetched successfully'));
});

export const createLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as CreateLeadPayload;
  const lead = await leadService.createLead(req.user!._id.toString(), payload);

  res.status(201).json(new ApiResponse(lead, 'Lead created successfully'));
});

export const updateLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as UpdateLeadPayload;
  const lead = await leadService.updateLead(
    req.params['id'] as string,
    req.user!._id.toString(),
    req.user!.role,
    payload,
  );

  res.status(200).json(new ApiResponse(lead, 'Lead updated successfully'));
});

export const deleteLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await leadService.deleteLead(req.params['id'] as string);
  res.status(200).json(new ApiResponse(null, 'Lead deleted successfully'));
});

export const exportLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const filters = {
    status: req.query['status'] as LeadStatus | undefined,
    source: req.query['source'] as LeadSource | undefined,
    search: req.query['search'] as string | undefined,
    sort: (req.query['sort'] as SortOrder | undefined) ?? 'latest',
  };

  const leads = await leadService.exportLeads(
    req.user!._id.toString(),
    req.user!.role,
    filters,
  );

  const csv = buildCsv(leads);
  const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
});

function buildCsv(leads: ILeadDocument[]): string {
  const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [
    lead._id.toString(),
    `"${lead.name.replace(/"/g, '""')}"`,
    lead.email,
    lead.status,
    lead.source,
    new Date(lead.createdAt).toISOString(),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
