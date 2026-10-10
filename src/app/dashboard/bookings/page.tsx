'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DEMO_BOOKINGS } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';
import {
  Building,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react';

export default function TenantBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState(DEMO_BOOKINGS);
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);

  const handlePayDeposit = async (bookingId: string) => {
    setIsProcessingPayment(bookingId);
    try {
      const res = await apiClient.post<{ sessionId: string; paymentUrl: string }>('/payments/checkout-session', {
        bookingRequestId: bookingId,
      });

      if (res.success && res.data) {
        toast.success('Redirecting to Stripe Test Checkout...');
        // If Stripe returns direct paymentUrl or fallback URL
        if (res.data.paymentUrl.startsWith('http')) {
          window.location.href = res.data.paymentUrl;
        } else {
          router.push(res.data.paymentUrl);
        }
      } else {
        toast.error(res.message || 'Unable to initiate payment session');
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation error');
    } finally {
      setIsProcessingPayment(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking application?')) return;
    try {
      await apiClient.patch(`/bookings/${bookingId}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b))
      );
      toast.success('Booking application cancelled');
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Leases & Applications</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            My Booking Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track landlord approvals and fund your security deposit via Stripe test checkout
          </p>
        </div>

        <Link href="/properties">
          <Button variant="primary" size="sm" className="font-semibold shadow-sm">
            Browse More Listings
          </Button>
        </Link>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isApproved = booking.status === 'APPROVED';
            const isCompleted = booking.status === 'COMPLETED';

            return (
              <Card key={booking.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {booking.property?.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Room: <span className="font-semibold">{booking.room?.title || 'Entire Property'}</span> • {booking.property?.city}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Move-in Date</span>
                        <span>{formatDate(booking.moveInDate)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Rent</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Security Deposit</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(booking.depositAmount)}</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                        &quot;{booking.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-4 lg:pt-0">
                    <Badge status={booking.status}>{booking.status}</Badge>

                    {isApproved && (
                      <div className="space-y-2 w-full sm:w-auto">
                        <Button
                          variant="primary"
                          onClick={() => handlePayDeposit(booking.id)}
                          isLoading={isProcessingPayment === booking.id}
                          className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md font-bold"
                        >
                          <CreditCard className="w-4 h-4" /> Pay Deposit ({formatCurrency(booking.depositAmount)})
                        </Button>
                        <p className="text-[10px] text-slate-400 text-center lg:text-right">
                          🔒 Secured with Stripe Test Escrow
                        </p>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-xs font-bold">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Lease Confirmed & Paid
                      </div>
                    )}

                    {booking.status === 'PENDING' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-rose-600 hover:bg-rose-50"
                      >
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No booking applications yet"
          description="Browse available properties and reserve a room to see your application status here."
          actionLabel="Find a Room"
          onAction={() => router.push('/properties')}
        />
      )}
    </div>
  );
}
