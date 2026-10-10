'use client';

import React, { useState } from 'react';
import { DEMO_BOOKINGS } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiClient } from '@/lib/apiClient';
import { BookingRequest, BookingStatus } from '@/types';
import { toast } from 'sonner';
import { FileCheck2, Check, X, Building, Calendar, UserCheck } from 'lucide-react';

export default function LandlordBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>(DEMO_BOOKINGS);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleUpdateStatus = async (bookingId: string, status: BookingStatus) => {
    setIsUpdating(bookingId);
    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      toast.success(`Booking request ${status.toLowerCase()} successfully!`);
    } catch {
      toast.error('Failed to update booking status');
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

      {bookings.length > 0 ? (
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
                          {booking.tenant?.profile?.firstName || 'Alex'} {booking.tenant?.profile?.lastName || 'Morgan'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Applied for: <span className="font-semibold">{booking.property?.title}</span> • {booking.room?.title || 'Entire Unit'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Move-in Date</span>
                        <span>{formatDate(booking.moveInDate)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Move-out Date</span>
                        <span>{booking.moveOutDate ? formatDate(booking.moveOutDate) : 'Open-ended'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Rent</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Security Deposit</span>
                        <span className="font-bold text-emerald-600">{formatCurrency(booking.depositAmount)}</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                        &quot;{booking.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-4 lg:pt-0">
                    <Badge status={booking.status}>{booking.status}</Badge>

                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateStatus(booking.id, 'APPROVED')}
                          isLoading={isUpdating === booking.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm font-semibold"
                        >
                          <Check className="w-4 h-4" /> Approve Applicant
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                          className="text-rose-600 hover:bg-rose-50 gap-1.5"
                        >
                          <X className="w-4 h-4" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        Status updated: {booking.status}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileCheck2}
          title="No booking applications"
          description="Tenant applications will appear here when prospective renters apply for your listings."
        />
      )}
    </div>
  );
}
