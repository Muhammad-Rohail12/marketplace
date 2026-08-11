'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PageLoader from '@/components/feedback/PageLoader';
import { ROUTES } from '@/constants/routes';
import { hasRole, hasPermission } from '@/utils/permissions';

export default function ProtectedRoute({ children, allowedRoles, permission }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const isRoleAllowed = !allowedRoles || hasRole(user?.role, allowedRoles);
  const isPermissionAllowed = !permission || hasPermission(user?.role, permission);
  const isAuthorized = isRoleAllowed && isPermissionAllowed;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (!isAuthorized) {
      router.replace('/forbidden');
    }
  }, [isLoading, isAuthenticated, isAuthorized, router]);

  if (isLoading) return <PageLoader label="Checking your session..." />;
  if (!isAuthenticated || !isAuthorized) return null;

  return children;
}