export interface SupportTicket {
  id: string;
  requester: {
    name: string;
    email: string;
    avatar: string;
    role: "User" | "Driver" | "Partner";
    phone: string;
  };
  category: "User Complaints" | "Driver Complaints" | "Partner Complaints" | "Ride Disputes" | "Support Tickets" | "Escalations";
  subject: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Pending Action" | "Resolved" | "Closed" | "Escalated";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  relatedRideId?: string;
  relatedEntity?: {
    type: "User" | "Driver" | "Partner" | "Vehicle";
    id: string;
    name: string;
  };
  issueDescription: string;
  conversation: {
    id: string;
    sender: string;
    senderRole: "User" | "Driver" | "Partner" | "Support Agent" | "Super Admin";
    timestamp: string;
    message: string;
    attachments?: string[];
  }[];
  activityLog: {
    id: string;
    action: string;
    performer: string;
    timestamp: string;
    notes?: string;
  }[];
  resolution?: {
    resolvedBy: string;
    resolvedAt: string;
    summary: string;
    refundAmount?: string;
    satisfactionScore?: number;
  };
}

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "TCK-8921",
    requester: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "User",
      phone: "+91 98765 43210"
    },
    category: "Ride Disputes",
    subject: "Incorrect fare charged due to longer route taken by driver",
    priority: "High",
    status: "In Progress",
    assignedTo: "Priya Sharma (Senior Support)",
    createdAt: "2026-09-29 14:30",
    updatedAt: "2026-09-29 16:15",
    relatedRideId: "RD-98234",
    relatedEntity: {
      type: "Driver",
      id: "DRV-1029",
      name: "Rajesh Kumar"
    },
    issueDescription: "Rider claims driver took a 6km detour without approval, resulting in an additional ₹340 surge and route deviation penalty. GPS logs show traffic rerouting.",
    conversation: [
      {
        id: "m-1",
        sender: "Aarav Sharma",
        senderRole: "User",
        timestamp: "2026-09-29 14:30",
        message: "Hi, I was charged ₹890 for ride RD-98234 instead of the estimated ₹550. The driver took a long detour through Ring Road."
      },
      {
        id: "m-2",
        sender: "Priya Sharma",
        senderRole: "Support Agent",
        timestamp: "2026-09-29 14:45",
        message: "Hello Aarav, I am looking into your trip telemetry right now. Please allow me a few minutes to check the route map and driver response."
      },
      {
        id: "m-3",
        sender: "Rajesh Kumar",
        senderRole: "Driver",
        timestamp: "2026-09-29 15:10",
        message: "Main road was blocked due to Metro construction work near Signal 4. I informed rider before taking detour."
      }
    ],
    activityLog: [
      {
        id: "a-1",
        action: "Ticket Created",
        performer: "Aarav Sharma",
        timestamp: "2026-09-29 14:30",
        notes: "Created via Mobile App Support form"
      },
      {
        id: "a-2",
        action: "Assigned Agent",
        performer: "System Auto-Router",
        timestamp: "2026-09-29 14:31",
        notes: "Assigned to Priya Sharma based on Ride Dispute queue"
      },
      {
        id: "a-3",
        action: "Telemetry Requested",
        performer: "Priya Sharma",
        timestamp: "2026-09-29 14:46",
        notes: "Fetched GPS breadcrumbs for RD-98234"
      }
    ]
  },
  {
    id: "TCK-8922",
    requester: {
      name: "Vikramaditya Transport",
      email: "fleet@vikramaditya.com",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
      role: "Partner",
      phone: "+91 99887 76655"
    },
    category: "Partner Complaints",
    subject: "Weekly payout discrepancy for Fleet Alpha EV vehicles",
    priority: "Critical",
    status: "Escalated",
    assignedTo: "Rajesh Mehta (Finance Admin)",
    createdAt: "2026-09-28 09:15",
    updatedAt: "2026-09-29 11:20",
    relatedEntity: {
      type: "Partner",
      id: "PRT-501",
      name: "Vikramaditya Transport"
    },
    issueDescription: "Partner reports that week 39 payout of ₹4,50,000 did not credit the promised 5% EV incentive bonus of ₹22,500.",
    conversation: [
      {
        id: "m-10",
        sender: "Vikramaditya Transport",
        senderRole: "Partner",
        timestamp: "2026-09-28 09:15",
        message: "Our payout statement #INF-W39 is missing the EV fleet incentive bonus. We operated 42 active EV cabs last week."
      },
      {
        id: "m-11",
        sender: "Rajesh Mehta",
        senderRole: "Super Admin",
        timestamp: "2026-09-28 11:00",
        message: "Escalated to Finance Audit team to re-verify the incentive rule batch execution for Week 39."
      }
    ],
    activityLog: [
      {
        id: "a-10",
        action: "Ticket Escalated",
        performer: "Priya Sharma",
        timestamp: "2026-09-28 10:30",
        notes: "Priority upgraded to Critical and escalated to Finance Tier 2"
      }
    ]
  },
  {
    id: "TCK-8923",
    requester: {
      name: "Sunita Verma",
      email: "sunita.v@example.com",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      role: "Driver",
      phone: "+91 91234 56789"
    },
    category: "Driver Complaints",
    subject: "KYC verification pending for over 72 hours",
    priority: "Medium",
    status: "Pending Action",
    assignedTo: "Verification Desk",
    createdAt: "2026-09-27 18:00",
    updatedAt: "2026-09-29 10:00",
    relatedEntity: {
      type: "Driver",
      id: "DRV-304",
      name: "Sunita Verma"
    },
    issueDescription: "Driver re-uploaded Driving License after initial blur rejection. Awaiting manual review.",
    conversation: [
      {
        id: "m-20",
        sender: "Sunita Verma",
        senderRole: "Driver",
        timestamp: "2026-09-27 18:00",
        message: "I uploaded the clear HD scan of DL on Tuesday. When will my account be activated?"
      }
    ],
    activityLog: [
      {
        id: "a-20",
        action: "Document Re-submitted",
        performer: "Sunita Verma",
        timestamp: "2026-09-27 17:55",
        notes: "DL_Clear_Scan_v2.pdf"
      }
    ]
  },
  {
    id: "TCK-8924",
    requester: {
      name: "Rohan Kapoor",
      email: "rohan.k@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "User",
      phone: "+91 97654 32109"
    },
    category: "Escalations",
    subject: "Lost Item: iPhone 15 Pro left in vehicle KA-03-EQ-9988",
    priority: "Critical",
    status: "Open",
    assignedTo: "Safety Desk",
    createdAt: "2026-09-29 17:00",
    updatedAt: "2026-09-29 17:05",
    relatedRideId: "RD-99012",
    relatedEntity: {
      type: "Vehicle",
      id: "V-201",
      name: "KA-03-EQ-9988"
    },
    issueDescription: "Rider forgot mobile phone in rear seat. Driver phone is temporarily unreachable. Urgent safety ticket.",
    conversation: [
      {
        id: "m-30",
        sender: "Rohan Kapoor",
        senderRole: "User",
        timestamp: "2026-09-29 17:00",
        message: "I left my blue iPhone 15 Pro in the back seat when dropped at Terminal 2. Please contact driver Ramesh!"
      }
    ],
    activityLog: [
      {
        id: "a-30",
        action: "Urgent Safety Dispatch",
        performer: "System Auto-Trigger",
        timestamp: "2026-09-29 17:01",
        notes: "SMS dispatched to driver backup number"
      }
    ]
  },
  {
    id: "TCK-8925",
    requester: {
      name: "Meera Patel",
      email: "meera.p@example.com",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      role: "User",
      phone: "+91 94321 87654"
    },
    category: "Support Tickets",
    subject: "Coupon FESTIVE50 failed to apply during payment gateway redirect",
    priority: "Low",
    status: "Resolved",
    assignedTo: "Coupon Operations",
    createdAt: "2026-09-25 12:00",
    updatedAt: "2026-09-26 10:30",
    relatedRideId: "RD-95110",
    issueDescription: "Discount of ₹150 was not applied due to gateway timeout during checkout.",
    conversation: [
      {
        id: "m-40",
        sender: "Meera Patel",
        senderRole: "User",
        timestamp: "2026-09-25 12:00",
        message: "Promo code FESTIVE50 threw gateway error."
      },
      {
        id: "m-41",
        sender: "Coupon Operations",
        senderRole: "Support Agent",
        timestamp: "2026-09-26 10:30",
        message: "We have credited ₹150 directly to your Infurnus Wallet. Ticket closed."
      }
    ],
    activityLog: [],
    resolution: {
      resolvedBy: "Ananya Iyer",
      resolvedAt: "2026-09-26 10:30",
      summary: "Credited ₹150 wallet cashback for failed promo apply.",
      refundAmount: "₹150.00",
      satisfactionScore: 5
    }
  }
];

export const MOCK_REPORTS_DATA = {
  userAnalytics: {
    totalUsers: "482,910",
    activeUsersMonthly: "318,450",
    retentionRate: "78.4%",
    avgRidesPerUser: "4.8 / mo",
    registrationsTimeline: [
      { label: "May", value: 24500 },
      { label: "Jun", value: 31200 },
      { label: "Jul", value: 38900 },
      { label: "Aug", value: 45600 },
      { label: "Sep", value: 52300 }
    ],
    activeUsersTrend: [
      { label: "Week 1", value: 180000 },
      { label: "Week 2", value: 210000 },
      { label: "Week 3", value: 245000 },
      { label: "Week 4", value: 318450 }
    ]
  },
  driverAnalytics: {
    totalDrivers: "18,420",
    activeDriversOnline: "12,850",
    avgOnlineHours: "7.6 hrs/day",
    driverTurnover: "3.2%",
    driverCountTrend: [
      { label: "May", value: 12100 },
      { label: "Jun", value: 13800 },
      { label: "Jul", value: 15400 },
      { label: "Aug", value: 17100 },
      { label: "Sep", value: 18420 }
    ],
    driverActivityBreakdown: [
      { label: "On Ride (Peak)", value: 68 },
      { label: "Idle / Searching", value: 22 },
      { label: "Break / Offline", value: 10 }
    ]
  },
  vehicleAnalytics: {
    totalVehicles: "19,850",
    evPercentage: "34.5%",
    utilizationRate: "84.2%",
    avgMaintenanceCost: "₹2,450 / mo",
    vehicleUtilizationTrend: [
      { label: "Mon", value: 81 },
      { label: "Tue", value: 83 },
      { label: "Wed", value: 86 },
      { label: "Thu", value: 84 },
      { label: "Fri", value: 92 },
      { label: "Sat", value: 95 },
      { label: "Sun", value: 88 }
    ]
  },
  rideAnalytics: {
    totalRides: "1,845,200",
    completionRate: "94.8%",
    cancellationRate: "5.2%",
    avgRideDistance: "9.4 km",
    rideVolumeTrend: [
      { label: "May", value: 280000 },
      { label: "Jun", value: 340000 },
      { label: "Jul", value: 410000 },
      { label: "Aug", value: 490000 },
      { label: "Sep", value: 560000 }
    ],
    completionVsCancellation: [
      { label: "Completed", value: 94.8 },
      { label: "User Cancelled", value: 3.4 },
      { label: "Driver Cancelled", value: 1.8 }
    ]
  },
  businessAnalytics: {
    grossMerchandiseValue: "₹42.8 Cr",
    netRevenue: "₹8.56 Cr",
    avgOrderValue: "₹345",
    couponSpend: "₹45.2 L",
    revenueTrend: [
      { label: "Q1", value: 18.2 },
      { label: "Q2", value: 24.5 },
      { label: "Q3", value: 32.8 },
      { label: "Q4 (Proj)", value: 42.8 }
    ],
    couponPerformance: [
      { label: "FESTIVE50", value: 14200 },
      { label: "EVGREEN20", value: 9800 },
      { label: "FIRSTINFURNUS", value: 24500 },
      { label: "CORPPERK10", value: 6300 }
    ]
  },
  administrativeAnalytics: {
    totalAdmins: "48",
    activePermissionChanges: "142 / mo",
    approvalsProcessed: "984",
    securityIncidents: "0 Critical",
    adminActivityTrend: [
      { label: "Mon", value: 140 },
      { label: "Tue", value: 190 },
      { label: "Wed", value: 230 },
      { label: "Thu", value: 210 },
      { label: "Fri", value: 260 },
      { label: "Sat", value: 80 },
      { label: "Sun", value: 40 }
    ],
    approvalActivityBreakdown: [
      { label: "Driver KYC", value: 450 },
      { label: "Vehicle Onboarding", value: 280 },
      { label: "Refund Requests", value: 154 },
      { label: "Role Changes", value: 100 }
    ],
    securityActivity: [
      { label: "MFA Logins", value: 98.4 },
      { label: "IP Whitelist Checks", value: 99.9 },
      { label: "Permission Edits", value: 142 },
      { label: "Failed Auth Attempts", value: 12 }
    ]
  }
};
