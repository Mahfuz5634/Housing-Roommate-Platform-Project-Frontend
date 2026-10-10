'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { apiClient } from '@/lib/apiClient';
import { BookingRequest, BookingStatus } from '@/types';
import { toast } from 'sonner';
import { FileCheck2, Check, X, Building, Calendar, UserCheck } from 'lucide-react';

export default function LandlordBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchLandlordBookings() {
      setIsLoading(true);
      try {
        const res = await apiClient.get<BookingRequest[]>('/bookings/landlord');
        if (isMounted && res.success && Array.isArray(res.data)) {
          setBookings(res.data);
        }
      } catch (err: any) {
        console.error('Could not fetch landlord bookings', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchLandlordBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateStatus = async (bookingId: string, status: BookingStatus) => {
    setIsUpdating(bookingId);
    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      toast.success(`Booking request marked as ${status}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update booking status');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tenant Screening</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
          Booking Applications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review candidate profiles, check move-in schedules, and approve applicants for deposit payment
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isPending = booking.status === 'PENDING';
            return (
              <Card key={booking.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {booking.tenant?.profile?.firstName || 'Applicant'} {booking.tenant?.profile?.lastName || ''}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Applied for: <span className="font-semibold">{booking.property?.title}</span> • {booking.room?.title || 'Entire Unit'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                        <div className="mt-0.5">
                          <Badge status={booking.status}>{booking.status}</Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Move-in Date</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          {formatDate(booking.moveInDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Rent</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          {formatCurrency(booking.totalAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Security Deposit</span>
                        <span className="font-semibold text-emerald-600 mt-0.5 block">
                          {formatCurrency(booking.depositAmount)}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 italic">
                        &quot;{booking.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
                    {isPending ? (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={isUpdating === booking.id}
                          onClick={() => handleUpdateStatus(booking.id, 'APPROVED')}
                          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
                        >
                          <Check className="w-4 h-4" /> Approve Applicant
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          isLoading={isUpdating === booking.id}
                          onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                          className="gap-1.5 text-xs font-bold"
                        >
                          <X className="w-4 h-4" /> Decline
                        </Button>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-500">
                          Decision recorded: <strong className="text-slate-900 dark:text-slate-100">{booking.status}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Applications Submitted"
          description="You don't have any incoming booking applications on your rental properties yet."
        />
      )}
    </div>
  );
}
