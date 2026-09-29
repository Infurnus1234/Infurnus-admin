export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    avatar: string;
  };
  role: "Super Admin" | "Regional Admin" | "Support Admin" | "Fleet Manager" | "System Worker";
  action: string;
  resource: "User" | "Driver" | "Vehicle" | "Ride" | "Fleet" | "Partner" | "Coupon" | "Notification" | "Payment" | "Admin Role";
  resourceId: string;
  approvalRequired: boolean;
  approvalStatus?: "Approved" | "Auto-Approved" | "Pending" | "Rejected" | "N/A";
  approver?: {
    name: string;
    role: string;
    approvedAt: string;
  };
  requestId?: string;
  result: "Success" | "Failed" | "Blocked" | "Pending Verification";
  securityContext: {
    ipAddress: string;
    location: string;
    device: string;
    mfaVerified: boolean;
    sessionId: string;
  };
  reason: string;
  previousState: Record<string, any>;
  newState: Record<string, any>;
}

export const MOCK_AUDIT_LOGS: AuditRecord[] = [
  {
    id: "AUD-90182",
    timestamp: "2026-09-29 20:45:12 UTC",
    actor: {
      name: "Eleanor Vance",
      email: "eleanor@infurnus.org",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    role: "Super Admin",
    action: "UPDATE_PERMISSIONS",
    resource: "Admin Role",
    resourceId: "ADM-8802 (Julian Thorne)",
    approvalRequired: true,
    approvalStatus: "Approved",
    approver: {
      name: "Security Committee (Auto-Sign)",
      role: "Super Admin Council",
      approvedAt: "2026-09-29 20:44:50 UTC"
    },
    requestId: "REQ-APP-7712",
    result: "Success",
    securityContext: {
      ipAddress: "103.21.124.90",
      location: "Bengaluru, IN (HW-VPN)",
      device: "macOS Sonoma / Chrome 128",
      mfaVerified: true,
      sessionId: "sess_8918239a0b12"
    },
    reason: "Granted emergency district escalation for Fleet Alpha monsoon dispatch monitoring.",
    previousState: {
      scope: "City: Bengaluru",
      permissions: ["VIEW_VEHICLES", "VIEW_DRIVERS"],
      maxRefundLimit: "₹5,000",
      mfaRequired: false
    },
    newState: {
      scope: "State: Karnataka (All Districts)",
      permissions: ["VIEW_VEHICLES", "VIEW_DRIVERS", "APPROVE_REFUNDS", "MANAGE_FLEETS"],
      maxRefundLimit: "₹50,000",
      mfaRequired: true
    }
  },
  {
    id: "AUD-90181",
    timestamp: "2026-09-29 19:12:04 UTC",
    actor: {
      name: "System Worker (Auto-Batch)",
      email: "system-cron@infurnus.internal",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150"
    },
    role: "System Worker",
    action: "DEACTIVATE_SUSPENDED_DRIVERS",
    resource: "Driver",
    resourceId: "DRV-1029 (Rajesh Kumar)",
    approvalRequired: false,
    approvalStatus: "Auto-Approved",
    result: "Success",
    securityContext: {
      ipAddress: "10.0.4.110 (Internal VPC)",
      location: "ap-south-1 (AWS Mumbai)",
      device: "Kubernetes Worker Node #14",
      mfaVerified: true,
      sessionId: "cron_job_dvr_clean_v4"
    },
    reason: "Automated 30-day compliance expiry trigger due to unsubmitted physical DL verification.",
    previousState: {
      status: "Suspended",
      complianceState: "Pending DL Review",
      canAcceptRides: false
    },
    newState: {
      status: "Deactivated",
      complianceState: "Expired non-compliant",
      canAcceptRides: false
    }
  },
  {
    id: "AUD-90180",
    timestamp: "2026-09-29 17:30:45 UTC",
    actor: {
      name: "Julian Thorne",
      email: "j.thorne@infurnus.org",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    role: "Regional Admin",
    action: "CREATE_COUPON",
    resource: "Coupon",
    resourceId: "CPN-FESTIVE50",
    approvalRequired: true,
    approvalStatus: "Approved",
    approver: {
      name: "Eleanor Vance",
      role: "Super Admin",
      approvedAt: "2026-09-29 17:28:00 UTC"
    },
    requestId: "REQ-APP-7705",
    result: "Success",
    securityContext: {
      ipAddress: "49.207.210.45",
      location: "Hyderabad, IN",
      device: "Windows 11 / Edge 128",
      mfaVerified: true,
      sessionId: "sess_7721831c890"
    },
    reason: "Created 50% festive promotional campaign capped at ₹150 for Dussehra week.",
    previousState: {
      code: "N/A",
      discountType: "None",
      isActive: false
    },
    newState: {
      code: "FESTIVE50",
      discountType: "50% Percentage (Cap ₹150)",
      maxTotalUses: 50000,
      perUserLimit: 3,
      isActive: true
    }
  },
  {
    id: "AUD-90179",
    timestamp: "2026-09-29 15:05:22 UTC",
    actor: {
      name: "Priya Sharma",
      email: "priya.s@infurnus.org",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    },
    role: "Support Admin",
    action: "ISSUE_DISPUTE_REFUND",
    resource: "Payment",
    resourceId: "PAY-REF-99201 (Ride #RD-98234)",
    approvalRequired: false,
    approvalStatus: "N/A",
    result: "Success",
    securityContext: {
      ipAddress: "103.110.89.12",
      location: "Delhi, IN",
      device: "macOS Air / Safari 17",
      mfaVerified: true,
      sessionId: "sess_44129038b91"
    },
    reason: "Refunded ₹340 route deviation penalty after verifying driver GPS detour logs.",
    previousState: {
      rideFare: "₹890.00",
      riderCharged: "₹890.00",
      walletCreditPending: "₹0.00",
      disputeStatus: "Under Investigation"
    },
    newState: {
      rideFare: "₹550.00",
      riderCharged: "₹550.00",
      walletCreditPending: "₹340.00 (Credited)",
      disputeStatus: "Resolved & Refunded"
    }
  },
  {
    id: "AUD-90178",
    timestamp: "2026-09-29 12:18:00 UTC",
    actor: {
      name: "Unknown IP / Rogue Client",
      email: "unauthorized_attempt@external.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    },
    role: "Regional Admin",
    action: "EXPORT_USER_DATABASE",
    resource: "User",
    resourceId: "GLOBAL_USERS_TABLE",
    approvalRequired: true,
    approvalStatus: "Rejected",
    requestId: "REQ-APP-7699",
    result: "Blocked",
    securityContext: {
      ipAddress: "185.220.101.4 (Tor Exit Node)",
      location: "Frankfurt, DE",
      device: "Python-urllib/3.11",
      mfaVerified: false,
      sessionId: "sess_INVALID_EXPIRED"
    },
    reason: "Blocked bulk PII export request due to unverified MFA token and blacklisted IP range.",
    previousState: {
      accessAttempt: "Denied",
      piiExposed: 0
    },
    newState: {
      accessAttempt: "Blocked & Flagged",
      securityAlertTriggered: true,
      ipBanned: true
    }
  }
];
