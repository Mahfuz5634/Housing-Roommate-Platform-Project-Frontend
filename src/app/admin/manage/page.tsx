'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DEMO_PROPERTIES, DEMO_USERS, DEMO_BOOKINGS, DEMO_MAINTENANCE } from '@/lib/mockData';
import { formatCurrency, formatDate, getPriorityColor } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
  const [activeTab, setActiveTab] = useState<'PROPERTIES' | 'USERS' | 'BOOKINGS' | 'MAINTENANCE'>('PROPERTIES');

  const [properties, setProperties] = useState<Property[]>(DEMO_PROPERTIES);
  const [users, setUsers] = useState<User[]>(Object.values(DEMO_USERS));
  const [bookings, setBookings] = useState<BookingRequest[]>(DEMO_BOOKINGS);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(DEMO_MAINTENANCE);

  // Property approval toggle
  const handleApproveProperty = async (propertyId: string) => {
    try {
      await apiClient.patch(`/admin/properties/${propertyId}/approve`);
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, isApproved: !p.isApproved } : p))
      );
      toast.success('Property approval status updated!');
    } catch {
      toast.error('Failed to update property status');
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
    } catch {
      toast.error('Failed to change user status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Moderation & Control</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
          Platform Resource Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Moderate new property submissions, manage user roles, audit leases, and oversee maintenance tickets
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'PROPERTIES', label: 'Properties Approval', icon: Building, count: properties.length },
          { id: 'USERS', label: 'User Directory', icon: Users, count: users.length },
          { id: 'BOOKINGS', label: 'All Bookings', icon: FileCheck2, count: bookings.length },
          { id: 'MAINTENANCE', label: 'Maintenance Overview', icon: Wrench, count: maintenance.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-purple-700 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: PROPERTIES APPROVAL */}
      {activeTab === 'PROPERTIES' && (
        <div className="space-y-4">
          {properties.map((prop) => (
            <Card key={prop.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{prop.title}</h4>
                      <Badge variant="outline">{prop.propertyType}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {prop.address}, {prop.city} • Rent: {formatCurrency(prop.totalRent)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Landlord ID: {prop.landlordId} • Bedrooms: {prop.bedrooms}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    prop.isApproved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {prop.isApproved ? '✔ Verified Approved' : '⏳ Pending Approval'}
                  </span>

                  <Button
                    variant={prop.isApproved ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => handleApproveProperty(prop.id)}
                    className="text-xs"
                  >
                    {prop.isApproved ? 'Unlist / Suspend' : 'Approve Property'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: USERS DIRECTORY */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          {users.map((usr) => (
            <Card key={usr.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs">
                    {usr.profile?.firstName?.[0] || usr.email[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {usr.profile?.firstName || 'User'} {usr.profile?.lastName || ''}
                    </h4>
                    <p className="text-xs text-slate-500">{usr.email}</p>
                    <p className="text-[11px] text-slate-400">
                      Joined: {formatDate(usr.createdAt)} • City: {usr.profile?.city || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="primary">{usr.role}</Badge>
                  <Badge status={usr.status}>{usr.status}</Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleUserStatus(usr.id, usr.status)}
                    className="gap-1.5 text-xs"
                  >
                    {usr.status === 'ACTIVE' ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-rose-500" /> Block
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-500" /> Unblock
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: BOOKINGS OVERSIGHT */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {b.property?.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tenant: {b.tenant?.email} • Move-in: {formatDate(b.moveInDate)}
                  </p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                    Total Amount: {formatCurrency(b.totalAmount)} • Deposit: {formatCurrency(b.depositAmount)}
                  </p>
                </div>
                <Badge status={b.status}>{b.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 4: MAINTENANCE OVERSIGHT */}
      {activeTab === 'MAINTENANCE' && (
        <div className="space-y-4">
          {maintenance.map((m) => (
            <Card key={m.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                      {m.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${getPriorityColor(m.priority)}`}>
                      {m.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                </div>
                <Badge status={m.status}>{m.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
