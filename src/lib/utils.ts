import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date | undefined | null): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'AVAILABLE':
    case 'APPROVED':
    case 'COMPLETED':
    case 'RESOLVED':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    case 'PENDING':
    case 'IN_PROGRESS':
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    case 'REJECTED':
    case 'CANCELLED':
    case 'FAILED':
    case 'BLOCKED':
      return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    case 'RENTED':
    case 'MAINTENANCE':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toUpperCase()) {
    case 'URGENT':
      return 'bg-rose-500 text-white';
    case 'HIGH':
      return 'bg-amber-500 text-white';
    case 'MEDIUM':
      return 'bg-blue-500 text-white';
    case 'LOW':
    default:
      return 'bg-slate-500 text-white';
  }
}
