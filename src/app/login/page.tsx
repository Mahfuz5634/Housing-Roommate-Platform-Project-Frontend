'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAuthStore, LIVE_DEMO_CREDENTIALS } from '@/lib/authStore';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import { Lock, Mail, Eye, EyeOff, Shield, Building2, UserCircle2, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<{ accessToken: string; user: any }>('/auth/login', data);
      if (res.success && res.data) {
        login(res.data.user, res.data.accessToken);
        toast.success(`Welcome back, ${res.data.user.profile?.firstName || 'User'}!`);

        const role = res.data.user.role;
        const target =
          callbackUrl ||
          (role === 'ADMIN' ? '/admin' : role === 'LANDLORD' ? '/landlord' : '/dashboard');
        router.push(target);
      } else {
        toast.error(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    const creds = LIVE_DEMO_CREDENTIALS[role];
    try {
      setValue('email', creds.email);
      setValue('password', creds.password);

      const res = await apiClient.post<{ accessToken: string; user: any }>('/auth/login', {
        email: creds.email,
        password: creds.password,
      });

      if (res.success && res.data) {
        login(res.data.user, res.data.accessToken);
        toast.success(`Live Login Verified: ${creds.label} (${creds.email})`);
        const target =
          callbackUrl ||
          (role === 'ADMIN' ? '/admin' : role === 'LANDLORD' ? '/landlord' : '/dashboard');
        router.push(target);
      } else {
        toast.error(res.message || 'Live authentication failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to authenticate via live API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-2xl shadow-sm mb-1">
            🏠
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome Back 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your housing & roommate dashboard
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {/* Standard Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition ${
                    errors.email
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info('For evaluation, click one of the live demo buttons below!')
                  }
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition ${
                    errors.password
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full shadow-md py-3 font-semibold">
              <Lock className="w-4 h-4 mr-1.5" /> Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider relative">
              OR LIVE DEMO ACCESS
            </span>
          </div>

          {/* MANDATORY ONE-CLICK ROLE DEMO LOGIN SECTION (CONNECTED TO LIVE BACKEND) */}
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <span>⚡ 1-Click Live Role Login</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Authenticates directly against live API database with real JWT
              </p>
            </div>

            {/* Grid of 3 distinct roles */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Admin Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDemoLogin('ADMIN')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/70 dark:hover:bg-purple-900/40 text-purple-900 dark:text-purple-200 transition-all group text-left disabled:opacity-60"
              >
                <div className="flex items-center gap-1.5 mb-1 text-purple-600 dark:text-purple-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold">👨‍💼 Admin</span>
                </div>
                <span className="text-[10px] text-purple-600/80 dark:text-purple-400 font-medium">
                  admin@roommatehub.com
                </span>
              </button>

              {/* User / Tenant Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDemoLogin('TENANT')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 text-blue-900 dark:text-blue-200 transition-all group text-left disabled:opacity-60"
              >
                <div className="flex items-center gap-1.5 mb-1 text-blue-600 dark:text-blue-400">
                  <UserCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold">👤 Tenant</span>
                </div>
                <span className="text-[10px] text-blue-600/80 dark:text-blue-400 font-medium">
                  alex.tenant@roommatehub.com
                </span>
              </button>
            </div>

            {/* Provider / Landlord Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleDemoLogin('LANDLORD')}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 transition-all group disabled:opacity-60"
            >
              <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold">🏠 Landlord / Host</span>
              <span className="text-[10px] text-amber-600/80 dark:text-amber-400 font-medium ml-1">
                (sarah.landlord@roommatehub.com)
              </span>
            </button>
          </div>
        </div>

        {/* Footer signup prompt */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account yet?{' '}
          <Link
            href="/register"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center">Loading login portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
