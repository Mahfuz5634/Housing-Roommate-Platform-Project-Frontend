import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Property } from '@/types';
import {
  Search,
  ShieldCheck,
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
  KeyRound,
  Calendar,
  Sparkles,
} from 'lucide-react';

async function getLiveFeaturedProperties(): Promise<Property[]> {
  try {
    const res = await fetch('https://housing-roommate-platform-project-b.vercel.app/api/v1/properties', {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    console.error('Error fetching live properties for home page', err);
    return [];
  }
}

async function getLiveFeaturedRoommates(): Promise<any[]> {
  try {
    const loginRes = await fetch('https://housing-roommate-platform-project-b.vercel.app/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.tenant@roommatehub.com', password: 'Tenant@123456' }),
      cache: 'no-store',
    });
    const loginData = await loginRes.json();
    if (!loginData.data?.accessToken) return [];

    const res = await fetch('https://housing-roommate-platform-project-b.vercel.app/api/v1/roommates', {
      headers: { Authorization: `Bearer ${loginData.data.accessToken}` },
      cache: 'no-store',
    });
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    console.error('Error fetching live roommates for home page', err);
    return [];
  }
}

export default async function HomePage() {
  const liveProperties = await getLiveFeaturedProperties();
  const liveRoommates = await getLiveFeaturedRoommates();
  const featuredProperties = liveProperties.slice(0, 3);
  const featuredRoommates = liveRoommates.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 sm:py-16 lg:py-20 border-b border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Authentic Copy & Search */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified City Rentals &amp; Roommate Community</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.12]">
                Find a room you love, with roommates you&apos;ll{' '}
                <span className="text-blue-600 dark:text-blue-400">actually enjoy</span> living with.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-xl">
                Skip broker fees, ghost listings, and awkward interviews. Browse verified apartments, connect with background-checked roommates based on daily living habits, and secure your room with safe Stripe escrow deposits.
              </p>

              {/* Intuitive Search Bar */}
              <div className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-xl">
                <form action="/properties" method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="px-3 py-1.5 sm:col-span-6 text-left">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      City / Neighborhood
                    </label>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <input
                        type="text"
                        name="city"
                        placeholder="New York, Austin, Chicago..."
                        className="w-full text-sm font-medium bg-transparent focus:outline-none placeholder-slate-400 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="px-3 py-1.5 sm:col-span-3 text-left border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Space Type
                    </label>
                    <select
                      name="propertyType"
                      className="w-full text-sm font-medium bg-transparent focus:outline-none text-slate-900 dark:text-slate-100 mt-0.5 cursor-pointer"
                    >
                      <option value="">Any</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="CONDO">Condo</option>
                      <option value="STUDIO">Studio</option>
                      <option value="HOUSE">House</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3 flex items-center p-0.5">
                    <Button type="submit" variant="primary" className="w-full h-full rounded-xl gap-1.5 font-semibold text-sm py-2.5">
                      <Search className="w-4 h-4" /> Find
                    </Button>
                  </div>
                </form>
              </div>

              {/* Popular quick links */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-400">Popular:</span>
                <Link href="/properties?city=New+York" className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition">
                  New York
                </Link>
                <Link href="/properties?city=Austin" className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition">
                  Austin
                </Link>
                <Link href="/properties?city=San+Francisco" className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition">
                  San Francisco
                </Link>
                <Link href="/roommates" className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 transition font-medium">
                  Roommates →
                </Link>
              </div>

              {/* Social Proof & Trust */}
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="relative w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-200">
                      <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="User" fill className="object-cover" />
                    </div>
                    <div className="relative w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-200">
                      <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="User" fill className="object-cover" />
                    </div>
                    <div className="relative w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-200">
                      <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="User" fill className="object-cover" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">4.9/5 from 3,200+ renters</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% ID-Verified</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Stripe Escrow Protected</span>
                </div>
              </div>
            </div>

            {/* Right Column: High Quality Generated Hero Image with Contextual Floating Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/4.5] bg-slate-100 dark:bg-slate-800">
                <Image
                  src="/images/hero-apartment.jpg"
                  alt="Modern Sunlit Shared Apartment Loft"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-900/10 pointer-events-none" />

                {/* Floating Card: Roommate Compatibility */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 max-w-[220px]">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                        alt="Roommate"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Sarah &amp; Maya</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">98% Compatibility</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    <span>🌙 11 PM Sleep</span>
                    <span>✨ Clean: 5/5</span>
                    <span>🐾 Pet Ok</span>
                  </div>
                </div>

                {/* Floating Bottom Left: Listing Info */}
                <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg border border-white/10">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Williamsburg, Brooklyn</p>
                  <p className="text-sm font-extrabold text-white mt-0.5">$1,250 <span className="text-[11px] font-normal text-slate-300">/mo private room</span></p>
                </div>

                {/* Floating Bottom Right: Escrow Guarantee */}
                <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">Deposit Protected</p>
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">Stripe Escrow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Real Metrics Bar */}
      <section className="bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">14,200+</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Verified City Rooms</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">96%</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Housemate Match Rate</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">$0</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Zero Broker Fees</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">100%</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Stripe Escrow Security</p>
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
                Handpicked Urban Spaces
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                Featured Verified Properties
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Each listing is inspected with verified utility costs and transparent house rules.
              </p>
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                Habit &amp; Lifestyle Matching
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                Meet Compatible Housemates
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Compare sleep schedules, cleanliness habits, and lifestyle preferences before scheduling a visit.
              </p>
            </div>
            <Link href="/roommates">
              <Button variant="outline" className="gap-2">
                <span>Browse All Profiles</span>
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
                      View Compatibility Profile
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
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Simple &amp; Transparent</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              How Shared Living Works Here
            </h2>
            <p className="text-sm text-slate-500">
              From finding an open room to picking up your keys in 3 safe steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-black text-xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Explore Verified Rooms</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter by verified monthly rent, room size, utilities included, and check real roommate profiles before scheduling a walk-through.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-black text-xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Connect &amp; Check Compatibility</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compare waking schedules, cleaning standards, guest policies, and work-from-home habits to avoid shared-living friction.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-black text-xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Reserve with Escrow Protection</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pay your holding security deposit safely through Stripe test mode. Funds remain protected until lease confirmation and move-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Renter Stories */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Real Community</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Loved by City Renters &amp; Landlords
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-200">
                  <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Emma" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Emma Thornton</h4>
                  <p className="text-xs text-slate-500">Graphic Designer • Brooklyn, NY</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                &quot;Finding a roommate in New York usually feels like rolling the dice. With RoommateHub, I found someone with the exact same sleep hours and hygiene standards. We&apos;ve lived together for 8 months without a single disagreement!&quot;
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-200">
                  <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Marcus" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Marcus Chen</h4>
                  <p className="text-xs text-slate-500">Property Owner • Austin, TX</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                &quot;As a landlord, managing roommate turnover was a headache. The Stripe escrow deposit integration and built-in maintenance ticket dashboard made our rental operations 10x smoother.&quot;
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center border-t border-slate-800">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to find your ideal home or roommate?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of urban renters enjoying transparent pricing, verified housemates, and protected deposits.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link href="/properties">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg font-bold">
                Explore Verified Listings
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 font-bold">
                One-Click Demo Access
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
