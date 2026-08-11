'use client';

import { useAuth } from '@/context/AuthContext';
import { hasRole } from '@/utils/permissions';

// Purely presentational guard — conditionally renders children based
// on the current user's role. Does NOT redirect; use ProtectedRoute
// for full-page/route-level protection. This is for hiding/showing
// smaller pieces of UI (buttons, sections, nav items) by role.
export default function RoleGuard({ allowedRoles, children, fallback = null }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !hasRole(user?.role, allowedRoles)) {
    return fallback;
  }

  return children;
}