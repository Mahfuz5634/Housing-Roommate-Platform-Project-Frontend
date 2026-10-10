'use client';

import React from 'react';
import Link from 'next/link';
import { DEMO_ADMIN_ANALYTICS } from '@/lib/mockData';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  RevenueAreaChart,
  PropertyDistributionPieChart,
  BookingStatusBarChart,
} from '@/components/dashboard/AnalyticsCharts';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  Building,
  DollarSign,
  Layers,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  Server,
  Zap,
} from 'lucide-react';

export default function AdminAnalyticsDashboardPage() {
  const analytics = DEMO_ADMIN_ANALYTICS;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 text-white shadow-lg">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
            Platform Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Analytics 👨‍💼
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
            Real-time platform overview, financial collections, listing moderation, and member growth.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/manage">
            <Button variant="secondary" size="sm" className="bg-white text-purple-900 hover:bg-purple-50 font-bold shrink-0">
              Manage Resources
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Users"
          value={analytics.metrics.totalUsers}
          change="+18.4%"
          isPositive={true}
          icon={Users}
          description="114 Tenants • 34 Landlords"
        />
        <StatCard
          title="Platform Listings"
          value={analytics.metrics.totalProperties}
          change="+6 this week"
          isPositive={true}
          icon={Building}
          description="Verified co-living units"
        />
        <StatCard
          title="Gross Platform Volume"
          value={formatCurrency(analytics.metrics.totalRevenue)}
          change="+24.1%"
          isPositive={true}
          icon={DollarSign}
          description="Total deposits processed"
        />
        <StatCard
          title="Completed Bookings"
          value={analytics.metrics.totalBookings}
          icon={CheckCircle2}
          description="Active lease agreements"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" /> Platform Revenue Growth
              </h3>
              <p className="text-xs text-slate-500">Deposit volume and lease disbursements (USD)</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              +28% Month-over-Month
            </span>
          </div>
          <RevenueAreaChart data={analytics.charts.monthlyRevenue} />
        </Card>

        {/* Property Type Distribution Pie Chart */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Property Distribution
            </h3>
            <p className="text-xs text-slate-500">Unit breakdown by category</p>
          </div>
          <PropertyDistributionPieChart data={analytics.charts.propertyTypes} />
        </Card>
      </div>

      {/* Booking Statuses & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Booking Application Funnel
            </h3>
            <p className="text-xs text-slate-500">Overall status of tenant lease submissions</p>
          </div>
          <BookingStatusBarChart data={analytics.charts.bookingStatuses} />
        </Card>

        {/* System Services Status */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" /> Platform Health
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Server className="w-4 h-4 text-emerald-500" /> PostgreSQL DB
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Operational (28ms)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Zap className="w-4 h-4 text-emerald-500" /> Stripe Test API
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Connected (v2025)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> JWT Auth Service
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Secure</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/admin/manage">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Open Resource Moderation →
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
