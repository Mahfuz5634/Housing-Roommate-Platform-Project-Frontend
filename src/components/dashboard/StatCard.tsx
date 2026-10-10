import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <Card className="p-5 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-semibold ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {change}
          </span>
        )}
      </div>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
    </Card>
  );
}
