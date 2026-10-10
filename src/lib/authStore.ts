import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User, UserRole } from '../types';

export const LIVE_DEMO_CREDENTIALS = {
  ADMIN: {
    email: 'admin@roommatehub.com',
    password: 'Admin@123456',
    role: 'ADMIN' as UserRole,
    label: 'Platform Admin',
    description: 'Manage users, verify listings & platform analytics',
  },
  LANDLORD: {
    email: 'sarah.landlord@roommatehub.com',
    password: 'Landlord@123456',
    role: 'LANDLORD' as UserRole,
    label: 'Verified Landlord',
    description: 'Manage property listings & review tenant bookings',
  },
  TENANT: {
    email: 'alex.tenant@roommatehub.com',
    password: 'Tenant@123456',
    role: 'TENANT' as UserRole,
    label: 'Active Tenant',
    description: 'Browse rooms, match roommates & pay Stripe deposit',
  },
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setRoleDemo: (role: UserRole) => User;
  updateUser: (userData: Partial<User>) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  role: null,
  isAuthenticated: false,
  isInitialized: false,

  login: (userData: User, token: string) => {
    Cookies.set('token', token, { expires: 7, path: '/' });
    Cookies.set('role', userData.role, { expires: 7, path: '/' });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    }
    set({
      user: userData,
      accessToken: token,
      role: userData.role,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  logout: () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('role', { path: '/' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    set({
      user: null,
      accessToken: null,
      role: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },

  setRoleDemo: (role: UserRole) => {
    const cred = LIVE_DEMO_CREDENTIALS[role];
    const user: User = {
      id: role === 'ADMIN' ? 'admin-001' : role === 'LANDLORD' ? '8265c54b-3734-419f-99d3-978655e7d78a' : 'af639c51-5b18-49a1-a405-82aa00f36cb1',
      email: cred.email,
      role: cred.role,
      status: 'ACTIVE',
      isVerified: true,
      createdAt: '2026-10-09T17:10:44.112Z',
      updatedAt: '2026-10-09T17:10:44.112Z',
      profile: {
        id: `prof-${role.toLowerCase()}`,
        userId: role === 'ADMIN' ? 'admin-001' : role === 'LANDLORD' ? '8265c54b-3734-419f-99d3-978655e7d78a' : 'af639c51-5b18-49a1-a405-82aa00f36cb1',
        firstName: role === 'ADMIN' ? 'Platform' : role === 'LANDLORD' ? 'Sarah' : 'Alex',
        lastName: role === 'ADMIN' ? 'Administrator' : role === 'LANDLORD' ? 'Connor' : 'Morgan',
        city: role === 'ADMIN' ? 'San Francisco' : role === 'LANDLORD' ? 'Austin' : 'New York',
        createdAt: '2026-10-09T17:10:44.112Z',
        updatedAt: '2026-10-09T17:10:44.112Z',
      },
    };
    get().login(user, `live_jwt_${role.toLowerCase()}`);
    return user;
  },

  updateUser: (partial: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...partial };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updated));
    }
    set({ user: updated });
  },

  initializeAuth: () => {
    if (typeof window === 'undefined') return;
    try {
      const storedToken = localStorage.getItem('token') || Cookies.get('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        Cookies.set('token', storedToken, { expires: 7, path: '/' });
        Cookies.set('role', parsedUser.role, { expires: 7, path: '/' });
        set({
          user: parsedUser,
          accessToken: storedToken,
          role: parsedUser.role,
          isAuthenticated: true,
          isInitialized: true,
        });
        return;
      }
    } catch (e) {
      console.error('Failed to initialize auth from storage', e);
    }
    set({ isInitialized: true });
  },
}));
