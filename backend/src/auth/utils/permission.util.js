const ROLE_PERMISSIONS = require('../../constants/rolePermissions');

const getPermissionsForRole = (role) => ROLE_PERMISSIONS[role] || [];

const hasPermission = (role, permission) => getPermissionsForRole(role).includes(permission);

const hasAnyPermission = (role, permissionList = []) =>
  permissionList.some((permission) => hasPermission(role, permission));

const hasAllPermissions = (role, permissionList = []) =>
  permissionList.every((permission) => hasPermission(role, permission));

module.exports = { getPermissionsForRole, hasPermission, hasAnyPermission, hasAllPermissions };