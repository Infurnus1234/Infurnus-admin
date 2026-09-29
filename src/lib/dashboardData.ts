export interface StatMetric {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  category: "users" | "drivers" | "vehicles" | "rides" | "business";
}

export interface OverviewMetrics {
  totalUsers: StatMetric;
  activeUsers: StatMetric;
  suspendedUsers: StatMetric;

  totalDrivers: StatMetric;
  pendingDriverRequests: StatMetric;
  approvedDrivers: StatMetric;
  rejectedDrivers: StatMetric;
  driverDeletionRequests: StatMetric;

  totalVehicles: StatMetric;
  activeVehicles: StatMetric;
  availableVehicles: StatMetric;
  vehiclesMaintenance: StatMetric;

  activeRides: StatMetric;
  completedRides: StatMetric;
  cancelledRides: StatMetric;

  totalPartners: StatMetric;
  totalFleets: StatMetric;
  revenue: StatMetric;
  couponUsage: StatMetric;
  notifications: StatMetric;
}

export interface AdministrativeItem {
  id: string;
  title: string;
  count: number;
  badgeText: string;
  badgeVariant: "moss" | "terracotta" | "sand" | "destructive";
  href: string;
  description: string;
}

export interface ActivityFeedItem {
  id: string;
  actor: {
    name: string;
    avatar?: string;
    role: string;
  };
  action: string;
  resource: string;
  timestamp: string;
  status: "Completed" | "Pending" | "Flagged" | "Rejected";
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface DashboardChartsData {
  rideVolume: ChartDataPoint[];
  revenue: ChartDataPoint[];
  driverGrowth: ChartDataPoint[];
  userGrowth: ChartDataPoint[];
}

export const SUPER_ADMIN_METRICS: OverviewMetrics = {
  // Users
  totalUsers: { id: "u_tot", label: "Total Users", value: "48,290", change: "+14.2%", isPositive: true, category: "users" },
  activeUsers: { id: "u_act", label: "Active Users", value: "39,120", change: "+8.5%", isPositive: true, category: "users" },
  suspendedUsers: { id: "u_sus", label: "Suspended Users", value: "342", change: "-2.1%", isPositive: true, category: "users" },

  // Drivers
  totalDrivers: { id: "d_tot", label: "Total Drivers", value: "8,940", change: "+6.8%", isPositive: true, category: "drivers" },
  pendingDriverRequests: { id: "d_pen", label: "Pending Driver Requests", value: "148", change: "Requires review", isPositive: false, category: "drivers" },
  approvedDrivers: { id: "d_app", label: "Approved Drivers", value: "8,210", change: "+5.1%", isPositive: true, category: "drivers" },
  rejectedDrivers: { id: "d_rej", label: "Rejected Drivers", value: "582", change: "-1.4%", isPositive: true, category: "drivers" },
  driverDeletionRequests: { id: "d_del", label: "Driver Deletion Requests", value: "19", change: "Pending SLA", isPositive: false, category: "drivers" },

  // Vehicles
  totalVehicles: { id: "v_tot", label: "Total Vehicles", value: "6,410", change: "+4.3%", isPositive: true, category: "vehicles" },
  activeVehicles: { id: "v_act", label: "Active Vehicles", value: "5,120", change: "+3.9%", isPositive: true, category: "vehicles" },
  availableVehicles: { id: "v_ava", label: "Available Vehicles", value: "980", change: "On standby", isPositive: true, category: "vehicles" },
  vehiclesMaintenance: { id: "v_mai", label: "Vehicles Under Maintenance", value: "310", change: "Scheduled", isPositive: false, category: "vehicles" },

  // Rides
  activeRides: { id: "r_act", label: "Active Rides", value: "1,240", change: "Live now", isPositive: true, category: "rides" },
  completedRides: { id: "r_com", label: "Completed Rides (Today)", value: "14,890", change: "+18.3%", isPositive: true, category: "rides" },
  cancelledRides: { id: "r_can", label: "Cancelled Rides", value: "215", change: "1.4% rate", isPositive: true, category: "rides" },

  // Business & Partners
  totalPartners: { id: "p_tot", label: "Total Partners", value: "86", change: "+2 this month", isPositive: true, category: "business" },
  totalFleets: { id: "f_tot", label: "Total Fleets", value: "340", change: "+12 fleets", isPositive: true, category: "business" },
  revenue: { id: "rev", label: "Total Revenue (MTD)", value: "$1,482,900", change: "+22.4%", isPositive: true, category: "business" },
  couponUsage: { id: "coup", label: "Coupon Usage", value: "12,450", change: "94% redemptions", isPositive: true, category: "business" },
  notifications: { id: "notif", label: "System Notifications Sent", value: "128,400", change: "99.9% delivery", isPositive: true, category: "business" },
};

export const ADMINISTRATIVE_OVERVIEW_ITEMS: AdministrativeItem[] = [
  { id: "adm_1", title: "Pending Approvals", count: 42, badgeText: "Action Required", badgeVariant: "terracotta", href: "/super-admin/approvals", description: "Global operational requests awaiting super-admin clearance" },
  { id: "adm_2", title: "Pending Admin Requests", count: 7, badgeText: "High Priority", badgeVariant: "destructive", href: "/super-admin/admins", description: "Role escalation & privilege access tickets" },
  { id: "adm_3", title: "Driver Approval Requests", count: 148, badgeText: "Queue Active", badgeVariant: "moss", href: "/super-admin/driver-requests", description: "New driver background verification & document checks" },
  { id: "adm_4", title: "Driver Deletion Requests", count: 19, badgeText: "Compliance", badgeVariant: "sand", href: "/super-admin/driver-requests", description: "Right-to-be-forgotten & account termination requests" },
  { id: "adm_5", title: "Driver Change Requests", count: 31, badgeText: "Review", badgeVariant: "moss", href: "/super-admin/drivers", description: "Bank detail updates and license renewals" },
  { id: "adm_6", title: "Vehicle Requests", count: 54, badgeText: "Inspect", badgeVariant: "terracotta", href: "/super-admin/vehicles", description: "Fleet vehicle additions & safety certifications" },
  { id: "adm_7", title: "Permission Requests", count: 12, badgeText: "Security", badgeVariant: "sand", href: "/super-admin/roles", description: "Resource scope extension requests by regional admins" },
  { id: "adm_8", title: "Security Events", count: 3, badgeText: "Immediate Review", badgeVariant: "destructive", href: "/super-admin/security", description: "Anomalous login patterns & failed MFA attempts" },
];

export const RECENT_ADMIN_ACTIVITIES: ActivityFeedItem[] = [
  {
    id: "act_1",
    actor: { name: "Marcus Wright", role: "Regional Admin" },
    action: "Approved Vehicle Registration",
    resource: "Vehicle #INF-9082 (Toyota Prius)",
    timestamp: "12 mins ago",
    status: "Completed",
  },
  {
    id: "act_2",
    actor: { name: "Sophia Martinez", role: "Compliance Officer" },
    action: "Requested Driver Deletion",
    resource: "Driver DRV-4419 (Sam Miller)",
    timestamp: "45 mins ago",
    status: "Pending",
  },
  {
    id: "act_3",
    actor: { name: "David Chen", role: "Support Lead" },
    action: "Issued Refund Coupon",
    resource: "Coupon #INF-REFUND-20",
    timestamp: "2 hours ago",
    status: "Completed",
  },
  {
    id: "act_4",
    actor: { name: "Elena Rostova", role: "Operations Admin" },
    action: "Updated Fleet Cap Limits",
    resource: "Fleet #FLT-09 (Berlin Express)",
    timestamp: "4 hours ago",
    status: "Completed",
  },
];

export const RECENT_SUPER_ADMIN_ACTIVITIES: ActivityFeedItem[] = [
  {
    id: "sact_1",
    actor: { name: "Eleanor Vance", role: "Super Admin" },
    action: "Granted Role Elevation",
    resource: "Admin Account: marcus.w@infurnus.org",
    timestamp: "10 mins ago",
    status: "Completed",
  },
  {
    id: "sact_2",
    actor: { name: "Eleanor Vance", role: "Super Admin" },
    action: "Modified Global Security Policy",
    resource: "MFA Enforcement Protocol v2.4",
    timestamp: "1 hour ago",
    status: "Completed",
  },
  {
    id: "sact_3",
    actor: { name: "Gabriel Thorne", role: "Super Admin" },
    action: "Terminated Suspicious Session",
    resource: "IP 192.168.1.104 (Frankfurt Node)",
    timestamp: "3 hours ago",
    status: "Flagged",
  },
  {
    id: "sact_4",
    actor: { name: "Gabriel Thorne", role: "Super Admin" },
    action: "Approved Partner Organization",
    resource: "Partner: EcoMove Mobility GmbH",
    timestamp: "6 hours ago",
    status: "Completed",
  },
];

export const DASHBOARD_CHARTS_DATA: DashboardChartsData = {
  rideVolume: [
    { label: "Mon", value: 12400 },
    { label: "Tue", value: 14200 },
    { label: "Wed", value: 13800 },
    { label: "Thu", value: 16500 },
    { label: "Fri", value: 19800 },
    { label: "Sat", value: 22400 },
    { label: "Sun", value: 18900 },
  ],
  revenue: [
    { label: "Jan", value: 920000 },
    { label: "Feb", value: 1050000 },
    { label: "Mar", value: 1180000 },
    { label: "Apr", value: 1240000 },
    { label: "May", value: 1390000 },
    { label: "Jun", value: 1482900 },
  ],
  driverGrowth: [
    { label: "Q1", value: 6800 },
    { label: "Q2", value: 7400 },
    { label: "Q3", value: 8100 },
    { label: "Q4", value: 8940 },
  ],
  userGrowth: [
    { label: "Q1", value: 32000 },
    { label: "Q2", value: 37500 },
    { label: "Q3", value: 42100 },
    { label: "Q4", value: 48290 },
  ],
};
