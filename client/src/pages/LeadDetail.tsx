import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Globe, Instagram, Users, Calendar, Mail, User, Tag } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge';
import { LeadForm } from '@/components/leads/LeadForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useLeadById, useDeleteLead } from '@/hooks/useLeads';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/formatDate';

const SOURCE_ICON: Record<string, React.ReactNode> = {
  website: <Globe className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  referral: <Users className="w-4 h-4" />,
};

const LeadDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: response, isLoading, isError } = useLeadById(id);
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const lead = response?.data;
  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <DashboardLayout title="Lead Detail">
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !lead) {
    return (
      <DashboardLayout title="Lead Detail">
        <div className="text-center py-24">
          <p className="text-slate-500 dark:text-slate-400">Lead not found or access denied.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>← Go back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const detailItems = [
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: lead.email },
    { icon: SOURCE_ICON[lead.source], label: 'Source', value: lead.source.charAt(0).toUpperCase() + lead.source.slice(1) },
    { icon: <Tag className="w-4 h-4" />, label: 'Status', value: <LeadStatusBadge status={lead.status} size="sm" /> },
    { icon: <User className="w-4 h-4" />, label: 'Created by', value: lead.createdBy.name },
    { icon: <Calendar className="w-4 h-4" />, label: 'Created at', value: formatDate(lead.createdAt) },
    { icon: <Calendar className="w-4 h-4" />, label: 'Last updated', value: formatDate(lead.updatedAt) },
  ];

  return (
    <DashboardLayout title="Lead Detail">
      <div className="max-w-2xl space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{lead.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button id="edit-lead-btn" variant="outline" size="sm" onClick={() => setIsEditOpen(true)} leftIcon={<Edit className="w-3.5 h-3.5" />}>Edit</Button>
            {isAdmin && (
              <Button id="delete-lead-btn" variant="danger" size="sm" onClick={() => setIsDeleteOpen(true)} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>Delete</Button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/40 rounded-xl flex items-center justify-center">
                <span className="text-brand-700 dark:text-brand-300 font-bold text-lg">{lead.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{lead.name}</p>
                <LeadStatusBadge status={lead.status} />
              </div>
            </div>
          </div>
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {detailItems.map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mt-0.5 text-slate-500 shrink-0">{icon}</div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                  <div className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Lead" size="md">
        <LeadForm lead={lead} onSuccess={() => setIsEditOpen(false)} onCancel={() => setIsEditOpen(false)} />
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Lead" size="sm"
        footer={<>
          <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" isLoading={isDeleting} onClick={() => deleteLead(lead._id, { onSuccess: () => navigate('/dashboard') })}>Delete</Button>
        </>}>
        <p className="text-slate-600 dark:text-slate-400">Delete <strong className="text-slate-900 dark:text-slate-200">{lead.name}</strong>? This cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
};

export default LeadDetail;
