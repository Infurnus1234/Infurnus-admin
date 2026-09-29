export type ApprovalCategory =
  | "Driver"
  | "Admin"
  | "Permission"
  | "Vehicle"
  | "Coupon"
  | "Financial"
  | "Refund"
  | "System Configuration";

export type ApprovalStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Changes Requested"
  | "Expired";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface CentralizedApprovalTicket {
  id: string;
  type: string;
  category: ApprovalCategory;
  requester: {
    name: string;
    role: string;
    avatar?: string;
  };
  resource: string;
  createdAt: string;
  status: ApprovalStatus;
  riskLevel: RiskLevel;
  requiredApproval: string;

  // Detail View Fields
  summary: string;
  currentState: string;
  requestedChange: string;
  reason: string;
  previousState: Record<string, string>;
  proposedState: Record<string, string>;
  approvalHistory: {
    date: string;
    actor: string;
    action: string;
    notes: string;
  }[];
  auditPreview: {
    ruleCode: string;
    riskCheck: string;
    compliancePolicy: string;
  };
}

export const MOCK_APPROVAL_TICKETS: CentralizedApprovalTicket[] = [
  {
    id: "APP-CENT-101",
    type: "DRIVER_DELETION_APPROVAL",
    category: "Driver",
    requester: { name: "Sophia Martinez", role: "Compliance Officer", avatar: "SM" },
    resource: "Driver #DRV-1003 (Astrid Lindgren)",
    createdAt: "2026-09-29 18:20",
    status: "Pending",
    riskLevel: "High",
    requiredApproval: "Super Admin Root",
    summary: "Right-to-be-forgotten driver deletion following license expiration & cancellation rate threshold breach.",
    currentState: "Suspended (Pending Deletion)",
    requestedChange: "Permanent Account Deactivation & GDPR Scrub",
    reason: "Driver compliance file expired on 2026-07-01 and cancellation rate exceeded 8.5%.",
    previousState: {
      "Account Status": "Suspended",
      "License Validity": "Expired (2026-07-01)",
      "Cancellation Rate": "8.5%",
    },
    proposedState: {
      "Account Status": "Deactivated",
      "License Validity": "Archived",
      "PII Scrub": "Scheduled for 24h",
    },
    approvalHistory: [
      { date: "2026-09-29 18:20", actor: "Sophia Martinez", action: "Ticket Created", notes: "Submitted for Super Admin review." },
    ],
    auditPreview: {
      ruleCode: "COMPLIANCE_GDPR_DEL_09",
      riskCheck: "HIGH_RISK_DELETION_CHECK_PASSED",
      compliancePolicy: "EU Regulation 2016/679 Article 17",
    },
  },
  {
    id: "APP-CENT-102",
    type: "ROLE_ELEVATION_APPROVAL",
    category: "Admin",
    requester: { name: "Marcus Wright", role: "Regional Admin", avatar: "MW" },
    resource: "Admin Account #ADM-100 (John Admin)",
    createdAt: "2026-09-29 14:10",
    status: "Pending",
    riskLevel: "Medium",
    requiredApproval: "Compliance Board",
    summary: "Grant temporary MANAGE_PARTNERS permission scope to John Admin for 30 days.",
    currentState: "Regional Admin (Fleet A)",
    requestedChange: "Add Temporary MANAGE_PARTNERS Scope",
    reason: "Required to facilitate Berlin EcoMove partner contract extension negotiations.",
    previousState: {
      "Permission Scopes": "VIEW_VEHICLES, VIEW_DRIVERS, VIEW_RIDES, VIEW_REPORTS",
      "Partner Access": "None",
    },
    proposedState: {
      "Permission Scopes": "VIEW_VEHICLES, VIEW_DRIVERS, VIEW_RIDES, VIEW_REPORTS, MANAGE_PARTNERS",
      "Partner Access": "EcoMove Mobility (30d Temporary)",
    },
    approvalHistory: [
      { date: "2026-09-29 14:10", actor: "Marcus Wright", action: "Ticket Created", notes: "Requested partner elevation." },
    ],
    auditPreview: {
      ruleCode: "ROLE_ELEVATION_TEMP_04",
      riskCheck: "MEDIUM_RISK_ROLE_CHECK_PASSED",
      compliancePolicy: "Infurnus Internal Audit Standard v3",
    },
  },
  {
    id: "APP-CENT-103",
    type: "BULK_REFUND_APPROVAL",
    category: "Refund",
    requester: { name: "David Chen", role: "Support Lead", avatar: "DC" },
    resource: "Passenger Group #REF-9081 (Berlin Dispatch Delay)",
    createdAt: "2026-09-28 22:45",
    status: "Approved",
    riskLevel: "Low",
    requiredApproval: "Single Admin",
    summary: "Issued 15% automatic refund coupons to 42 passengers affected by server dispatch latency.",
    currentState: "Standard Charge (€14.50 avg)",
    requestedChange: "Apply €2.15 Credit Refund per Account",
    reason: "System dispatch latency on 2026-09-28 between 21:00-22:00 in Berlin Mitte.",
    previousState: {
      "Charge Status": "Fully Paid",
      "Dispute Status": "Open",
    },
    proposedState: {
      "Charge Status": "Partial Refund Issued",
      "Dispute Status": "Resolved",
    },
    approvalHistory: [
      { date: "2026-09-28 22:45", actor: "David Chen", action: "Ticket Created", notes: "Submitted support refund batch." },
      { date: "2026-09-29 08:30", actor: "Eleanor Vance", action: "Approved Ticket", notes: "Approved refund disbursement." },
    ],
    auditPreview: {
      ruleCode: "SUPPORT_REFUND_BATCH_12",
      riskCheck: "LOW_RISK_REFUND_CHECK_PASSED",
      compliancePolicy: "Customer SLA Guarantee Policy",
    },
  },
  {
    id: "APP-CENT-104",
    type: "SYSTEM_CONFIG_CHANGE",
    category: "System Configuration",
    requester: { name: "Eleanor Vance", role: "Super Admin", avatar: "EV" },
    resource: "Global Dispatch Rate Limiter",
    createdAt: "2026-09-27 11:00",
    status: "Approved",
    riskLevel: "Critical",
    requiredApproval: "Super Admin Root",
    summary: "Update global dispatch rate limit from 500 req/sec to 800 req/sec to support weekend surge.",
    currentState: "500 Dispatches / Second",
    requestedChange: "800 Dispatches / Second",
    reason: "Anticipated surge in Berlin & Munich weekend ride dispatches.",
    previousState: {
      "Rate Limit": "500 req/sec",
      "Concurrency Cap": "12,000 active sockets",
    },
    proposedState: {
      "Rate Limit": "800 req/sec",
      "Concurrency Cap": "20,000 active sockets",
    },
    approvalHistory: [
      { date: "2026-09-27 11:00", actor: "Eleanor Vance", action: "Approved & Executed", notes: "Root execution completed." },
    ],
    auditPreview: {
      ruleCode: "SYS_CONFIG_RATE_LIMIT_01",
      riskCheck: "CRITICAL_SYSTEM_CHANGE_PASSED",
      compliancePolicy: "Infrastructure Policy v4.1",
    },
  },
];
