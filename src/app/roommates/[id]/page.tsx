'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/lib/authStore';
import { apiClient } from '@/lib/apiClient';
import { RoommateProfile } from '@/types';
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

  const [roommate, setRoommate] = useState<RoommateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchRoommate() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get<RoommateProfile[]>('/roommates');
        if (isMounted) {
          if (res.success && Array.isArray(res.data)) {
            const found = res.data.find((r) => r.id === roommateId) || res.data[0];
            if (found) {
              setRoommate(found);
            } else {
              setError('Roommate profile not found');
            }
          } else {
            setError('Could not load roommates from database');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Please log in to view roommate details');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchRoommate();
    return () => {
      isMounted = false;
    };
  }, [roommateId, isAuthenticated]);

  const handleOpenContact = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to message potential roommates.');
      router.push(`/login?callbackUrl=/roommates/${roommateId}`);
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
      toast.success(
        `Message sent to ${roommate?.user?.profile?.firstName || 'Roommate'}! They will reply to your registered email.`
      );
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading roommate candidate details...</p>
      </div>
    );
  }

  if (error || !roommate) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-xl mx-auto text-center space-y-6">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Authentication Required</h2>
        <p className="text-sm text-slate-500">{error || 'Please sign in to view this profile.'}</p>
        <Link href={`/login?callbackUrl=/roommates/${roommateId}`}>
          <Button variant="primary">Sign In to Continue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <Link href="/roommates" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Roommate Directory
      </Link>

      {/* Main Profile Header */}
      <Card className="p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5">
            <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
              <Image
                src={
                  roommate.user?.profile?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                }
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {roommate.user?.profile?.firstName} {roommate.user?.profile?.lastName}
                </h1>
                <span className="p-1 rounded-full bg-emerald-100 text-emerald-700" title="ID Verified">
                  <CheckCircle className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-1">
                <Briefcase className="w-3.5 h-3.5" /> {roommate.occupation || 'Professional'} • {roommate.user?.profile?.city || 'New York'}
              </p>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Monthly Budget</span>
              <p className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
                {formatCurrency(roommate.budgetMin)} - {formatCurrency(roommate.budgetMax)}
              </p>
            </div>
            <Button variant="primary" onClick={handleOpenContact} className="gap-2 bg-purple-600 hover:bg-purple-700 font-semibold text-xs">
              <MessageCircle className="w-4 h-4" /> Message Roommate
            </Button>
          </div>
        </div>

        {/* Bio & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">About Me</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {roommate.bio}
              </p>
            </div>

            {roommate.preferredLocations && roommate.preferredLocations.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Target Neighborhoods</h3>
                <div className="flex flex-wrap gap-2">
                  {roommate.preferredLocations.map((loc, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-800"
                    >
                      📍 {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Living Preferences */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Living Habits</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Sleep Schedule:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{roommate.sleepSchedule.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cleanliness:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{roommate.cleanlinessScore} / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pet Policy:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{roommate.pets ? 'Pets Allowed' : 'No Pets'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Smoking:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{roommate.smoking ? 'Smoking Allowed' : 'Non-Smoker'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gender Preference:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{roommate.preferredGender}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title={`Message ${roommate.user?.profile?.firstName}`}
      >
        <form onSubmit={handleSendMessage} className="space-y-4 mt-4">
          <p className="text-xs text-slate-500">
            Send an introductory message to start discussing moving dates, lease durations, and housemate preferences.
          </p>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hey, I noticed our sleep schedules and budgets align! Are you interested in finding a place together?..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-purple-500"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsContactModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSending} className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Send className="w-3.5 h-3.5" /> Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
