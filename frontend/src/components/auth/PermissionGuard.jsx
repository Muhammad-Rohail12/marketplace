'use client';

import { useAuth } from '@/context/AuthContext';
import { hasPermission } from '@/utils/permissions';

export default function PermissionGuard({ permission, children, fallback = null }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !hasPermission(user?.role, permission)) {
    return fallback;
  }

  return children;
}