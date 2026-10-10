'use client';

import React from 'react';
import { DEMO_PAYMENTS } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from 'sonner';
import { CreditCard, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TenantPaymentsPage() {
  const payments = DEMO_PAYMENTS;

  const handleDownloadReceipt = (txn: string) => {
    toast.success(`Electronic receipt downloaded for transaction ${txn}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Financial Transactions</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
          Payment History & Receipts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          View all your Stripe security deposits, rent disbursements, and verified transactions
        </p>
      </div>

      {payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((pay) => (
            <Card key={pay.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Security Deposit & Move-in Escrow
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Transaction ID: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{pay.transactionId}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Processed on {formatDate(pay.createdAt)} via Stripe Test Checkout
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                      {formatCurrency(pay.amount)}
                    </span>
                    <div className="mt-0.5">
                      <Badge status={pay.status}>{pay.status}</Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReceipt(pay.transactionId)}
                    className="gap-1.5 text-xs shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> Receipt
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CreditCard}
          title="No payments made yet"
          description="When your booking applications are approved, your deposit receipts will appear here."
        />
      )}
    </div>
  );
}
