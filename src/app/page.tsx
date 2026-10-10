import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DEMO_PROPERTIES, DEMO_ROOMMATES } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Building,
  CheckCircle,
  Star,
  ArrowRight,
  MapPin,
  Bed,
  Bath,
  Lock,
  HeartHandshake,
} from 'lucide-react';

export default function HomePage() {
  const featuredProperties = DEMO_PROPERTIES.slice(0, 3);
  const featuredRoommates = DEMO_ROOMMATES.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 py-16 sm:py-24 lg:py-32 border-b border-slate-200/60 dark:border-slate-800">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold shadow-sm">
            <Sparkles className="w-4 h-4" /> Next-Gen Housing & Smart Roommate Matching
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-slate-100 tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Find Your Dream Home &{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Roommate
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate the stress of co-living. Explore verified city listings, match by habits & lifestyle compatibility, and reserve rooms with secure Stripe deposits.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
            <form action="/properties" method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="px-3 py-2 text-left sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Location / City
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <input
                    type="text"
                    name="city"
                    placeholder="New York, Austin, SF..."
                    className="w-full text-sm font-medium bg-transparent focus:outline-none placeholder-slate-400 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="px-3 py-2 text-left border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Type
                </label>
                <select
                  name="propertyType"
                  className="w-full text-sm font-medium bg-transparent focus:outline-none text-slate-900 dark:text-slate-100 mt-0.5 cursor-pointer"
                >
                  <option value="">Any Type</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="CONDO">Condo</option>
                  <option value="STUDIO">Studio</option>
                  <option value="HOUSE">House</option>
                </select>
              </div>

              <div className="flex items-center p-1 sm:p-0">
                <Button type="submit" variant="primary" className="w-full h-full rounded-xl sm:rounded-2xl gap-2 font-semibold">
                  <Search className="w-4 h-4" /> Search
                </Button>
              </div>
            </form>
          </div>

          {/* Trust stats pill */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% ID Verified Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Stripe Escrow Deposits</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-purple-600" />
              <span>Lifestyle Habit Matching</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Top Urban Living
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                Featured Verified Properties
              </h2>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="gap-2">
                <span>View All Properties</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredProperties.map((prop) => (
              <Card key={prop.id} className="group flex flex-col h-full hover:-translate-y-1 transition-transform">
                <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={prop.images[0]}
                    alt={prop.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="primary">{prop.propertyType}</Badge>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm">
                      Verified
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-sm font-bold">
                    {formatCurrency(prop.totalRent)} <span className="text-[10px] font-normal">/mo</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{prop.address}, {prop.city}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {prop.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" /> {prop.bedrooms} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-400" /> {prop.bathrooms} Baths
                      </span>
                    </div>
                    <Link href={`/properties/${prop.id}`}>
                      <Button variant="ghost" size="sm" className="font-semibold text-blue-600 p-0 hover:bg-transparent">
                        Details →
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roommate Finder Spotlight */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Compatibility Algorithm
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                Meet Compatible Roommates
              </h2>
            </div>
            <Link href="/roommates">
              <Button variant="outline" className="gap-2">
                <span>Browse All Roommates</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredRoommates.map((roommate) => (
              <Card key={roommate.id} className="p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100">
                      <Image
                        src={roommate.user?.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {roommate.user?.profile?.firstName} {roommate.user?.profile?.lastName}
                      </h4>
                      <p className="text-xs text-slate-500">{roommate.occupation || 'Professional'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200">
                      {roommate.matchScore || 90}% Match
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {formatCurrency(roommate.budgetMin)} - {formatCurrency(roommate.budgetMax)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 line-clamp-2 leading-relaxed">
                  &quot;{roommate.bio}&quot;
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    🕒 {roommate.sleepSchedule.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    ✨ Cleanliness {roommate.cleanlinessScore}/5
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {roommate.pets ? '🐾 Pets Ok' : '🚫 No Pets'}
                  </span>
                </div>

                <div className="mt-5">
                  <Link href={`/roommates/${roommate.id}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      View Compatibility
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              How RoommateHub Works
            </h2>
            <p className="text-sm text-slate-500">
              From discovering an apartment to unlocking the front door in 3 seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-black text-xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Search & Filter</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter properties by rent, room type, amenities, and verify roommates by sleep schedule and cleanliness.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-black text-xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Apply & Escrow Deposit</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit your booking application. Once the landlord approves, pay the security deposit safely via Stripe test mode.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-black text-xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Move In & Manage</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enjoy your new co-living sanctuary. Use the platform dashboard for transparent digital maintenance tickets and payment records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to find your ideal home?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
            Experience the safest and easiest way to find co-living spaces and roommates in your city today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-slate-100 shadow-xl font-bold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 font-bold">
                Try Demo Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
