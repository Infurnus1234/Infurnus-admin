import { NavItemConfig, AdminPermission, UserRole, NavItem } from "@/types";

export const MASTER_NAVIGATION_CONFIG: NavItemConfig[] = [
  {
    id: "commission",
    title: "Recorded Commission",
    path: "commission",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Finance & Engagement",
  },
  {
    id: "refunds",
    title: "Refunds",
    path: "refunds",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Finance & Engagement",
  },
  {
    id: "pricing",
    title: "Categories & Pricing",
    path: "pricing",
    icon: "car",
    requiredPermission: "VIEW_VEHICLES",
    section: "Core Operations",
  },
  {
    id: "logistics",
    title: "Logistics & Parcels",
    path: "logistics",
    icon: "truck",
    requiredPermission: "VIEW_RIDES",
    section: "Core Operations",
  },
  {
    id: "rentals",
    title: "Rental Bookings",
    path: "rentals",
    icon: "car",
    requiredPermission: "VIEW_RIDES",
    section: "Core Operations",
  },
  {
    id: "wallets",
    title: "Wallets",
    path: "wallets",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Finance & Engagement",
  },
  {
    id: "transactions",
    title: "Transactions",
    path: "transactions",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Finance & Engagement",
  },
  {
    id: "settlements",
    title: "Settlements",
    path: "settlements",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Finance & Engagement",
  },
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

export interface SectionGroupedNavItems {
  section: string;
  items: NavItem[];
}

export function getGroupedNavItemsForRole(
  role: UserRole,
  userPermissions: AdminPermission[] = [],
): SectionGroupedNavItems[] {
  const basePath = role === "super-admin" ? "/super-admin" : "/admin";

  const visibleConfigs = MASTER_NAVIGATION_CONFIG.filter((config) => {
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

  const order = [
    "Core Operations",
    "Finance & Engagement",
    "Governance & Security",
    "System & Control",
  ];
  return result.sort(
    (left, right) => order.indexOf(left.section) - order.indexOf(right.section),
  );
}
