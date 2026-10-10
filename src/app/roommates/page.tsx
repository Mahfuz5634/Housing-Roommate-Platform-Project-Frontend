'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { DEMO_ROOMMATES } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { Filter, RotateCcw, Heart, Sparkles, MapPin, CheckCircle, Shield } from 'lucide-react';

function RoommatesList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSleep = searchParams.get('sleepSchedule') || '';
  const initialCleanliness = searchParams.get('cleanliness') || '';
  const initialPets = searchParams.get('pets') || '';
  const initialSmoking = searchParams.get('smoking') || '';

  const [sleepSchedule, setSleepSchedule] = useState(initialSleep);
  const [cleanliness, setCleanliness] = useState(initialCleanliness);
  const [pets, setPets] = useState(initialPets);
  const [smoking, setSmoking] = useState(initialSmoking);

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

  const filteredRoommates = DEMO_ROOMMATES.filter((r) => {
    const matchSleep = !initialSleep || r.sleepSchedule === initialSleep;
    const matchClean = !initialCleanliness || r.cleanlinessScore >= Number(initialCleanliness);
    const matchPets = initialPets === '' || (initialPets === 'true' ? r.pets : !r.pets);
    const matchSmoking = initialSmoking === '' || (initialSmoking === 'true' ? r.smoking : !r.smoking);
    return matchSleep && matchClean && matchPets && matchSmoking;
  });

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
            Browse verified profiles scored by lifestyle compatibility, budget, and daily routines
          </p>
        </div>
      </div>

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
                  Min Cleanliness Level (1 to 5)
                </label>
                <select
                  value={cleanliness}
                  onChange={(e) => setCleanliness(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="">Any Level</option>
                  <option value="3">3+ Stars (Moderate Tidy)</option>
                  <option value="4">4+ Stars (Very Clean)</option>
                  <option value="5">5 Stars (Spotless)</option>
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
                  <option value="">Any</option>
                  <option value="true">Pets Welcome / Has Pet</option>
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
                  <option value="">Any</option>
                  <option value="false">Strictly Non-Smoking</option>
                  <option value="true">Smoking Ok</option>
                </select>
              </div>

              <Button type="submit" variant="primary" className="w-full text-xs font-semibold py-2.5 bg-purple-600 hover:bg-purple-700">
                Update Roommate Matches
              </Button>
            </form>
          </Card>
        </div>

        {/* Roommates Grid */}
        <div className="lg:col-span-3">
          {filteredRoommates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRoommates.map((r) => (
                <Card key={r.id} className="p-6 flex flex-col justify-between hover:shadow-lg transition">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                          <Image
                            src={r.user?.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt="Roommate"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {r.user?.profile?.firstName} {r.user?.profile?.lastName}
                          </h4>
                          <p className="text-xs text-slate-500">{r.occupation || 'Working Professional'}</p>
                          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                            📍 {r.preferredLocations.join(', ') || 'Metropolitan Area'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full border border-purple-200">
                          {r.matchScore || 85}% Match
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      &quot;{r.bio}&quot;
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        🕒 {r.sleepSchedule.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        ✨ Cleanliness {r.cleanlinessScore}/5
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {r.pets ? '🐾 Pets Welcome' : '🚫 No Pets'}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {r.smoking ? '🚬 Smoking Ok' : '🚭 Non-Smoker'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Budget Range</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {formatCurrency(r.budgetMin)} – {formatCurrency(r.budgetMax)}
                      </span>
                    </div>
                    <Link href={`/roommates/${r.id}`}>
                      <Button variant="outline" size="sm" className="font-semibold text-purple-600">
                        View Profile →
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No roommates found"
              description="No roommates match the specified habits criteria. Try expanding your search options."
              actionLabel="Reset Filters"
              onAction={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function RoommatesDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="text-center py-20 text-slate-500 font-semibold">
            Loading Roommate Matches...
          </div>
        </div>
      }
    >
      <RoommatesList />
    </Suspense>
  );
}
