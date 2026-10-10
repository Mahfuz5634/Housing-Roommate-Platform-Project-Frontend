'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/authStore';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Building,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(6, 'Please enter a valid phone number'),
    city: z.string().min(2, 'Please enter your city'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['TENANT', 'LANDLORD'] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'TENANT' | 'LANDLORD'>('TENANT');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'TENANT',
      city: 'New York',
    },
  });

  const handleRoleChange = (role: 'TENANT' | 'LANDLORD') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<{ accessToken: string; user: any }>('/auth/register', data);
      if (res.success && res.data) {
        login(res.data.user, res.data.accessToken);
        toast.success(`Account created successfully! Welcome to RoommateHub.`);
        if (data.role === 'LANDLORD') {
          router.push('/landlord');
        } else {
          router.push('/dashboard');
        }
      } else {
        toast.error(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-2xl shadow-sm mb-1">
            🏠
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join thousands of verified renters and landlords today
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {/* Role selector tab */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Your Profile Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange('TENANT')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  selectedRole === 'TENANT'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${selectedRole === 'TENANT' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Tenant / Roommate</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Looking for rooms & roommates</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('LANDLORD')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  selectedRole === 'LANDLORD'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${selectedRole === 'LANDLORD' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Property Landlord</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">List properties & manage leases</p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    {...register('firstName')}
                    placeholder="John"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {errors.firstName && <p className="text-xs text-rose-500 mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  {...register('lastName')}
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
                {errors.lastName && <p className="text-xs text-rose-500 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    {...register('phone')}
                    placeholder="+1 (555) 012-3456"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Primary City
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    {...register('city')}
                    placeholder="New York"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full shadow-md py-3 font-semibold mt-2">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Complete Registration
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
