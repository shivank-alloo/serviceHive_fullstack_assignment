import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftElement, rightElement, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftElement}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-lg border text-sm transition-colors duration-150',
              'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-rose-400 focus:ring-rose-400 dark:border-rose-500'
                : 'border-slate-300 dark:border-slate-600 focus:ring-brand-500 focus:border-brand-500',
              leftElement ? 'pl-9' : 'pl-3',
              rightElement ? 'pr-9' : 'pr-3',
              'py-2',
              className,
            ].join(' ')}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-rose-500 flex items-center gap-1" role="alert">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
