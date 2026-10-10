'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(4, 'Subject must be at least 4 characters'),
  category: z.enum(['GENERAL', 'BOOKING', 'LANDLORD', 'TECHNICAL']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: 'GENERAL',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    toast.success('Thank you! Your message has been received. Our team will contact you within 24 hours.');
    reset();
  };

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Contact Us
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          We&apos;re Here to Help
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Have a question about a listing, roommate compatibility, or deposit payments? Reach out to our 24/7 dedicated support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information Cards */}
        <div className="space-y-6">
          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Email Support</h4>
                <p className="text-xs text-slate-500">support@roommatehub.com</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              For general questions, billing inquiries, or verification assistance.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Helpline</h4>
                <p className="text-xs text-slate-500">+1 (800) 555-ROOM</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Available Monday – Friday, 8:00 AM – 8:00 PM EST.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Headquarters</h4>
                <p className="text-xs text-slate-500">San Francisco, CA</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              500 Howard Street, Suite 400, San Francisco, CA 94105.
            </p>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="lg:col-span-2 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  {...register('fullName')}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
                {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  {...register('subject')}
                  placeholder="Inquiry regarding..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
                {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="GENERAL">General Information</option>
                  <option value="BOOKING">Booking & Deposit Payment</option>
                  <option value="LANDLORD">Landlord Partnerships</option>
                  <option value="TECHNICAL">Technical Bug / Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Message
              </label>
              <textarea
                {...register('message')}
                rows={5}
                placeholder="How can our support team assist you today?"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
              {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message.message}</p>}
            </div>

            <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full sm:w-auto shadow-sm gap-2">
              <Send className="w-4 h-4" /> Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
