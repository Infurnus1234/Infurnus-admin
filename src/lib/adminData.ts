export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "System Admin" | "Regional Admin" | "Compliance Officer" | "Support Lead";
  status: "Active" | "Suspended" | "Deactivated";
  scope: string;
  permissions: string[];
  assignedResources: string[];
  lastActive: string;
  createdDate: string;

  // Detail Fields
  overview: {
    department: string;
    mfaEnabled: boolean;
    ipRestriction: string;
  };
  activityLogs: {
    timestamp: string;
    action: string;
    targetResource: string;
    status: string;
  }[];
  requestsSubmitted: {
    id: string;
    type: string;
    date: string;
    status: string;
  }[];
  approvalHistory: {
    id: string;
    action: string;
    decidedDate: string;
    decision: string;
  }[];
  securityEvents: {
    id: string;
    event: string;
    timestamp: string;
    severity: "Low" | "Medium" | "High";
  }[];
}

export const ALL_AVAILABLE_PERMISSIONS = [
  "VIEW_DASHBOARD",
  "MANAGE_USERS",
  "MANAGE_DRIVERS",
  "APPROVE_DRIVER_REQUESTS",
  "MANAGE_VEHICLES",
  "MANAGE_FLEETS",
  "MANAGE_PARTNERS",
  "VIEW_REPORTS",
  "MANAGE_ROLES",
  "AUDIT_LOGS_ACCESS",
  "SECURITY_CENTER_ACCESS",
];

export const MOCK_ADMIN_RECORDS: AdminUserRecord[] = [
  {
    id: "ADM-101",
    name: "Marcus Wright",
    email: "marcus.w@infurnus.org",
    avatar: "MW",
    role: "Regional Admin",
    status: "Active",
    scope: "Berlin & Brandenburg Region",
    permissions: [
      "VIEW_DASHBOARD",
      "MANAGE_USERS",
      "MANAGE_DRIVERS",
      "APPROVE_DRIVER_REQUESTS",
      "MANAGE_VEHICLES",
      "MANAGE_FLEETS",
    ],
    assignedResources: ["Berlin Express Fleet", "Mitte Driver Pool", "Berlin User Directory"],
    lastActive: "12 mins ago",
    createdDate: "2024-05-10",
    overview: {
      department: "Regional Operations",
      mfaEnabled: true,
      ipRestriction: "185.220.101.*",
    },
    activityLogs: [
      { timestamp: "2026-09-29 14:20", action: "Approved Vehicle Registration B-IN 4022", targetResource: "VEH-901", status: "Success" },
      { timestamp: "2026-09-28 10:15", action: "Assigned Driver Hans Gruber to Fleet", targetResource: "DRV-1001", status: "Success" },
    ],
    requestsSubmitted: [
      { id: "REQ-A-901", type: "Scope Extension to Potsdam", date: "2026-09-10", status: "Approved" },
    ],
    approvalHistory: [
      { id: "APP-88", action: "Driver Addition Request #REQ-D-1090", decidedDate: "2026-09-29", decision: "Approved" },
    ],
    securityEvents: [
      { id: "SEC-101", event: "Successful MFA Authentication", timestamp: "2026-09-29 09:00", severity: "Low" },
    ],
  },
  {
    id: "ADM-102",
    name: "Sophia Martinez",
    email: "sophia.m@infurnus.org",
    avatar: "SM",
    role: "Compliance Officer",
    status: "Active",
    scope: "Global Compliance & Security",
    permissions: [
      "VIEW_DASHBOARD",
      "MANAGE_USERS",
      "MANAGE_DRIVERS",
      "AUDIT_LOGS_ACCESS",
      "SECURITY_CENTER_ACCESS",
    ],
    assignedResources: ["Global Audit Logs", "Right-to-be-Forgotten Queue", "GDPR Compliance Matrix"],
    lastActive: "45 mins ago",
    createdDate: "2024-01-15",
    overview: {
      department: "Legal & Regulatory Compliance",
      mfaEnabled: true,
      ipRestriction: "All Subnets (Enforced VPN)",
    },
    activityLogs: [
      { timestamp: "2026-09-28 09:15", action: "Submitted Driver Deletion Request #REQ-D-1088", targetResource: "DRV-1003", status: "Under Review" },
    ],
    requestsSubmitted: [],
    approvalHistory: [],
    securityEvents: [],
  },
  {
    id: "ADM-103",
    name: "Greta Schmidt",
    email: "greta.s@infurnus.org",
    avatar: "GS",
    role: "Regional Admin",
    status: "Suspended",
    scope: "Munich & Bavaria Scope",
    permissions: [
      "VIEW_DASHBOARD",
      "MANAGE_DRIVERS",
      "MANAGE_VEHICLES",
      "MANAGE_FLEETS",
    ],
    assignedResources: ["Munich Fleet Alpha", "Schwabing Vehicles"],
    lastActive: "3 days ago",
    createdDate: "2024-08-01",
    overview: {
      department: "Bavarian Logistics",
      mfaEnabled: false,
      ipRestriction: "None",
    },
    activityLogs: [],
    requestsSubmitted: [],
    approvalHistory: [],
    securityEvents: [
      { id: "SEC-402", event: "Multiple Failed Login Attempts (3x)", timestamp: "2026-09-26 22:14", severity: "High" },
    ],
  },
];
