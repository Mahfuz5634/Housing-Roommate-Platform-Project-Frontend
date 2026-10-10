'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { Button } from './Button';
import { Badge } from './Badge';
import {
  Home,
  Users,
  Compass,
  HelpCircle,
  Phone,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  ShieldCheck,
  ChevronDown,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, role, logout, setRoleDemo } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Properties', href: '/properties', icon: Building },
    { name: 'Roommates', href: '/roommates', icon: Users },
    { name: 'Services', href: '/services', icon: Compass },
    { name: 'About', href: '/about', icon: Home },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const getDashboardHref = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'LANDLORD') return '/landlord';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (role === 'ADMIN') return 'Admin Portal';
    if (role === 'LANDLORD') return 'Landlord Hub';
    return 'Dashboard';
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              🏠
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 dark:from-white dark:via-blue-200 dark:to-blue-400 bg-clip-text text-transparent">
                RoommateHub
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase ml-1.5 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 rounded">
                Verified
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link href={getDashboardHref()}>
                  <Button variant="outline" size="sm" className="gap-2 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{getDashboardLabel()}</span>
                  </Button>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                      {user.profile?.firstName?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div className="text-left text-xs leading-none">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 max-w-[90px] truncate">
                        {user.profile?.firstName || user.email.split('@')[0]}
                      </p>
                      <span className="text-[10px] text-slate-500 capitalize">{role?.toLowerCase()}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in">
                      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {user.profile?.firstName} {user.profile?.lastName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <Badge variant="primary">{role}</Badge>
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href={getDashboardHref()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>Dashboard Area</span>
                        </Link>
                        {role === 'TENANT' && (
                          <Link
                            href="/dashboard/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            <span>Roommate Profile</span>
                          </Link>
                        )}
                      </div>

                      {/* Demo Quick Switcher inside dropdown */}
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-2 px-2 pb-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                          Switch Role (Evaluator)
                        </p>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => {
                              setRoleDemo('ADMIN');
                              toast.success('Switched to Admin role');
                              setUserDropdownOpen(false);
                              router.push('/admin');
                            }}
                            className="px-1.5 py-1 text-[11px] font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-center"
                          >
                            Admin
                          </button>
                          <button
                            onClick={() => {
                              setRoleDemo('LANDLORD');
                              toast.success('Switched to Landlord role');
                              setUserDropdownOpen(false);
                              router.push('/landlord');
                            }}
                            className="px-1.5 py-1 text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-center"
                          >
                            Landlord
                          </button>
                          <button
                            onClick={() => {
                              setRoleDemo('TENANT');
                              toast.success('Switched to Tenant role');
                              setUserDropdownOpen(false);
                              router.push('/dashboard');
                            }}
                            className="px-1.5 py-1 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-center"
                          >
                            Tenant
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <link.icon className="w-4 h-4 text-slate-400" />
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" className="w-full justify-center">
                    Go to {getDashboardLabel()}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-rose-600 justify-center"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
