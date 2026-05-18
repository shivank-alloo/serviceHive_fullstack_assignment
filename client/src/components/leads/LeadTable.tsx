import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Globe, Instagram, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lead } from '@/types/lead.types';
import { PaginationMeta } from '@/types/api.types';
import { LeadStatusBadge } from './LeadStatusBadge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from './LeadForm';
import { useDeleteLead } from '@/hooks/useLeads';
import { useAuth } from '@/context/AuthContext';
import { formatRelativeTime } from '@/utils/formatDate';

const SOURCE_ICON: Record<string, React.ReactNode> = {
  website: <Globe className="w-3.5 h-3.5" />,
  instagram: <Instagram className="w-3.5 h-3.5" />,
  referral: <Users className="w-3.5 h-3.5" />,
};

interface LeadTableProps {
  leads: Lead[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const TableSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        {Array.from({ length: 6 }).map((__, j) => (
          <td key={j} className="px-4 py-3.5">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const EmptyState = () => (
  <tr>
    <td colSpan={6} className="py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
          <Users className="w-7 h-7 text-slate-400" />
        </div>
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-300">No leads found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your filters or create a new lead
          </p>
        </div>
      </div>
    </td>
  </tr>
);

export const LeadTable = ({ leads, pagination, isLoading, onPageChange }: LeadTableProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();

  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <TableSkeleton />
            ) : leads.length === 0 ? (
              <EmptyState />
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/leads/${lead._id}`)}
                >
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {lead.name}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{lead.email}</td>
                  <td className="px-4 py-3.5">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 capitalize">
                      {SOURCE_ICON[lead.source]}
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatRelativeTime(lead.createdAt)}
                  </td>
                  <td
                    className="px-4 py-3.5"
                    onClick={(e) => e.stopPropagation()} // Prevent row click
                  >
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditLead(lead)}
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(lead)}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          aria-label={`Delete ${lead.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing{' '}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-medium text-slate-700 dark:text-slate-300">{pagination.total}</span> leads
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-xs text-slate-600 dark:text-slate-400 px-2">
              {pagination.page} / {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editLead}
        onClose={() => setEditLead(null)}
        title="Edit Lead"
        size="md"
      >
        {editLead && (
          <LeadForm
            lead={editLead}
            onSuccess={() => setEditLead(null)}
            onCancel={() => setEditLead(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Lead"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={isDeleting}
              onClick={() => {
                if (deleteTarget) {
                  deleteLead(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) });
                }
              }}
            >
              Delete Lead
            </Button>
          </>
        }
      >
        <p className="text-slate-600 dark:text-slate-400">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            {deleteTarget?.name}
          </span>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
