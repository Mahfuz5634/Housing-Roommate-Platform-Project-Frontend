'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore, LIVE_DEMO_CREDENTIALS } from '@/lib/authStore';
import { formatCurrency } from '@/lib/utils';
import { RoommateProfile } from '@/types';
import { toast } from 'sonner';
import { Filter, RotateCcw, Heart, Sparkles, MapPin, CheckCircle, Shield, Lock } from 'lucide-react';

function RoommatesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, login } = useAuthStore();

  const initialSleep = searchParams.get('sleepSchedule') || '';
  const initialCleanliness = searchParams.get('cleanliness') || '';
  const initialPets = searchParams.get('pets') || '';
  const initialSmoking = searchParams.get('smoking') || '';

  const [sleepSchedule, setSleepSchedule] = useState(initialSleep);
  const [cleanliness, setCleanliness] = useState(initialCleanliness);
  const [pets, setPets] = useState(initialPets);
  const [smoking, setSmoking] = useState(initialSmoking);

  const [roommates, setRoommates] = useState<RoommateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });
    router.replace(`/roommates?${params.toString()}`);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({
      sleepSchedule,
      cleanliness,
      pets,
      smoking,
    });
  };

  const handleReset = () => {
    setSleepSchedule('');
    setCleanliness('');
    setPets('');
    setSmoking('');
    router.replace('/roommates');
  };

  const handleQuickLogin = async () => {
    try {
      const creds = LIVE_DEMO_CREDENTIALS.TENANT;
      const res = await apiClient.post<{ accessToken: string; user: any }>('/auth/login', {
        email: creds.email,
        password: creds.password,
      });
      if (res.success && res.data) {
        login(res.data.user, res.data.accessToken);
        toast.success('Logged in as Demo Tenant. Loading live roommates...');
      }
    } catch (err: any) {
      toast.error('Could not authenticate demo tenant');
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchRoommates() {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams: Record<string, string> = {};
        if (initialSleep) queryParams.sleepSchedule = initialSleep;
        if (initialCleanliness) queryParams.cleanlinessScore = initialCleanliness;
        if (initialPets) queryParams.pets = initialPets;
        if (initialSmoking) queryParams.smoking = initialSmoking;

        const res = await apiClient.get<RoommateProfile[]>('/roommates', queryParams);
        if (isMounted) {
          if (res.success && Array.isArray(res.data)) {
            setRoommates(res.data);
          } else {
            setRoommates([]);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Please log in to view roommate candidates.');
          setRoommates([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchRoommates();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, initialSleep, initialCleanliness, initialPets, initialSmoking]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Lifestyle Matching Hub
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Find Your Ideal Roommate
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading
              ? 'Loading live roommate profiles...'
              : `Browse ${roommates.length} verified candidate profiles scored by daily habits & routines`}
          </p>
        </div>
      </div>

      {/* Auth Banner if not logged in */}
      {!isAuthenticated && (
        <div className="p-4 sm:p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Tenant Authentication Required to Browse Roommates
              </h3>
              <p className="text-xs text-slate-500">
                To protect member safety, roommate lifestyle profiles require verified user access.
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={handleQuickLogin} className="shrink-0 bg-purple-600 hover:bg-purple-700">
            ⚡ 1-Click Tenant Unlock
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-600" /> Lifestyle Habits
              </h3>
              {(initialSleep || initialCleanliness || initialPets || initialSmoking) && (
                <button
                  onClick={handleReset}
                  className="text-xs text-rose-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <form onSubmit={handleFilterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Sleep Schedule
                </label>
                <select
                  value={sleepSchedule}
                  onChange={(e) => setSleepSchedule(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="">Any Schedule</option>
                  <option value="EARLY_BIRD">Early Bird (Wakes Early)</option>
                  <option value="NIGHT_OWL">Night Owl (Sleeps Late)</option>
                  <option value="FLEXIBLE">Flexible Routine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Cleanliness Standard
                </label>
                <select
                  value={cleanliness}
                  onChange={(e) => setCleanliness(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="">Any Cleanliness</option>
                  <option value="5">5/5 - Spotless &amp; Strict</option>
                  <option value="4">4/5 - Very Tidy</option>
                  <option value="3">3/5 - Average Clean</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Pet Friendly
                </label>
                <select
                  value={pets}
                  onChange={(e) => setPets(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="">No Preference</option>
                  <option value="true">Pets Welcome</option>
                  <option value="false">No Pets</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Smoking Policy
                </label>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="">No Preference</option>
                  <option value="false">Non-Smoker Only</option>
                  <option value="true">Smoking Allowed</option>
                </select>
              </div>

              <Button type="submit" variant="primary" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                Apply Filters
              </Button>
            </form>
          </Card>
        </div>

        {/* Roommates Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : roommates.length === 0 ? (
            <EmptyState
              title="No Roommates Found"
              description="No candidates matched your search criteria or authentication is required."
              actionLabel="Reset Search Filters"
              onAction={handleReset}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roommates.map((roommate) => (
                <Card key={roommate.id} className="p-6 hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <Image
                            src={
                              roommate.user?.profile?.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                            }
                            alt="Avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {roommate.user?.profile?.firstName} {roommate.user?.profile?.lastName}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {roommate.occupation || 'Professional'} • {roommate.user?.profile?.city || 'New York'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200">
                          {roommate.matchScore || 92}% Match
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatCurrency(roommate.budgetMin)} - {formatCurrency(roommate.budgetMax)}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      &quot;{roommate.bio}&quot;
                    </p>

                    {/* Habit tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        🕒 {roommate.sleepSchedule.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        ✨ Cleanliness {roommate.cleanlinessScore}/5
                      </span>
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {roommate.pets ? '🐾 Pet Friendly' : '🚫 No Pets'}
                      </span>
                    </div>

                    {roommate.preferredLocations && roommate.preferredLocations.length > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Prefers: {roommate.preferredLocations.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> ID Verified
                    </span>
                    <Link href={`/roommates/${roommate.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                        View Profile →
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RoommatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-10 px-4 max-w-7xl mx-auto">Loading roommates...</div>}>
      <RoommatesList />
    </Suspense>
  );
}
