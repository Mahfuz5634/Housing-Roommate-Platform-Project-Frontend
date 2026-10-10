import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  CreditCard,
  Users2,
  Wrench,
  CheckCircle2,
  Lock,
  Headphones,
  SlidersHorizontal,
} from 'lucide-react';

export const metadata = {
  title: 'Services & Solutions | RoommateHub',
  description: 'Explore our full suite of verified co-living, escrow payment, and roommate matching services.',
};

export default function ServicesPage() {
  const services = [
    {
      icon: Users2,
      title: 'Algorithmic Roommate Matching',
      description:
        'Our multi-factor compatibility engine scores potential housemates across schedule patterns, cleaning preferences, dietary requirements, and work-from-home habits.',
      benefits: ['98% roommate satisfaction rating', 'Direct messaging with match breakdown', 'Filtered by verified college/workplace credentials'],
    },
    {
      icon: Shield,
      title: 'Verified Property Protection',
      description:
        'Every listed property undergoes address validation, ownership deed review, and photographic authenticity checks to eliminate rental scams completely.',
      benefits: ['Zero fake listings guaranteed', 'Pre-inspected room conditions', 'Transparent landlord ratings and past tenant reviews'],
    },
    {
      icon: CreditCard,
      title: 'Stripe Escrow Deposits',
      description:
        'Never wire money to unknown bank accounts. Deposits and rent payments are secured in test/production Stripe escrow accounts until move-in day.',
      benefits: ['Instant electronic receipts', 'Refund guarantee if listing is misrepresented', 'Multi-currency credit/debit card support'],
    },
    {
      icon: Wrench,
      title: '24/7 Digital Maintenance Ticketing',
      description:
        'Streamlined issue reporting directly connecting tenants to landlords with categorized priorities, photo attachments, and real-time status tracking.',
      benefits: ['Plumbing, electrical, and appliance triage', 'Direct update notifications', 'Complete audit log for landlords and admins'],
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Our Solutions
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Modern Co-Living, Backed by Modern Technology
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          We built the tools that make shared living effortless for tenants, landlords, and roommates alike.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((serv) => (
          <Card key={serv.title} className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <serv.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{serv.title}</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{serv.description}</p>
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              {serv.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-extrabold tracking-tight">Are you a property manager or landlord?</h3>
          <p className="text-sm text-blue-200">
            List your rooms to thousands of pre-screened, verified tenants with zero listing fees.
          </p>
        </div>
        <Link href="/register">
          <Button size="lg" className="bg-white text-blue-900 hover:bg-slate-100 font-bold shrink-0">
            List Your Property
          </Button>
        </Link>
      </div>
    </div>
  );
}
