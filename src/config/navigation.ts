import { NavItemConfig, AdminPermission, UserRole, NavItem } from "@/types";

export const MASTER_NAVIGATION_CONFIG: NavItemConfig[] = [
  // Section: Core Operations
  {
    id: "dashboard",
    title: "Dashboard",
    path: "",
    icon: "dashboard",
    requiredPermission: "VIEW_DASHBOARD",
    section: "Core Operations",
  },
  {
    id: "users",
    title: "Users",
    path: "users",
    icon: "users",
    requiredPermission: "VIEW_USERS",
    section: "Core Operations",
  },
  {
    id: "drivers",
    title: "Drivers",
    path: "drivers",
    icon: "steering",
    requiredPermission: "VIEW_DRIVERS",
    section: "Core Operations",
  },
  {
    id: "driver-requests",
    title: "Driver Requests",
    path: "driver-requests",
    icon: "user-check",
    requiredPermission: "VIEW_DRIVER_REQUESTS",
    section: "Core Operations",
    badge: "New",
  },
  {
    id: "vehicles",
    title: "Vehicles",
    path: "vehicles",
    icon: "car",
    requiredPermission: "VIEW_VEHICLES",
    section: "Core Operations",
  },
  {
    id: "partners",
    title: "Partners",
    path: "partners",
    icon: "briefcase",
    requiredPermission: "VIEW_PARTNERS",
    section: "Core Operations",
  },
  {
    id: "fleets",
    title: "Fleets",
    path: "fleets",
    icon: "truck",
    requiredPermission: "VIEW_FLEETS",
    section: "Core Operations",
  },
  {
    id: "rides",
    title: "Rides",
    path: "rides",
    icon: "map-pin",
    requiredPermission: "VIEW_RIDES",
    section: "Core Operations",
  },

  // Section: Finance & Engagement
  {
    id: "finance",
    title: "Payments & Finance",
    path: "finance",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Finance & Engagement",
  },
  {
    id: "coupons",
    title: "Coupons",
    path: "coupons",
    icon: "ticket",
    requiredPermission: "VIEW_COUPONS",
    section: "Finance & Engagement",
  },
  {
    id: "notifications",
    title: "Notifications",
    path: "notifications",
    icon: "bell",
    requiredPermission: "VIEW_NOTIFICATIONS",
    section: "Finance & Engagement",
  },
  {
    id: "support",
    title: "Support",
    path: "support",
    icon: "help-circle",
    requiredPermission: "VIEW_SUPPORT",
    section: "Finance & Engagement",
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    path: "reports",
    icon: "bar-chart",
    requiredPermission: "VIEW_REPORTS",
    section: "Finance & Engagement",
  },

  // Section: Governance & Security
  {
    id: "admins",
    title: "Admins",
    path: "admins",
    icon: "user-shield",
    requiredPermission: "VIEW_ADMINS",
    section: "Governance & Security",
  },
  {
    id: "roles",
    title: "Roles & Permissions",
    path: "roles",
    icon: "key",
    requiredPermission: "VIEW_ROLES",
    section: "Governance & Security",
  },
  {
    id: "resources",
    title: "Resource & Scope",
    path: "resources",
    icon: "layers",
    requiredPermission: "VIEW_RESOURCES",
    section: "Governance & Security",
  },
  {
    id: "approvals",
    title: "Approval Center",
    path: "approvals",
    icon: "check-square",
    requiredPermission: "VIEW_APPROVALS",
    section: "Governance & Security",
    badge: "3",
  },
  {
    id: "audit-logs",
    title: "Audit Logs",
    path: "audit-logs",
    icon: "file-text",
    requiredPermission: "VIEW_AUDIT_LOGS",
    section: "Governance & Security",
  },
  {
    id: "security",
    title: "Security Center",
    path: "security",
    icon: "shield",
    requiredPermission: "VIEW_SECURITY",
    section: "Governance & Security",
  },

  // Section: System & Control
  {
    id: "system-config",
    title: "System Configuration",
    path: "system-config",
    icon: "cpu",
    requiredPermission: "VIEW_SYSTEM_CONFIG",
    section: "System & Control",
  },
  {
    id: "features",
    title: "Feature Management",
    path: "features",
    icon: "toggle-right",
    requiredPermission: "VIEW_FEATURES",
    section: "System & Control",
  },
  {
    id: "settings",
    title: "Platform Settings",
    path: "settings",
    icon: "settings",
    requiredPermission: "VIEW_SETTINGS",
    section: "System & Control",
  },
];

export const MOCK_ADMIN_PERMISSIONS: AdminPermission[] = [
  "VIEW_DASHBOARD",
  "VIEW_USERS",
  "VIEW_DRIVERS",
  "VIEW_VEHICLES",
  "VIEW_FLEETS",
  "VIEW_RIDES",
  "VIEW_COUPONS",
  "VIEW_NOTIFICATIONS",
  "VIEW_REPORTS",
  "VIEW_SUPPORT",
  "CREATE_REQUEST",
  "VIEW_APPROVALS",
];

export interface SectionGroupedNavItems {
  section: string;
  items: NavItem[];
}

export function getGroupedNavItemsForRole(
  role: UserRole,
  userPermissions: AdminPermission[] = MOCK_ADMIN_PERMISSIONS
): SectionGroupedNavItems[] {
  const basePath = role === "super-admin" ? "/super-admin" : "/admin";

  const visibleConfigs = MASTER_NAVIGATION_CONFIG.filter((config) => {
    if (role === "super-admin") return true;
    if (!config.requiredPermission) return true;
    return userPermissions.includes(config.requiredPermission);
  });

  const groupsMap = new Map<string, NavItem[]>();

  visibleConfigs.forEach((config) => {
    const sectionName = config.section || "General";
    if (!groupsMap.has(sectionName)) {
      groupsMap.set(sectionName, []);
    }

    const fullHref = config.path ? `${basePath}/${config.path}` : basePath;

    groupsMap.get(sectionName)?.push({
      title: config.title,
      href: fullHref,
      icon: config.icon,
      badge: config.badge,
    });
  });

  const result: SectionGroupedNavItems[] = [];
  groupsMap.forEach((items, section) => {
    result.push({ section, items });
  });

  return result;
}
