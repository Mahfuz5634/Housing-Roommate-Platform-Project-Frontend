'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Search, HelpCircle, Shield, CreditCard, Users } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'ALL' | 'TENANT' | 'LANDLORD' | 'PAYMENT' | 'MATCHING';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'MATCHING',
    question: 'How does the Roommate Compatibility Algorithm work?',
    answer:
      'Our algorithm compares your lifestyle survey (sleep schedule: early bird vs night owl, cleanliness rating: 1 to 5, pet preferences, smoking habits, and budget overlap). It calculates an indexed compatibility score from 0% to 100% so you can connect with roommates who align with your home lifestyle.',
  },
  {
    category: 'PAYMENT',
    question: 'How does the Stripe security deposit escrow work?',
    answer:
      'Once a landlord approves your booking request, you can click "Pay Deposit". This opens a secure Stripe checkout session. The deposit is held securely until your move-in date is verified, protecting both tenants and property owners from fraud.',
  },
  {
    category: 'TENANT',
    question: 'How do I submit a maintenance request once moved in?',
    answer:
      'Under your Tenant Dashboard, navigate to "Maintenance Hub". Click "New Request", select the affected category (Plumbing, Electrical, Appliance, etc.), choose the priority level, describe the problem, and attach photos. The landlord receives immediate notification.',
  },
  {
    category: 'LANDLORD',
    question: 'How do landlords list new properties and rooms?',
    answer:
      'Registered landlords can access the Landlord Dashboard and use our 4-step listing wizard. You can specify room types (Private vs Shared), individual room rent, deposit requirements, house rules, and high-resolution photo galleries.',
  },
  {
    category: 'PAYMENT',
    question: 'Can I test payments during demo evaluation?',
    answer:
      'Yes! The platform is preconfigured with Stripe test mode. You can click "Pay Now" on any approved booking in your Tenant Dashboard to experience the complete checkout, success redirect, and verification cycle.',
  },
  {
    category: 'TENANT',
    question: 'Are background checks performed on roommates?',
    answer:
      'All users undergo email verification and profile verification. In addition, landlords can request identity documents before accepting booking applications.',
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Help Center
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500">
          Everything you need to know about properties, matching algorithms, and payments.
        </p>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { label: 'All Questions', id: 'ALL' },
          { label: 'Roommate Matching', id: 'MATCHING' },
          { label: 'Stripe Payments', id: 'PAYMENT' },
          { label: 'Tenants & Bookings', id: 'TENANT' },
          { label: 'Landlord Hub', id: 'LANDLORD' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordions */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Card key={faq.question} className="overflow-hidden border border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm">
            No questions matched your search query. Try searching with different terms.
          </div>
        )}
      </div>
    </div>
  );
}
