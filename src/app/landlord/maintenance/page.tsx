'use client';

import React, { useState } from 'react';
import { DEMO_MAINTENANCE } from '@/lib/mockData';
import { formatDate, getPriorityColor } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiClient } from '@/lib/apiClient';
import { MaintenanceRequest, MaintenanceStatus } from '@/types';
import { toast } from 'sonner';
import { Wrench, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function LandlordMaintenancePage() {
  const [tickets, setTickets] = useState<MaintenanceRequest[]>(DEMO_MAINTENANCE);

  const handleStatusChange = async (ticketId: string, newStatus: MaintenanceStatus) => {
    try {
      await apiClient.patch(`/maintenance/${ticketId}/status`, { status: newStatus });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
      toast.success(`Ticket status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update maintenance status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Property Facilities</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
          Maintenance Tickets
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track reported repairs, schedule service technicians, and resolve tenant requests
        </p>
      </div>

      {tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {ticket.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority} PRIORITY
                    </span>
                    <span className="text-xs text-slate-400">• {formatDate(ticket.createdAt)}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {ticket.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    {ticket.description}
                  </p>

                  <p className="text-[11px] text-slate-400 pt-1">
                    Property: <span className="font-semibold">{ticket.property?.title}</span> • Reported by: {ticket.tenant?.profile?.firstName || 'Tenant'}
                  </p>
                </div>

                {/* Right Status Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Update:</span>
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value as MaintenanceStatus)}
                      className="text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                  <Badge status={ticket.status}>{ticket.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Wrench}
          title="All systems operational"
          description="There are currently no active maintenance or repair requests across your properties."
        />
      )}
    </div>
  );
}
