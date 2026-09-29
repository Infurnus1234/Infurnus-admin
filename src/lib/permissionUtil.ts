export interface MockAdminUserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  resources: string[];
}

export const MOCK_LOGGED_IN_ADMIN: MockAdminUserProfile = {
  id: "ADM-100",
  name: "John Admin",
  email: "john.admin@infurnus.org",
  role: "Regional Admin (Fleet A)",
  permissions: ["VIEW_VEHICLES", "VIEW_DRIVERS", "VIEW_RIDES", "VIEW_REPORTS"],
  resources: [
    "Fleet A (Berlin Express)",
    "Vehicle-1 (B-IN 4022)",
    "Vehicle-2 (B-IN 4023)",
    "Vehicle-3 (B-IN 4024)",
    "Vehicle-4 (B-IN 4025)",
    "Vehicle-5 (B-IN 4026)",
    "Drivers assigned to Fleet A",
  ],
};

// Module to required permission mapping
export const MODULE_PERMISSIONS_MAP: Record<string, string> = {
  vehicles: "VIEW_VEHICLES",
  drivers: "VIEW_DRIVERS",
  rides: "VIEW_RIDES",
  reports: "VIEW_REPORTS",
  finance: "VIEW_PAYMENTS",
  coupons: "VIEW_COUPONS",
  notifications: "VIEW_NOTIFICATIONS",
  users: "VIEW_USERS",
  security: "VIEW_SECURITY",
};

/**
 * Check if the user has a specific permission
 */
export function can(
  permission: string,
  userPermissions: string[] = MOCK_LOGGED_IN_ADMIN.permissions
): boolean {
  if (!permission) return true;
  return userPermissions.includes(permission);
}

/**
 * Check if the user has access to a specific resource
 */
export function hasResource(
  resource: string,
  userResources: string[] = MOCK_LOGGED_IN_ADMIN.resources
): boolean {
  if (!resource) return true;
  return userResources.some((r) => r.toLowerCase().includes(resource.toLowerCase()));
}

/**
 * Check if the user can access a specific UI module
 */
export function canAccessModule(
  module: string,
  userPermissions: string[] = MOCK_LOGGED_IN_ADMIN.permissions
): boolean {
  const requiredPerm = MODULE_PERMISSIONS_MAP[module.toLowerCase()];
  if (!requiredPerm) return true;
  return can(requiredPerm, userPermissions);
}
