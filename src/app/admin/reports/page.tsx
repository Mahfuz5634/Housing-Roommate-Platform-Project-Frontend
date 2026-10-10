'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import { Shield, FileText, Settings, Download, CheckCircle2, Clock } from 'lucide-react';

interface AuditLog {
  id: string;
  event: string;
  user: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    event: 'Stripe Escrow Deposit Paid ($1,400.00)',
    user: 'alex.tenant@roommatehub.com',
    timestamp: '2026-10-10 15:42:10 UTC',
    status: 'SUCCESS',
  },
  {
    id: 'log-102',
    event: 'New Property Listing Submitted for Review',
    user: 'john.landlord@roommatehub.com',
    timestamp: '2026-10-10 14:15:22 UTC',
    status: 'SUCCESS',
  },
  {
    id: 'log-103',
    event: 'Failed Login Attempt (Invalid Password)',
    user: 'unknown@visitor.org',
    timestamp: '2026-10-10 12:05:44 UTC',
    status: 'WARNING',
  },
  {
    id: 'log-104',
    event: 'Roommate Profile Questionnaire Updated',
    user: 'claire.ux@roommatehub.com',
    timestamp: '2026-10-10 10:30:19 UTC',
    status: 'SUCCESS',
  },
  {
    id: 'log-105',
    event: 'Maintenance Ticket Escalated to HIGH',
    user: 'system_automation',
    timestamp: '2026-10-09 18:22:00 UTC',
    status: 'ALERT',
  },
];

export default function AdminReportsSettingsPage() {
  const [escrowDays, setEscrowDays] = useState('7');
  const [feeRate, setFeeRate] = useState('2.5');
  const [autoApproveLandlords, setAutoApproveLandlords] = useState(false);
  const [instantNotifications, setInstantNotifications] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Platform security & fee settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Compliance & Config</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
          Audit Logs & Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track security events, review financial ledger transactions, and adjust system policies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Audit Log (Left 2 cols) */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" /> System Security & Audit Log
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success('Audit log export initiated (CSV)')}
              className="gap-1.5 text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export Log
            </Button>
          </div>

          <div className="space-y-3">
            {AUDIT_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{log.event}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    User: {log.user} • Time: {log.timestamp}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    log.status === 'SUCCESS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : log.status === 'WARNING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Platform Settings Form (Right 1 col) */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Settings className="w-5 h-5 text-purple-600" /> Platform Policies
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Escrow Lock Window (Days)
              </label>
              <input
                type="number"
                value={escrowDays}
                onChange={(e) => setEscrowDays(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Number of days deposits are held before release to landlord
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Platform Service Surcharge (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={feeRate}
                onChange={(e) => setFeeRate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApproveLandlords}
                  onChange={(e) => setAutoApproveLandlords(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Auto-approve verified superhost listings
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={instantNotifications}
                  onChange={(e) => setInstantNotifications(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Real-time security alert emails
                </span>
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full text-xs font-semibold bg-purple-600 hover:bg-purple-700">
              Save Platform Configuration
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
