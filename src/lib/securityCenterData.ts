export interface SecurityEvent {
  id: string;
  event: string;
  eventType: "Login Activity" | "Permission Changes" | "Role Changes" | "Admin Events" | "Critical Configuration Changes" | "Suspicious Events";
  actor: {
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
  severity: "Low" | "Medium" | "High" | "Critical";
  ipAddress: string;
  location: string;
  timestamp: string;
  status: "Open" | "Investigating" | "Mitigated" | "Resolved" | "False Positive";
  device: string;
  mfaMethod: string;
  summary: string;
  rawPayload?: Record<string, any>;
}

export interface ActiveSession {
  id: string;
  adminName: string;
  adminEmail: string;
  role: string;
  ipAddress: string;
  location: string;
  device: string;
  loginTime: string;
  lastActive: string;
  mfaVerified: boolean;
}

export const MOCK_SECURITY_DATA = {
  stats: {
    failedLogins: 42,
    suspiciousEvents: 5,
    activeSessions: 18,
    permissionChanges: 14,
    roleChanges: 3,
    criticalEvents: 2
  },
  activeSessions: [
    {
      id: "sess_991823",
      adminName: "Eleanor Vance",
      adminEmail: "eleanor@infurnus.org",
      role: "Super Admin",
      ipAddress: "103.21.124.90",
      location: "Bengaluru, India",
      device: "macOS Sonoma / Chrome 128",
      loginTime: "2026-09-29 08:30",
      lastActive: "Just now",
      mfaVerified: true
    },
    {
      id: "sess_991824",
      adminName: "Julian Thorne",
      adminEmail: "j.thorne@infurnus.org",
      role: "Regional Admin",
      ipAddress: "49.207.210.45",
      location: "Hyderabad, India",
      device: "Windows 11 / Edge 128",
      loginTime: "2026-09-29 11:15",
      lastActive: "3 mins ago",
      mfaVerified: true
    },
    {
      id: "sess_991825",
      adminName: "Priya Sharma",
      adminEmail: "priya.s@infurnus.org",
      role: "Support Admin",
      ipAddress: "103.110.89.12",
      location: "Delhi, India",
      device: "macOS Air / Safari 17",
      loginTime: "2026-09-29 14:00",
      lastActive: "12 mins ago",
      mfaVerified: true
    }
  ] as ActiveSession[],
  securityEvents: [
    {
      id: "SEC-4091",
      event: "Multiple Failed Login Attempts (Brute Force Pattern)",
      eventType: "Login Activity",
      actor: {
        name: "Unknown / External IP",
        email: "admin_attempt@unknown.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        role: "Unauthenticated"
      },
      severity: "Critical",
      ipAddress: "185.220.101.4",
      location: "Frankfurt, Germany (Tor Network)",
      timestamp: "2026-09-29 20:15:33",
      status: "Investigating",
      device: "Python-requests/2.31.0",
      mfaMethod: "Failed MFA Challenge",
      summary: "18 invalid password attempts within 45 seconds targeting super-admin endpoint. IP automatically throttled by rate limiter.",
      rawPayload: {
        targetEndpoint: "/api/v1/auth/super-admin/login",
        attemptCount: 18,
        timeWindowSec: 45,
        firewallRuleTriggered: "RULE_BRUTE_FORCE_BAN_1001"
      }
    },
    {
      id: "SEC-4092",
      event: "Super Admin Role Escalation Granted",
      eventType: "Role Changes",
      actor: {
        name: "Eleanor Vance",
        email: "eleanor@infurnus.org",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        role: "Super Admin"
      },
      severity: "High",
      ipAddress: "103.21.124.90",
      location: "Bengaluru, India",
      timestamp: "2026-09-29 19:40:12",
      status: "Resolved",
      device: "macOS Sonoma / Chrome 128",
      mfaMethod: "Hardware Security Key (FIDO2)",
      summary: "Role for admin 'Rajesh Mehta' was updated from 'Regional Support' to 'Finance Super Admin' following multi-sig approval REQ-7712.",
      rawPayload: {
        targetAdminId: "ADM-7710",
        previousRole: "Regional Support",
        newRole: "Finance Super Admin",
        approvalTicketId: "REQ-7712"
      }
    },
    {
      id: "SEC-4093",
      event: "Critical Payment Gateway Secret Key Rotated",
      eventType: "Critical Configuration Changes",
      actor: {
        name: "System Security Bot",
        email: "sec-ops@infurnus.internal",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
        role: "System Automated"
      },
      severity: "Medium",
      ipAddress: "10.0.2.14 (VPC Private)",
      location: "AWS Mumbai (ap-south-1)",
      timestamp: "2026-09-29 18:00:00",
      status: "Mitigated",
      device: "AWS KMS Vault Cron",
      mfaMethod: "IAM Role Token",
      summary: "Scheduled 90-day automated secret rotation completed for Razorpay & Cashfree API production credentials.",
      rawPayload: {
        keyType: "PRODUCTION_PAYMENT_SECRET",
        vaultPath: "/config/production/gateways",
        rotationCycleDays: 90
      }
    },
    {
      id: "SEC-4094",
      event: "Bulk Permission Scope Modification",
      eventType: "Permission Changes",
      actor: {
        name: "Julian Thorne",
        email: "j.thorne@infurnus.org",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        role: "Regional Admin"
      },
      severity: "Low",
      ipAddress: "49.207.210.45",
      location: "Hyderabad, India",
      timestamp: "2026-09-29 16:30:10",
      status: "Resolved",
      device: "Windows 11 / Edge 128",
      mfaMethod: "TOTP Authenticator",
      summary: "Added READ_TELEMETRY scope for Fleet Alpha vehicles to 4 junior dispatch coordinators.",
      rawPayload: {
        modifiedUsersCount: 4,
        addedScope: "Fleet: Fleet Alpha Cabs"
      }
    },
    {
      id: "SEC-4095",
      event: "Unrecognized Device Login Detected",
      eventType: "Suspicious Events",
      actor: {
        name: "Priya Sharma",
        email: "priya.s@infurnus.org",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        role: "Support Admin"
      },
      severity: "High",
      ipAddress: "182.73.19.4",
      location: "Chennai, India",
      timestamp: "2026-09-29 12:10:04",
      status: "False Positive",
      device: "Linux Ubuntu / Firefox 129",
      mfaMethod: "SMS OTP Prompted",
      summary: "Login attempt from new Linux machine in Chennai. Admin verified identity via secondary MFA challenge.",
      rawPayload: {
        deviceFingerprint: "fp_linux_ubuntu_ff129_091a",
        challengeResult: "VERIFIED_SUCCESS"
      }
    }
  ] as SecurityEvent[]
};
