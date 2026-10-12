import type {
  NavItemConfig,
  AdminPermission,
  UserRole,
  NavItem,
} from "@/types";

export const MASTER_NAVIGATION_CONFIG: NavItemConfig[] = [
  {
    id: "commission",
    title: "Commission Management",
    path: "commission",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Pricing & Commission",
  },
  {
    id: "refunds",
    title: "Refunds",
    path: "refunds",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Wallet & Payments",
  },
  {
    id: "pricing",
    title: "Vehicle Categories & Pricing",
    path: "pricing",
    icon: "car",
    requiredPermission: "VIEW_VEHICLES",
    section: "Pricing & Commission",
  },
  {
    id: "logistics",
    title: "Logistics Bookings",
    path: "logistics",
    icon: "truck",
    requiredPermission: "VIEW_RIDES",
    section: "Booking Management",
  },
  {
    id: "rentals",
    title: "Rental Bookings",
    path: "rentals",
    icon: "car",
    requiredPermission: "VIEW_RIDES",
    section: "Booking Management",
  },
  {
    id: "wallets",
    title: "Wallet Management",
    path: "wallets",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Wallet & Payments",
  },
  {
    id: "transactions",
    title: "Transactions",
    path: "transactions",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Wallet & Payments",
  },
  {
    id: "settlements",
    title: "Settlements",
    path: "settlements",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Wallet & Payments",
  },
  // Section: Core Operations
  {
    id: "dashboard",
    title: "Dashboard",
    path: "",
    icon: "dashboard",
    requiredPermission: "VIEW_DASHBOARD",
    section: "Dashboard",
  },
  {
    id: "users",
    title: "Customers",
    path: "users",
    icon: "users",
    requiredPermission: "VIEW_USERS",
    section: "User Management",
  },
  {
    id: "drivers",
    title: "Drivers",
    path: "drivers",
    icon: "steering",
    requiredPermission: "VIEW_DRIVERS",
    section: "User Management",
  },
  {
    id: "driver-requests",
    title: "Verification Requests",
    path: "driver-requests",
    icon: "user-check",
    requiredPermission: "VIEW_DRIVER_REQUESTS",
    section: "User Management",
  },
  {
    id: "vehicles",
    title: "Vehicle Inventory",
    path: "vehicles",
    icon: "car",
    requiredPermission: "VIEW_VEHICLES",
    section: "Vehicle Management",
  },
  {
    id: "partners",
    title: "Business Profiles",
    path: "partners",
    icon: "briefcase",
    requiredPermission: "VIEW_PARTNERS",
    section: "User Management",
  },
  {
    id: "fleets",
    title: "Fleet Monitoring",
    path: "fleets",
    icon: "truck",
    requiredPermission: "VIEW_FLEETS",
    section: "Vehicle Management",
  },
  {
    id: "rides",
    title: "Ride Bookings",
    path: "rides",
    icon: "map-pin",
    requiredPermission: "VIEW_RIDES",
    section: "Booking Management",
  },

  // Section: Finance & Engagement
  {
    id: "finance",
    title: "Payments",
    path: "finance",
    icon: "wallet",
    requiredPermission: "VIEW_PAYMENTS",
    section: "Wallet & Payments",
  },
  {
    id: "coupons",
    title: "Promo Codes",
    path: "coupons",
    icon: "ticket",
    requiredPermission: "VIEW_COUPONS",
    section: "Pricing & Commission",
  },
  {
    id: "notifications",
    title: "Notifications",
    path: "notifications",
    icon: "bell",
    requiredPermission: "VIEW_NOTIFICATIONS",
    section: "System Management",
  },
  {
    id: "support",
    title: "Support",
    path: "support",
    icon: "help-circle",
    requiredPermission: "VIEW_SUPPORT",
    section: "System Management",
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    path: "reports",
    icon: "bar-chart",
    requiredPermission: "VIEW_REPORTS",
    section: "Reports & Analytics",
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
    section: "User Management",
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
    "Dashboard",
    "User Management",
    "Booking Management",
    "Vehicle Management",
    "Pricing & Commission",
    "Wallet & Payments",
    "Reports & Analytics",
    "System Management",
    "Governance & Security",
    "System & Control",
  ];
  return result.sort(
    (left, right) => order.indexOf(left.section) - order.indexOf(right.section),
  );
}
