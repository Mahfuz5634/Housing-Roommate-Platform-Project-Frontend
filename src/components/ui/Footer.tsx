'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="text-xl font-extrabold text-white tracking-tight">RoommateHub</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier next-generation platform for verified urban housing, verified co-living, and smart compatibility-matched roommates.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-4 h-4" /> 100% ID-verified community
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/properties" className="hover:text-white transition">Explore Listings</Link>
              </li>
              <li>
                <Link href="/roommates" className="hover:text-white transition">Find Compatible Roommates</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">Escrow Deposit Protection</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Support & Contact</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">Demo Evaluator Access</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">Landlord Partner Program</Link>
              </li>
            </ul>
          </div>

          {/* Trust and Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Stay Informed</h4>
            <p className="text-xs text-slate-400">
              Subscribe to get notified about new verified properties and neighborhood roommate matches.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RoommateHub Inc. Built for Next-Level Assignment 7. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & Next.js App Router
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <Sparkles className="w-3.5 h-3.5" /> Stripe Enabled
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
