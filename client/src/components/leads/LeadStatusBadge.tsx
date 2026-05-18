import { LeadStatus } from '@/types/lead.types';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; classes: string; dot: string }> = {
  new: {
    label: 'New',
    classes: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  contacted: {
    label: 'Contacted',
    classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  qualified: {
    label: 'Qualified',
    classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  lost: {
    label: 'Lost',
    classes: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
};

export const LeadStatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        config.classes,
      ].join(' ')}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
