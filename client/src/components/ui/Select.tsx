import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  leftElement?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, leftElement, className = '', id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400 z-10">
              {leftElement}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            className={[
              'w-full appearance-none rounded-lg border text-sm transition-colors duration-150',
              'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'py-2 pr-8',
              error
                ? 'border-rose-400 focus:ring-rose-400'
                : 'border-slate-300 dark:border-slate-600 focus:ring-brand-500 focus:border-brand-500',
              leftElement ? 'pl-9' : 'pl-3',
              className,
            ].join(' ')}
            {...props}
          >
            {placeholder && (
              <option value="">{placeholder}</option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-2.5 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
