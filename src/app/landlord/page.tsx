'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { apiClient } from '@/lib/apiClient';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RevenueAreaChart, BookingStatusBarChart } from '@/components/dashboard/AnalyticsCharts';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Property, BookingRequest } from '@/types';
import {
  Building,
  DollarSign,
  Users,
  CheckCircle,
  PlusCircle,
  FileCheck2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function LandlordOverviewPage() {
  const { user } = useAuthStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLandlordOverview() {
      setIsLoading(true);
      try {
        const [propsRes, booksRes] = await Promise.allSettled([
          apiClient.get<Property[]>('/properties'),
          apiClient.get<BookingRequest[]>('/bookings/landlord'),
        ]);

        if (isMounted) {
          if (propsRes.status === 'fulfilled' && propsRes.value.success && Array.isArray(propsRes.value.data)) {
            setProperties(propsRes.value.data);
          }
          if (booksRes.status === 'fulfilled' && booksRes.value.success && Array.isArray(booksRes.value.data)) {
            setBookings(booksRes.value.data);
          }
        }
      } catch (err: any) {
        console.error('Error loading landlord overview', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadLandlordOverview();
    return () => {
      isMounted = false;
    };
  }, []);

  const pendingApplications = bookings.filter((b) => b.status === 'PENDING');
  const totalRentTarget = properties.reduce((acc, p) => acc + p.totalRent, 0);

  const revenueData = [
    { month: 'Jun', revenue: 0, bookings: 0 },
    { month: 'Jul', revenue: 0, bookings: 0 },
    { month: 'Aug', revenue: 0, bookings: 0 },
    { month: 'Sep', revenue: 0, bookings: 0 },
    { month: 'Oct', revenue: totalRentTarget, bookings: bookings.length },
  ];

  const bookingStatusData = [
    { name: 'Completed', value: bookings.filter((b) => b.status === 'COMPLETED').length },
    { name: 'Pending', value: bookings.filter((b) => b.status === 'PENDING').length },
    { name: 'Approved', value: bookings.filter((b) => b.status === 'APPROVED').length },
  ];

  return (
    <div className="space-y-8">
      {/* Landlord Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 text-white shadow-lg">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
            Property Provider Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.profile?.firstName || 'Landlord'}! 🛠️
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            Manage your rental listings, review tenant applications, and monitor monthly co-living revenue.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/landlord/properties/create">
            <Button variant="secondary" size="sm" className="bg-white text-amber-900 hover:bg-amber-50 font-bold shrink-0 gap-1.5">
              <PlusCircle className="w-4 h-4" /> Post New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Managed Listings"
            value={properties.length}
            icon={Building}
            description="Active co-living inventory"
          />
          <StatCard
            title="Pending Applications"
            value={pendingApplications.length}
            icon={FileCheck2}
            description="Tenant screening queue"
          />
          <StatCard
            title="Monthly Target Rent"
            value={formatCurrency(totalRentTarget)}
            icon={DollarSign}
            description="Combined rental portfolio"
          />
          <StatCard
            title="Occupancy Rate"
            value="75%"
            icon={TrendingUp}
            description="Live room fill rate"
          />
        </div>
      )}

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
            Expected Monthly Cash Flow
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Gross lease revenues generated from occupied rooms
          </p>
          <RevenueAreaChart data={revenueData} />
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
            Application Pipeline
          </h3>
          <p className="text-xs text-slate-500 mb-6">Current applicant funnel</p>
          <BookingStatusBarChart data={bookingStatusData} />
        </Card>
      </div>

      {/* Pending Screening Applications Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Tenant Applications
          </h2>
          <Link href="/landlord/bookings" className="text-xs font-semibold text-amber-600 hover:underline">
            View All Applications →
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => (
              <Card key={b.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge status={b.status}>{b.status}</Badge>
                    <span className="text-xs text-slate-400">Target Move-in {formatDate(b.moveInDate)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {b.property?.title || 'Rental Unit'} • {b.room?.title || 'Private Room'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Applicant: {b.tenant?.profile?.firstName || 'Prospective'} {b.tenant?.profile?.lastName || 'Tenant'}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(b.depositAmount)}
                    </span>
                    <p className="text-[10px] text-slate-400">Deposit Escrow</p>
                  </div>
                  <Link href="/landlord/bookings">
                    <Button variant="outline" size="sm" className="text-xs">
                      Review Application
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-xs text-slate-500">
            No pending tenant applications at this time.
          </Card>
        )}
      </div>
    </div>
  );
}
