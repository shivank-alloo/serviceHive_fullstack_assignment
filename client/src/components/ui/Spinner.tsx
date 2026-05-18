interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <div
    className={[
      'rounded-full animate-spin',
      'border-slate-200 border-t-brand-600',
      'dark:border-slate-700 dark:border-t-brand-400',
      sizeClasses[size],
      className,
    ].join(' ')}
    role="status"
    aria-label="Loading"
  />
);

export const FullPageSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading…</p>
    </div>
  </div>
);
