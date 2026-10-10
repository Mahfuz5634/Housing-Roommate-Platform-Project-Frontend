import { useAuthStore } from '@/lib/authStore';

export function useAuth() {
  const { user, role, isAuthenticated, isInitialized, logout, setRoleDemo } = useAuthStore();

  const isAdmin = role === 'ADMIN';
  const isLandlord = role === 'LANDLORD';
  const isTenant = role === 'TENANT';

  return {
    user,
    role,
    isAuthenticated,
    isInitialized,
    isAdmin,
    isLandlord,
    isTenant,
    logout,
    setRoleDemo,
  };
}
