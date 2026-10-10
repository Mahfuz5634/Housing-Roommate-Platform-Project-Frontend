'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { apiClient } from '@/lib/apiClient';
import { BookingRequest } from '@/types';
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
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadBookings() {
      setIsLoading(true);
      try {
        const res = await apiClient.get<BookingRequest[]>('/bookings/my-bookings');
        if (isMounted && res.success && Array.isArray(res.data)) {
          setBookings(res.data);
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to load booking applications');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePayDeposit = async (bookingId: string) => {
    setIsProcessingPayment(bookingId);
    try {
      const res = await apiClient.post<{ sessionId: string; paymentUrl: string }>('/payments/checkout-session', {
        bookingRequestId: bookingId,
      });

      if (res.success && res.data) {
        toast.success('Redirecting to Stripe Test Checkout...');
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Leases &amp; Applications</span>
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

      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isApproved = booking.status === 'APPROVED';
            const isPaid = booking.status === 'COMPLETED';

            return (
              <Card key={booking.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Property & Room Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge status={booking.status}>{booking.status}</Badge>
                      <span className="text-xs text-slate-400">
                        Applied {formatDate(booking.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {booking.property?.title || 'Urban Apartment'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-blue-500" />
                        Room: <strong className="text-slate-700 dark:text-slate-300">{booking.room?.title || 'Private Room'}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Move-in: {formatDate(booking.moveInDate)}
                      </span>
                    </div>

                    {booking.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 italic">
                        &quot;{booking.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Financials & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 font-medium">Deposit Escrow</span>
                      <p className="text-xl font-black text-slate-900 dark:text-slate-100">
                        {formatCurrency(booking.depositAmount)}
                      </p>
                      <span className="text-[10px] text-slate-400">Monthly Rent: {formatCurrency(booking.totalAmount)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isApproved && (
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={isProcessingPayment === booking.id}
                          onClick={() => handlePayDeposit(booking.id)}
                          className="gap-2 bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md"
                        >
                          <CreditCard className="w-4 h-4" /> Pay Deposit (Stripe)
                        </Button>
                      )}

                      {isPaid && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Lease Confirmed
                        </div>
                      )}

                      {booking.property?.id && (
                        <Link href={`/properties/${booking.property.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Property
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Booking Applications Yet"
          description="Browse our verified city apartments and submit your first room reservation application."
          actionLabel="Find a Place to Live"
          onAction={() => router.push('/properties')}
        />
      )}
    </div>
  );
}
