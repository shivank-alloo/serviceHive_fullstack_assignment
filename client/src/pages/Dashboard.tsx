import { useState, useCallback } from 'react';
import { Plus, Download, TrendingUp, Users, Target, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LeadFiltersBar } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/leads/LeadForm';
import { useLeads } from '@/hooks/useLeads';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/context/AuthContext';
import { LeadFilters, DEFAULT_FILTERS } from '@/types/filter.types';
import { leadApi } from '@/api/lead.api';
import { downloadCsv } from '@/utils/csvExport';
import toast from 'react-hot-toast';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ label, value, icon, color }: StatCardProps) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');

  // Debounce search — only triggers API call after 300ms of inactivity
  const debouncedSearch = useDebounce(searchInput, 300);

  const activeFilters: LeadFilters = {
    ...filters,
    search: debouncedSearch || undefined,
  };

  const { data: response, isLoading, isError } = useLeads(activeFilters);

  const leads = response?.data ?? [];
  const pagination = response?.pagination;

  const handleFilterChange = useCallback((updates: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await leadApi.exportLeads({
        status: activeFilters.status,
        source: activeFilters.source,
        search: activeFilters.search,
        sort: activeFilters.sort,
      });
      downloadCsv(blob);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  // Compute stat counts from paginated totals
  const total = pagination?.total ?? 0;

  return (
    <DashboardLayout title="Leads Dashboard">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Leads"
            value={total}
            icon={<Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />}
            color="bg-brand-50 dark:bg-brand-950/50"
          />
          <StatCard
            label="Role"
            value={user?.role === 'admin' ? 'Admin' : 'Sales'}
            icon={<TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            color="bg-emerald-50 dark:bg-emerald-950/50"
          />
          <StatCard
            label="Current Page"
            value={`${pagination?.page ?? 1} / ${pagination?.totalPages ?? 1}`}
            icon={<Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            color="bg-amber-50 dark:bg-amber-950/50"
          />
          <StatCard
            label="Active Filter"
            value={activeFilters.status ? activeFilters.status : activeFilters.source ? activeFilters.source : 'None'}
            icon={<XCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
            color="bg-sky-50 dark:bg-sky-950/50"
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {user?.role === 'sales' ? 'My Leads' : 'All Leads'}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              id="export-csv-btn"
              variant="outline"
              size="sm"
              onClick={handleExport}
              isLoading={isExporting}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
            <Button
              id="create-lead-btn"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <LeadFiltersBar
          filters={activeFilters}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Error state */}
        {isError && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-rose-700 dark:text-rose-400 text-sm">
            Failed to load leads. Please try again.
          </div>
        )}

        {/* Table */}
        <LeadTable
          leads={leads}
          pagination={pagination}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Create Lead Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Lead"
        size="md"
      >
        <LeadForm onSuccess={() => setIsCreateOpen(false)} onCancel={() => setIsCreateOpen(false)} />
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
