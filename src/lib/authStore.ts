import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User, UserRole } from '../types';
import { DEMO_USERS } from './mockData';

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
    const demoUser = DEMO_USERS[role];
    const demoToken = `mock_jwt_${role.toLowerCase()}_${Date.now()}`;
    get().login(demoUser, demoToken);
    return demoUser;
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
