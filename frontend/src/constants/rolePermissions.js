import { ROLES } from './roles';
import { PERMISSIONS } from './permissions';

// Mirrors backend/src/constants/rolePermissions.js — kept in sync
// manually since frontend and backend are separate deployables.
// Frontend-side checks are for UI/UX only (hiding buttons/links);
// the backend is the sole authority and re-checks independently.
export const ROLE_PERMISSIONS = {
  [ROLES.BUYER]: [PERMISSIONS.PRODUCT_READ, PERMISSIONS.ORDER_READ, PERMISSIONS.USER_READ, PERMISSIONS.USER_UPDATE],

  [ROLES.SELLER]: [
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_DELETE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
  ],

  [ROLES.ADMIN]: Object.values(PERMISSIONS),
};