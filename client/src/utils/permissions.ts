export const RolePermissions = {
  INVITE_USER: ["SYSTEM_ADMIN", "MANAGER"],
  VIEW_ALL_PROFILES: ["SYSTEM_ADMIN"],
  MANAGE_ALL_PROFILES: ["SYSTEM_ADMIN"],
  EDIT_OWN_PROFILE: ["SYSTEM_ADMIN", "MANAGER", "GENERAL_EMPLOYEE"],
  VIEW_COMPANY_INFO: ["SYSTEM_ADMIN", "MANAGER", "GENERAL_EMPLOYEE"],
  EDIT_COMPANY_INFO: ["SYSTEM_ADMIN", "MANAGER"],
  SEARCH_EMPLOYEES: ["SYSTEM_ADMIN", "MANAGER"],
};

export const hasPermission = (
  action: keyof typeof RolePermissions,
  role: string
): boolean => {
  const allowedRoles = RolePermissions[action];
  return allowedRoles.includes(role);
};

export const canAccessRoute = (
  routeRoles: string[],
  userRole: string
): boolean => {
  return routeRoles.includes(userRole);
};


export const  Role = {
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  MANAGER: "MANAGER",
  GENERAL_EMPLOYEE: "GENERAL_EMPLOYEE",
}