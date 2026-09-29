export type ResourceType =
  | "User"
  | "Driver"
  | "Vehicle"
  | "Ride"
  | "Fleet"
  | "Partner"
  | "Coupon"
  | "Notification"
  | "Payment";

export type ActionType =
  | "View"
  | "Create"
  | "Update"
  | "Delete"
  | "Approve"
  | "Reject"
  | "Assign"
  | "Unassign"
  | "Suspend"
  | "Activate"
  | "Deactivate"
  | "Export"
  | "Send";

export type ScopeType =
  | "Entire Platform"
  | "State"
  | "District"
  | "City"
  | "Partner"
  | "Fleet"
  | "Vehicle"
  | "Driver"
  | "User"
  | "Ride";

export type PermissionLifetime = "Permanent" | "Temporary" | "One-time";

export interface AssignedPermissionRule {
  id: string;
  adminId: string;
  adminName: string;
  resource: ResourceType;
  action: ActionType;
  scope: ScopeType;
  scopeValue: string; // e.g., "Fleet A (Berlin Express)", "Bavaria State", "Global"
  lifetime: PermissionLifetime;
  expiresAt?: string;
  grantedDate: string;
}

export const RESOURCES_LIST: ResourceType[] = [
  "User",
  "Driver",
  "Vehicle",
  "Ride",
  "Fleet",
  "Partner",
  "Coupon",
  "Notification",
  "Payment",
];

export const ACTIONS_LIST: ActionType[] = [
  "View",
  "Create",
  "Update",
  "Delete",
  "Approve",
  "Reject",
  "Assign",
  "Unassign",
  "Suspend",
  "Activate",
  "Deactivate",
  "Export",
  "Send",
];

export const SCOPES_LIST: ScopeType[] = [
  "Entire Platform",
  "State",
  "District",
  "City",
  "Partner",
  "Fleet",
  "Vehicle",
  "Driver",
  "User",
  "Ride",
];

export interface MockAdminSelectorOption {
  id: string;
  name: string;
  role: string;
}

export const MOCK_ADMIN_SELECT_OPTIONS: MockAdminSelectorOption[] = [
  { id: "ADM-100", name: "John Admin", role: "Regional Operations Lead" },
  { id: "ADM-101", name: "Marcus Wright", role: "Regional Admin (Berlin)" },
  { id: "ADM-102", name: "Sophia Martinez", role: "Compliance Officer" },
  { id: "ADM-103", name: "Greta Schmidt", role: "Fleet Manager (Munich)" },
];

export const MOCK_PERMISSION_RULES: AssignedPermissionRule[] = [
  {
    id: "RULE-101",
    adminId: "ADM-100",
    adminName: "John Admin",
    resource: "Vehicle",
    action: "View",
    scope: "Fleet",
    scopeValue: "Fleet A (Berlin Express)",
    lifetime: "Permanent",
    grantedDate: "2026-09-01",
  },
  {
    id: "RULE-102",
    adminId: "ADM-100",
    adminName: "John Admin",
    resource: "Driver",
    action: "Approve",
    scope: "City",
    scopeValue: "Berlin City Zone",
    lifetime: "Temporary",
    expiresAt: "2026-10-15 (16 days remaining)",
    grantedDate: "2026-09-15",
  },
  {
    id: "RULE-103",
    adminId: "ADM-101",
    adminName: "Marcus Wright",
    resource: "User",
    action: "Suspend",
    scope: "District",
    scopeValue: "Mitte District",
    lifetime: "Permanent",
    grantedDate: "2026-05-10",
  },
  {
    id: "RULE-104",
    adminId: "ADM-102",
    adminName: "Sophia Martinez",
    resource: "Partner",
    action: "Deactivate",
    scope: "Entire Platform",
    scopeValue: "Global Platform Scope",
    lifetime: "One-time",
    expiresAt: "Single Execution Allowance",
    grantedDate: "2026-09-28",
  },
];

export function getEffectiveSummary(rule: AssignedPermissionRule): string {
  const actionPast =
    rule.action === "View"
      ? "view"
      : rule.action.toLowerCase();

  const lifetimeText =
    rule.lifetime === "Permanent"
      ? "permanently"
      : rule.lifetime === "Temporary"
      ? `temporarily (${rule.expiresAt || "active window"})`
      : "for a single one-time execution";

  return `${rule.adminName} is granted ${rule.action.toUpperCase()}_${rule.resource.toUpperCase()} authorization to ${actionPast} ${rule.resource} resources scoped strictly to ${rule.scopeValue} (${rule.scope}), ${lifetimeText}.`;
}
