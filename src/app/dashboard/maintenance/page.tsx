'use client';

import React, { useState } from 'react';
import { DEMO_MAINTENANCE, DEMO_PROPERTIES } from '@/lib/mockData';
import { formatDate, getPriorityColor } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiClient } from '@/lib/apiClient';
import { MaintenanceRequest, MaintenanceCategory, MaintenancePriority } from '@/types';
import { toast } from 'sonner';
import { Wrench, Plus, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

export default function TenantMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(DEMO_MAINTENANCE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New ticket form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory>('PLUMBING');
  const [priority, setPriority] = useState<MaintenancePriority>('MEDIUM');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post<MaintenanceRequest>('/maintenance', {
        propertyId: DEMO_PROPERTIES[0].id,
        category,
        priority,
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      });

      if (res.success && res.data) {
        setRequests([res.data, ...requests]);
        toast.success('Maintenance ticket created! Landlord notified.');
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        setImageUrl('');
      }
    } catch {
      toast.error('Failed to submit maintenance request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Repairs & Facilities</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Maintenance Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit repair requests directly to your landlord with photo evidence and priority tracking
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm" className="gap-2 shadow-sm font-semibold">
          <Plus className="w-4 h-4" /> New Repair Ticket
        </Button>
      </div>

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((ticket) => (
            <Card key={ticket.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                  <Badge status={ticket.status}>{ticket.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Wrench}
          title="No maintenance issues reported"
          description="Everything in your room is in working order. Need a repair? Submit a new ticket anytime."
          actionLabel="File a Repair Request"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Ticket Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit New Maintenance Ticket"
        description="Notify landlord regarding plumbing, electrical, or appliance issues"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Issue Title *
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Leaking kitchen sink pipe"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaintenanceCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="PLUMBING">Plumbing</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="APPLIANCE">Appliance</option>
                <option value="STRUCTURAL">Structural</option>
                <option value="CLEANING">Cleaning</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MaintenancePriority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="LOW">Low (Cosmetic)</option>
                <option value="MEDIUM">Medium (Standard)</option>
                <option value="HIGH">High (Needs fast attention)</option>
                <option value="URGENT">Urgent (Water leak, power loss)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, where the issue is located, and when it started..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Photo URL (Optional)
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
