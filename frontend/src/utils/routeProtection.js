// Placeholder route-protection helper — not applied to any page yet.
// Real usage begins once protected pages exist (Milestone 2+).
export function hasRequiredRole(userRole, allowedRoles = []) {
  return allowedRoles.includes(userRole);
}