import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-4 space-y-4 shadow-sm">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-sm">
      <div className="flex gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-6 flex-1 rounded-md" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
}
