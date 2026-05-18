import { useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LeadFilters } from '@/types/filter.types';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '@/types/lead.types';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const STATUS_FILTER_OPTIONS = [{ value: '', label: 'All Statuses' }, ...LEAD_STATUS_OPTIONS];
const SOURCE_FILTER_OPTIONS = [{ value: '', label: 'All Sources' }, ...LEAD_SOURCE_OPTIONS];

interface LeadFiltersProps {
  filters: LeadFilters;
  searchValue: string; // Raw (undebounced) value for input display
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
  onReset: () => void;
}

export const LeadFiltersBar = ({
  filters,
  searchValue,
  onSearchChange,
  onFilterChange,
  onReset,
}: LeadFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    !!filters.status || !!filters.source || !!filters.search || filters.sort !== 'latest';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4 shadow-sm">
      {/* Search + Toggle */}
      <div className="flex gap-3">
        <Input
          placeholder="Search by name or email…"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          leftElement={<Search className="w-4 h-4" />}
          rightElement={
            searchValue ? (
              <button
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null
          }
          className="h-10"
        />

        <Button
          variant={isExpanded ? 'primary' : 'outline'}
          size="md"
          onClick={() => setIsExpanded((prev) => !prev)}
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          aria-label="Toggle filters"
        >
          Filters
          {hasActiveFilters && (
            <span className="ml-1.5 w-4 h-4 bg-white/30 text-[10px] font-bold rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 animate-slide-up">
          <Select
            label="Status"
            value={filters.status ?? ''}
            options={STATUS_FILTER_OPTIONS}
            onChange={(e) => onFilterChange({ status: e.target.value as LeadFilters['status'], page: 1 })}
          />

          <Select
            label="Source"
            value={filters.source ?? ''}
            options={SOURCE_FILTER_OPTIONS}
            onChange={(e) => onFilterChange({ source: e.target.value as LeadFilters['source'], page: 1 })}
          />

          <Select
            label="Sort By"
            value={filters.sort ?? 'latest'}
            options={SORT_OPTIONS}
            leftElement={<ArrowUpDown className="w-3.5 h-3.5" />}
            onChange={(e) => onFilterChange({ sort: e.target.value as 'latest' | 'oldest', page: 1 })}
          />

          {hasActiveFilters && (
            <div className="sm:col-span-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={onReset} leftIcon={<X className="w-3.5 h-3.5" />}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
