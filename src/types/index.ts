export type UserRole = "super-admin" | "admin";

export type AdminPermission =
  | "VIEW_DASHBOARD"
  | "VIEW_USERS"
  | "VIEW_DRIVERS"
  | "VIEW_DRIVER_REQUESTS"
  | "VIEW_VEHICLES"
  | "VIEW_PARTNERS"
  | "VIEW_FLEETS"
  | "VIEW_RIDES"
  | "VIEW_PAYMENTS"
  | "VIEW_COUPONS"
  | "VIEW_NOTIFICATIONS"
  | "VIEW_SUPPORT"
  | "VIEW_REPORTS"
  | "VIEW_ADMINS"
  | "VIEW_ROLES"
  | "VIEW_RESOURCES"
  | "VIEW_APPROVALS"
  | "VIEW_AUDIT_LOGS"
  | "VIEW_SECURITY"
  | "VIEW_SYSTEM_CONFIG"
  | "VIEW_FEATURES"
  | "VIEW_SETTINGS"
  | "CREATE_REQUEST";

export interface NavItemConfig {
  id: string;
  title: string;
  path: string; // relative path e.g. "" (for dashboard), "users", "drivers"
  icon: string;
  requiredPermission?: AdminPermission;
  section?: string;
  badge?: string;
  children?: NavItemConfig[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  department?: string;
  permissions?: AdminPermission[];
}

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}
