'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { DEMO_BOOKINGS, DEMO_MAINTENANCE } from '@/lib/mockData';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  FileCheck2,
  Wrench,
  CreditCard,
  UserCheck,
  Building,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function TenantDashboardOverviewPage() {
  const { user } = useAuthStore();
  const bookings = DEMO_BOOKINGS;
  const maintenance = DEMO_MAINTENANCE;

  const pendingBooking = bookings.find((b) => b.status === 'APPROVED');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white shadow-lg">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
            Tenant Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.profile?.firstName || 'Renter'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Track your room leases, submit 24/7 maintenance tickets, and browse roommate compatibility matches.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/roommates">
            <Button variant="secondary" size="sm" className="bg-white text-blue-900 hover:bg-blue-50 font-bold shrink-0">
              Find Roommates
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active Applications"
          value={bookings.length}
          icon={FileCheck2}
          description="Total lease requests"
        />
        <StatCard
          title="Approved Leases"
          value={bookings.filter((b) => b.status === 'APPROVED' || b.status === 'COMPLETED').length}
          icon={Building}
          description="Ready for move-in"
        />
        <StatCard
          title="Open Maintenance"
          value={maintenance.filter((m) => m.status !== 'RESOLVED').length}
          icon={Wrench}
          description="In progress requests"
        />
        <StatCard
          title="Lifestyle Match"
          value="95%"
          icon={UserCheck}
          description="Profile completeness"
        />
      </div>

      {/* Action Alert if Pending Payment */}
      {pendingBooking && (
        <Card className="p-6 bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Action Required: Booking Approved by Landlord!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Your application for <span className="font-semibold">{pendingBooking.property?.title}</span> was approved. Secure your room with the deposit.
              </p>
            </div>
          </div>
          <Link href="/dashboard/bookings">
            <Button variant="primary" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0">
              Pay Deposit (${pendingBooking.depositAmount})
            </Button>
          </Link>
        </Card>
      )}

      {/* Active Bookings & Maintenance Two-Column Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bookings Preview */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" /> Recent Booking Requests
            </h3>
            <Link href="/dashboard/bookings" className="text-xs text-blue-600 hover:underline font-semibold">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {b.property?.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Move-in: {formatDate(b.moveInDate)} • Rent: {formatCurrency(b.totalAmount)}
                  </p>
                </div>
                <Badge status={b.status}>{b.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Maintenance Preview */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" /> Active Maintenance Tickets
            </h3>
            <Link href="/dashboard/maintenance" className="text-xs text-blue-600 hover:underline font-semibold">
              Submit Ticket →
            </Link>
          </div>

          <div className="space-y-3">
            {maintenance.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Category: {m.category} • Priority: {m.priority}
                  </p>
                </div>
                <Badge status={m.status}>{m.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
