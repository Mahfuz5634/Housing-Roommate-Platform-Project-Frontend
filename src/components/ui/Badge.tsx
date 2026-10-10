import React from 'react';
import { cn, getStatusColor } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'status' | 'primary' | 'secondary' | 'outline';
  status?: string;
}

export function Badge({ className, variant = 'status', status, children, ...props }: BadgeProps) {
  if (variant === 'status' && status) {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
          getStatusColor(status),
          className
        )}
        {...props}
      >
        {children || status}
      </span>
    );
  }

  const variants = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    outline: 'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300',
    status: '',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
