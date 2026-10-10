'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { apiClient } from '@/lib/apiClient';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SleepSchedule, GenderPreference } from '@/types';
import { toast } from 'sonner';
import { User, Sparkles, Moon, Sun, Save, Check } from 'lucide-react';

export default function TenantProfilePreferencesPage() {
  const { user, updateUser } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.profile?.firstName || 'Alex');
  const [lastName, setLastName] = useState(user?.profile?.lastName || 'Morgan');
  const [phone, setPhone] = useState(user?.profile?.phone || '+1-555-0201');
  const [city, setCity] = useState(user?.profile?.city || 'New York');
  const [bio, setBio] = useState(
    user?.profile?.bio ||
      'Software engineer working hybrid who loves cooking, coffee, and quiet weeknights.'
  );

  // Roommate lifestyle settings
  const [budgetMin, setBudgetMin] = useState(user?.roommateProfile?.budgetMin || 800);
  const [budgetMax, setBudgetMax] = useState(user?.roommateProfile?.budgetMax || 1600);
  const [sleepSchedule, setSleepSchedule] = useState<SleepSchedule>(
    user?.roommateProfile?.sleepSchedule || 'EARLY_BIRD'
  );
  const [cleanlinessScore, setCleanlinessScore] = useState(
    user?.roommateProfile?.cleanlinessScore || 4
  );
  const [smoking, setSmoking] = useState(user?.roommateProfile?.smoking || false);
  const [pets, setPets] = useState(user?.roommateProfile?.pets || false);
  const [locations, setLocations] = useState(
    user?.roommateProfile?.preferredLocations?.join(', ') || 'Manhattan, Brooklyn, Queens'
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.post('/roommates/profile', {
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        sleepSchedule,
        cleanlinessScore: Number(cleanlinessScore),
        smoking,
        pets,
        preferredLocations: locations.split(',').map((l) => l.trim()),
        bio,
      });

      updateUser({
        profile: {
          ...(user?.profile as any),
          firstName,
          lastName,
          phone,
          city,
          bio,
        },
      });

      toast.success('Roommate lifestyle profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Account & Matching</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
          Profile & Roommate Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Fine-tune your living habits to receive higher compatibility scores from matching flatmates
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details */}
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                First Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Current City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Personal Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </Card>

        {/* Roommate Lifestyle Survey */}
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" /> Lifestyle & Roommate Habits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Minimum Monthly Budget ($)
              </label>
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Maximum Monthly Budget ($)
              </label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Sleep Schedule
              </label>
              <select
                value={sleepSchedule}
                onChange={(e) => setSleepSchedule(e.target.value as SleepSchedule)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="EARLY_BIRD">Early Bird (Wakes Early, Sleeps Early)</option>
                <option value="NIGHT_OWL">Night Owl (Active at Night)</option>
                <option value="FLEXIBLE">Flexible Daily Routine</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Cleanliness Standard (1 to 5)
              </label>
              <select
                value={cleanlinessScore}
                onChange={(e) => setCleanlinessScore(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="1">1 - Relaxed about clutter</option>
                <option value="2">2 - Occasional weekly cleanups</option>
                <option value="3">3 - Moderate daily tidiness</option>
                <option value="4">4 - High standard of cleanliness</option>
                <option value="5">5 - Spotless / Pristine clean</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase">Pet Tolerant / Has Pets</h4>
                <p className="text-[11px] text-slate-500">Allow dogs or cats in living space</p>
              </div>
              <input
                type="checkbox"
                checked={pets}
                onChange={(e) => setPets(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase">Smoking Allowed</h4>
                <p className="text-[11px] text-slate-500">Tolerate tobacco or vape outdoors</p>
              </div>
              <input
                type="checkbox"
                checked={smoking}
                onChange={(e) => setSmoking(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Preferred Neighborhoods (comma-separated)
            </label>
            <input
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              placeholder="e.g. Manhattan, Brooklyn, Williamsburg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSaving} className="gap-2 shadow-md">
            <Save className="w-4 h-4" /> Save Profile & Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
