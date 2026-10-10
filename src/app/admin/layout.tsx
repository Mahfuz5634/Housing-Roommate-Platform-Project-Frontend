'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export const dynamic = 'force-dynamic';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">{children}</div>
      </div>
    </div>
  );
}
