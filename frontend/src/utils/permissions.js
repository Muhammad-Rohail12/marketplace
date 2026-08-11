import { ROLE_PERMISSIONS } from '@/constants/rolePermissions';

export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(role, permission) {
  return getPermissionsForRole(role).includes(permission);
}

export function hasRole(userRole, allowedRoles = []) {
  return allowedRoles.includes(userRole);
}