'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import {
  LayoutDashboard,
  Building,
  Users,
  CreditCard,
  Wrench,
  User,
  PlusCircle,
  FileCheck2,
  BarChart3,
  LogOut,
  Shield,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  // Define role-specific navigation menus
  const tenantNavigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/dashboard/bookings', icon: FileCheck2 },
    { name: 'Maintenance Hub', href: '/dashboard/maintenance', icon: Wrench },
    { name: 'Roommate Profile', href: '/dashboard/profile', icon: User },
    { name: 'Payment History', href: '/dashboard/payments', icon: CreditCard },
  ];

  const landlordNavigation = [
    { name: 'Overview', href: '/landlord', icon: LayoutDashboard },
    { name: 'My Listings', href: '/landlord/properties', icon: Building },
    { name: 'Post New Property', href: '/landlord/properties/create', icon: PlusCircle },
    { name: 'Booking Requests', href: '/landlord/bookings', icon: FileCheck2 },
    { name: 'Maintenance Tickets', href: '/landlord/maintenance', icon: Wrench },
  ];

  const adminNavigation = [
    { name: 'Platform Analytics', href: '/admin', icon: BarChart3 },
    { name: 'Resource Management', href: '/admin/manage', icon: Layers },
    { name: 'Audit Reports & Logs', href: '/admin/reports', icon: Shield },
  ];

  let currentNav = tenantNavigation;
  if (role === 'LANDLORD') currentNav = landlordNavigation;
  if (role === 'ADMIN') currentNav = adminNavigation;

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-5rem)]">
      {/* Sidebar Role Identity banner */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm shadow-inner">
            {role === 'ADMIN' ? '👨‍💼' : role === 'LANDLORD' ? '🛠️' : '👤'}
          </div>
          <div className="truncate">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {user?.profile?.firstName || 'User'} {user?.profile?.lastName || ''}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1">
        {currentNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Switcher and Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
