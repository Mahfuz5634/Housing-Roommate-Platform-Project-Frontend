'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RotateCcw, Home, HelpCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id') || 'book-001';

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <Card className="p-6 sm:p-8 text-center space-y-6 shadow-xl border-amber-200 dark:border-amber-900/60">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border-2 border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Checkout Cancelled
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Payment Incomplete
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              You were not charged. Your booking application is still on hold and you can complete the deposit at any time.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Booking Reference: <span className="font-mono text-slate-500">{bookingId}</span>
            </p>
            <p className="text-slate-500">
              Landlord approval remains valid for 48 hours to complete deposit funding.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/dashboard/bookings" className="flex-1">
              <Button variant="primary" className="w-full justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Return to Bookings
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full justify-center gap-2">
                <Home className="w-4 h-4" /> Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
