'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { DEMO_PROPERTIES, DEMO_BOOKINGS, DEMO_ADMIN_ANALYTICS } from '@/lib/mockData';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RevenueAreaChart, BookingStatusBarChart } from '@/components/dashboard/AnalyticsCharts';
import { formatCurrency, formatDate } from '@/lib/utils';
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
  const properties = DEMO_PROPERTIES;
  const bookings = DEMO_BOOKINGS;

  const pendingApplications = bookings.filter((b) => b.status === 'PENDING');
  const revenueData = DEMO_ADMIN_ANALYTICS.charts.monthlyRevenue;
  const bookingStatusData = DEMO_ADMIN_ANALYTICS.charts.bookingStatuses;

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active Listings"
          value={properties.length}
          icon={Building}
          description="Verified residences"
        />
        <StatCard
          title="Occupancy Rate"
          value="88%"
          change="+4.2%"
          isPositive={true}
          icon={Users}
          description="Room capacity filled"
        />
        <StatCard
          title="Monthly Revenue"
          value="$11,500"
          change="+8.6%"
          isPositive={true}
          icon={DollarSign}
          description="Expected gross rent"
        />
        <StatCard
          title="Pending Applications"
          value={pendingApplications.length}
          icon={FileCheck2}
          description="Awaiting your approval"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" /> Rental Revenue Trend
              </h3>
              <p className="text-xs text-slate-500">Gross monthly collections over the last 6 months</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +14% YoY
            </span>
          </div>
          <RevenueAreaChart data={revenueData} />
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" /> Booking Statuses
              </h3>
              <p className="text-xs text-slate-500">Breakdown of tenant applications across all units</p>
            </div>
          </div>
          <BookingStatusBarChart data={bookingStatusData} />
        </Card>
      </div>

      {/* Quick Access Listings & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Listings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              My Featured Listings
            </h3>
            <Link href="/landlord/properties" className="text-xs text-amber-600 hover:underline font-semibold">
              Manage All ({properties.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {properties.slice(0, 3).map((prop) => (
              <div key={prop.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {prop.city} • {prop.bedrooms} Bed, {prop.bathrooms} Bath • {formatCurrency(prop.totalRent)}/mo
                  </p>
                </div>
                <Badge status={prop.status}>{prop.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Incoming Applications */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Incoming Tenant Applications
            </h3>
            <Link href="/landlord/bookings" className="text-xs text-amber-600 hover:underline font-semibold">
              Review Applications →
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    Applicant: {b.tenant?.profile?.firstName || 'Tenant'} {b.tenant?.profile?.lastName || 'Morgan'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    For {b.property?.title} • Move-in: {formatDate(b.moveInDate)}
                  </p>
                </div>
                <Badge status={b.status}>{b.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
