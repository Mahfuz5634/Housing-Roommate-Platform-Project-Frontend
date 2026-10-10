import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, HeartHandshake, Eye, Award, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'About Us | RoommateHub',
  description: 'Our mission to redefine modern urban co-living through verified housing and lifestyle compatibility.',
};

export default function AboutPage() {
  const team = [
    {
      name: 'Sarah Connor',
      role: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Former proptech director passionate about building transparent urban communities.',
    },
    {
      name: 'David Patel',
      role: 'Head of Engineering',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Fullstack architect specializing in high-throughput matching algorithms and fintech integrations.',
    },
    {
      name: 'Elena Rostova',
      role: 'VP of Trust & Safety',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      bio: 'Over a decade ensuring tenant protections, fraud mitigation, and dispute arbitration.',
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Our Vision & Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Redefining How the World Shares Homes
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Finding a place to live and a trustworthy roommate should not be a game of chance. RoommateHub was founded on the belief that safe, transparent, and verified co-living creates thriving urban lives.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Uncompromising Safety</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every landlord, listing, and applicant undergoes stringent identity checks. Fake photos and ghost listings are eliminated before they ever go live.
          </p>
        </Card>

        <Card className="p-8 space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Compatibility That Matters</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We look past mere square footage. Our lifestyle compatibility survey matches flatmates based on sleep rhythms, cleanliness habits, and pets.
          </p>
        </Card>

        <Card className="p-8 space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Financial Security</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            With integrated Stripe checkout and escrow holding, your deposit is safely held until the lease conditions and move-in are fully verified.
          </p>
        </Card>
      </div>

      {/* Leadership Team */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Meet the Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Engineers, designers, and real estate pioneers dedicated to better co-living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <Card key={member.name} className="overflow-hidden group">
              <div className="relative h-64 w-full bg-slate-100 dark:bg-slate-800">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{member.name}</h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{member.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed mt-2">{member.bio}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
