'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { DEMO_ROOMMATES } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/lib/authStore';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ShieldCheck,
  Heart,
  Clock,
  Sparkles,
  MapPin,
  Send,
  MessageCircle,
  Briefcase,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function RoommateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const roommateId = params?.id as string;
  const { isAuthenticated } = useAuthStore();

  const roommate =
    DEMO_ROOMMATES.find((r) => r.id === roommateId) || DEMO_ROOMMATES[0];

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleOpenContact = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to message potential roommates.');
      router.push(`/login?callbackUrl=/roommates/${roommate.id}`);
      return;
    }
    setIsContactModalOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message.');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsContactModalOpen(false);
      setMessage('');
      toast.success(`Message sent to ${roommate.user?.profile?.firstName}! They will reply to your registered email.`);
    }, 600);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <Link href="/roommates" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Roommate Directory
      </Link>

      {/* Profile Header */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-slate-100 shrink-0 shadow-md">
            <Image
              src={roommate.user?.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt="Roommate Profile"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {roommate.user?.profile?.firstName} {roommate.user?.profile?.lastName}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> {roommate.occupation || 'Working Professional'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {roommate.user?.profile?.city || 'New York'}
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-xs font-bold shrink-0 self-center sm:self-start">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> ID Verified Member
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
              &quot;{roommate.bio}&quot;
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Button onClick={handleOpenContact} variant="primary" className="gap-2 shadow-sm">
                <MessageCircle className="w-4 h-4" /> Connect with {roommate.user?.profile?.firstName}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Compatibility Radar Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-200 dark:border-purple-900/60 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full border-4 border-purple-500 flex items-center justify-center bg-white dark:bg-slate-900 shadow-inner">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {roommate.matchScore || 90}%
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              High Compatibility
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Strong alignment in sleep schedule, cleanliness, and lifestyle preferences.
            </p>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Lifestyle Habits & Living Attributes
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Sleep Schedule</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                🕒 {roommate.sleepSchedule.replace('_', ' ')}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Cleanliness Standard</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                ✨ {roommate.cleanlinessScore} out of 5 stars
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Pet Policy</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {roommate.pets ? '🐾 Pet Friendly / Has Pet' : '🚫 Prefers No Pets'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Smoking Policy</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {roommate.smoking ? '🚬 Smoking Tolerant' : '🚭 Strictly Non-Smoker'}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Preferred Neighborhoods
            </span>
            <div className="flex flex-wrap gap-2">
              {roommate.preferredLocations.map((loc) => (
                <span
                  key={loc}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                >
                  📍 {loc}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Message Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title={`Message ${roommate.user?.profile?.firstName}`}
        description="Initiate a secure roommate co-living conversation"
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Your Message
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I saw your roommate profile and noticed our schedules and cleanliness standards align. Would love to chat about potential apartments..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsContactModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSending} className="gap-2">
              <Send className="w-4 h-4" /> Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
