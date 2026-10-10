'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { apiClient } from '@/lib/apiClient';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BookingRequest } from '@/types';
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
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [bookingsRes, maintRes] = await Promise.allSettled([
          apiClient.get<BookingRequest[]>('/bookings/my-bookings'),
          apiClient.get<any[]>('/maintenance/my-requests'),
        ]);

        if (isMounted) {
          if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success && Array.isArray(bookingsRes.value.data)) {
            setBookings(bookingsRes.value.data);
          }
          if (maintRes.status === 'fulfilled' && maintRes.value.success && Array.isArray(maintRes.value.data)) {
            setMaintenance(maintRes.value.data);
          }
        }
      } catch (err: any) {
        console.error('Error fetching tenant dashboard overview', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

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
            <Button variant="primary" size="sm" className="bg-amber-600 hover:bg-amber-700 shrink-0 font-bold">
              Pay Deposit Now
            </Button>
          </Link>
        </Card>
      )}

      {/* Recent Applications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Recent Applications
          </h2>
          <Link href="/dashboard/bookings" className="text-xs font-semibold text-blue-600 hover:underline">
            View All →
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => (
              <Card key={b.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge status={b.status}>{b.status}</Badge>
                    <span className="text-xs text-slate-400">Move-in {formatDate(b.moveInDate)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {b.property?.title || 'Shared Urban Space'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Room: {b.room?.title || 'Private Bedroom'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(b.depositAmount)}
                  </span>
                  <p className="text-[10px] text-slate-400">Deposit Escrow</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-xs text-slate-500">
            No applications yet. Explore verified listings to find your next home.
          </Card>
        )}
      </div>
    </div>
  );
}
