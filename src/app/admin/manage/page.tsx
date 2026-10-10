'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatCurrency, formatDate, getPriorityColor } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { apiClient } from '@/lib/apiClient';
import { Property, User, BookingRequest, MaintenanceRequest, UserStatus, UserRole } from '@/types';
import { toast } from 'sonner';
import {
  Building,
  Users,
  FileCheck2,
  Wrench,
  CheckCircle,
  XCircle,
  Shield,
  Lock,
  Unlock,
  Sliders,
} from 'lucide-react';

export default function AdminResourceManagerPage() {
  const [activeTab, setActiveTab] = useState<'PROPERTIES' | 'USERS' | 'BOOKINGS'>('PROPERTIES');

  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchAdminData() {
      setIsLoading(true);
      try {
        const [propsRes, usersRes] = await Promise.allSettled([
          apiClient.get<Property[]>('/properties'),
          apiClient.get<User[]>('/users'),
        ]);

        if (isMounted) {
          if (propsRes.status === 'fulfilled' && propsRes.value.success && Array.isArray(propsRes.value.data)) {
            setProperties(propsRes.value.data);
          }
          if (usersRes.status === 'fulfilled' && usersRes.value.success && Array.isArray(usersRes.value.data)) {
            setUsers(usersRes.value.data);
          }
        }
      } catch (err: any) {
        console.error('Error fetching admin data', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Property approval toggle
  const handleApproveProperty = async (propertyId: string) => {
    try {
      await apiClient.patch(`/admin/properties/${propertyId}/approve`);
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, isApproved: !p.isApproved } : p))
      );
      toast.success('Property approval status updated in database!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update property status');
    }
  };

  // User status toggle
  const handleToggleUserStatus = async (userId: string, currentStatus: UserStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await apiClient.patch(`/users/${userId}/status`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      toast.success(`User marked as ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to change user status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Moderation Controls</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
          Platform Resource Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Verify property listings, oversee registered members, and ensure trust &amp; compliance
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('PROPERTIES')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 shrink-0 ${
            activeTab === 'PROPERTIES'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Building className="w-4 h-4" /> Properties ({properties.length})
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 shrink-0 ${
            activeTab === 'USERS'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" /> Registered Users ({users.length})
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : activeTab === 'PROPERTIES' ? (
        /* PROPERTIES TAB */
        <div className="space-y-4">
          {properties.map((prop) => (
            <Card key={prop.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={prop.images && prop.images.length > 0 ? prop.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
                      alt={prop.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">{prop.propertyType}</Badge>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          prop.isApproved
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {prop.isApproved ? 'Approved & Public' : 'Pending Verification'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {prop.address}, {prop.city} • Rent: {formatCurrency(prop.totalRent)}/mo
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={prop.isApproved ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => handleApproveProperty(prop.id)}
                    className="text-xs"
                  >
                    {prop.isApproved ? 'Revoke Approval' : 'Approve & Publish'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* USERS TAB */
        <div className="space-y-4">
          {users.map((u) => (
            <Card key={u.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                    {u.profile?.firstName?.charAt(0) || u.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {u.profile?.firstName ? `${u.profile.firstName} ${u.profile.lastName || ''}` : u.email}
                      </h4>
                      <Badge variant="outline">{u.role}</Badge>
                      <Badge status={u.status}>{u.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Email: <span className="font-semibold text-slate-700 dark:text-slate-300">{u.email}</span> • Phone: {u.profile?.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={u.status === 'ACTIVE' ? 'danger' : 'secondary'}
                    size="sm"
                    onClick={() => handleToggleUserStatus(u.id, u.status)}
                    className="text-xs gap-1"
                  >
                    {u.status === 'ACTIVE' ? (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Block Member
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" /> Unblock Member
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
