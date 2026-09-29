export interface DetailedDriver {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  emergencyContact: string;
  status: "Active" | "Suspended" | "Offline" | "On Trip";
  verificationStatus: "Verified" | "Pending Verification" | "Rejected";
  rating: number;
  completionRate: number;
  acceptanceRate: number;
  cancellationRate: number;

  // Assignment & Location
  vehicle: {
    model: string;
    plateNumber: string;
    type: "EV Sedan" | "Hybrid SUV" | "Standard Sedan" | "Luxury Van";
    inspectionExpiry: string;
  };
  fleet: {
    id: string;
    name: string;
    manager: string;
  };
  partner: {
    id: string;
    name: string;
    contractStatus: string;
  };
  location: {
    city: string;
    district: string;
    state: string;
    coordinates: string;
    lastPing: string;
  };

  // Profile & Verification Documents
  profile: {
    dob: string;
    licenseNumber: string;
    licenseExpiry: string;
    experienceYears: number;
    joinedDate: string;
  };
  documents: {
    id: string;
    type: string;
    number: string;
    expiryDate: string;
    status: "Verified" | "Pending" | "Expired";
    fileUrl?: string;
  }[];

  // Performance & Earnings
  earnings: {
    totalEarnings: string;
    weeklyEarnings: string;
    commissionPaid: string;
    tipsReceived: string;
  };

  // Detailed Lists
  rideHistory: {
    id: string;
    date: string;
    passenger: string;
    fare: string;
    ratingGiven: number;
    status: "Completed" | "Cancelled";
  }[];
  complaints: {
    id: string;
    date: string;
    complainant: string;
    subject: string;
    status: "Resolved" | "Investigating" | "Dismissed";
  }[];
  compliance: {
    backgroundCheck: "Passed" | "Pending";
    drugTest: "Passed" | "Pending";
    safetyCert: "Valid" | "Expired";
  };
  lifecycleHistory: {
    date: string;
    event: string;
    actor: string;
    notes: string;
  }[];
  auditLogs: {
    timestamp: string;
    action: string;
    performedBy: string;
    ipAddress: string;
  }[];
}

export const MOCK_DETAILED_DRIVERS: DetailedDriver[] = [
  {
    id: "DRV-1001",
    name: "Hans Gruber",
    email: "hans.gruber@infurnus.org",
    avatar: "HG",
    phone: "+49 152 8899 123",
    emergencyContact: "+49 152 9900 111 (Wife)",
    status: "On Trip",
    verificationStatus: "Verified",
    rating: 4.9,
    completionRate: 98.4,
    acceptanceRate: 96.5,
    cancellationRate: 1.2,
    vehicle: {
      model: "Tesla Model 3",
      plateNumber: "B-IN 4022",
      type: "EV Sedan",
      inspectionExpiry: "2027-04-15",
    },
    fleet: {
      id: "FLT-BER-01",
      name: "Berlin Express",
      manager: "Klaus Weber",
    },
    partner: {
      id: "PTR-ECO-09",
      name: "EcoMove Mobility",
      contractStatus: "Active Partner",
    },
    location: {
      city: "Berlin",
      district: "Mitte",
      state: "Berlin",
      coordinates: "52.5200° N, 13.4050° E",
      lastPing: "30 seconds ago",
    },
    profile: {
      dob: "1986-07-14",
      licenseNumber: "DL-DE-908124",
      licenseExpiry: "2029-11-30",
      experienceYears: 8,
      joinedDate: "2024-03-10",
    },
    documents: [
      { id: "DOC-101", type: "Driver License", number: "DL-DE-908124", expiryDate: "2029-11-30", status: "Verified" },
      { id: "DOC-102", type: "Police Clearance Certificate", number: "PCC-2025-901", expiryDate: "2026-12-31", status: "Verified" },
      { id: "DOC-103", type: "Vehicle Insurance", number: "INS-9088-BER", expiryDate: "2027-01-15", status: "Verified" },
      { id: "DOC-104", type: "Commercial Transport Permit", number: "CTP-8801", expiryDate: "2026-08-30", status: "Verified" },
    ],
    earnings: {
      totalEarnings: "€42,850.00",
      weeklyEarnings: "€1,240.50",
      commissionPaid: "€6,420.00",
      tipsReceived: "€410.00",
    },
    rideHistory: [
      { id: "RD-8801", date: "2026-09-29 19:15", passenger: "Eleanor Vance", fare: "€24.50", ratingGiven: 5, status: "Completed" },
      { id: "RD-8790", date: "2026-09-29 17:30", passenger: "Lukas Becker", fare: "€18.20", ratingGiven: 5, status: "Completed" },
    ],
    complaints: [],
    compliance: {
      backgroundCheck: "Passed",
      drugTest: "Passed",
      safetyCert: "Valid",
    },
    lifecycleHistory: [
      { date: "2024-03-10", event: "Driver Account Onboarded", actor: "System Onboarding", notes: "Documents verified successfully." },
      { date: "2025-01-12", event: "Vehicle Swapped to Tesla Model 3", actor: "Klaus Weber", notes: "Assigned EV fleet vehicle." },
    ],
    auditLogs: [
      { timestamp: "2026-09-29 14:00", action: "Updated License Verification Expiry", performedBy: "Eleanor Vance", ipAddress: "185.220.101.4" },
    ],
  },
  {
    id: "DRV-1002",
    name: "Stefan Meyer",
    email: "stefan.meyer@infurnus.org",
    avatar: "SM",
    phone: "+49 170 1234 567",
    emergencyContact: "+49 170 8877 665 (Father)",
    status: "Active",
    verificationStatus: "Verified",
    rating: 4.7,
    completionRate: 95.0,
    acceptanceRate: 92.1,
    cancellationRate: 2.5,
    vehicle: {
      model: "Toyota RAV4 Hybrid",
      plateNumber: "M-INF 8812",
      type: "Hybrid SUV",
      inspectionExpiry: "2026-11-20",
    },
    fleet: {
      id: "FLT-MUN-02",
      name: "Munich Fleet Alpha",
      manager: "Greta Schmidt",
    },
    partner: {
      id: "PTR-TRN-04",
      name: "TransCity GmbH",
      contractStatus: "Active Partner",
    },
    location: {
      city: "Munich",
      district: "Schwabing",
      state: "Bavaria",
      coordinates: "48.1371° N, 11.5754° E",
      lastPing: "5 mins ago",
    },
    profile: {
      dob: "1990-12-01",
      licenseNumber: "DL-DE-441209",
      licenseExpiry: "2028-05-15",
      experienceYears: 5,
      joinedDate: "2024-08-01",
    },
    documents: [
      { id: "DOC-201", type: "Driver License", number: "DL-DE-441209", expiryDate: "2028-05-15", status: "Verified" },
      { id: "DOC-202", type: "Police Clearance Certificate", number: "PCC-2025-412", expiryDate: "2026-10-10", status: "Verified" },
    ],
    earnings: {
      totalEarnings: "€28,400.00",
      weeklyEarnings: "€980.00",
      commissionPaid: "€4,260.00",
      tipsReceived: "€290.00",
    },
    rideHistory: [
      { id: "RD-8410", date: "2026-09-28 14:20", passenger: "Julian Thorne", fare: "€32.00", ratingGiven: 4, status: "Completed" },
    ],
    complaints: [
      { id: "CMP-12", date: "2026-08-14", complainant: "Passenger P-882", subject: "Cabin temperature was slightly cold", status: "Resolved" },
    ],
    compliance: {
      backgroundCheck: "Passed",
      drugTest: "Passed",
      safetyCert: "Valid",
    },
    lifecycleHistory: [
      { date: "2024-08-01", event: "Driver Account Approved", actor: "Greta Schmidt", notes: "TransCity partnership onboard." },
    ],
    auditLogs: [],
  },
  {
    id: "DRV-1003",
    name: "Astrid Lindgren",
    email: "astrid.l@infurnus.org",
    avatar: "AL",
    phone: "+49 175 3322 110",
    emergencyContact: "+49 175 6655 443 (Partner)",
    status: "Suspended",
    verificationStatus: "Pending Verification",
    rating: 3.8,
    completionRate: 84.0,
    acceptanceRate: 78.0,
    cancellationRate: 8.5,
    vehicle: {
      model: "Volkswagen Passat",
      plateNumber: "HH-IN 102",
      type: "Standard Sedan",
      inspectionExpiry: "2026-06-01",
    },
    fleet: {
      id: "FLT-HAM-03",
      name: "Nordic Trans",
      manager: "Erik Lind",
    },
    partner: {
      id: "PTR-URB-01",
      name: "UrbanFleet Systems",
      contractStatus: "Under Review",
    },
    location: {
      city: "Hamburg",
      district: "Altona",
      state: "Hamburg",
      coordinates: "53.5511° N, 9.9937° E",
      lastPing: "2 days ago",
    },
    profile: {
      dob: "1994-03-22",
      licenseNumber: "DL-DE-778210",
      licenseExpiry: "2026-07-01",
      experienceYears: 3,
      joinedDate: "2025-02-14",
    },
    documents: [
      { id: "DOC-301", type: "Driver License", number: "DL-DE-778210", expiryDate: "2026-07-01", status: "Pending" },
      { id: "DOC-302", type: "Vehicle Inspection Certificate", number: "VIC-2024-11", expiryDate: "2026-06-01", status: "Expired" },
    ],
    earnings: {
      totalEarnings: "€11,200.00",
      weeklyEarnings: "€0.00",
      commissionPaid: "€1,680.00",
      tipsReceived: "€85.00",
    },
    rideHistory: [],
    complaints: [
      { id: "CMP-44", date: "2026-09-02", complainant: "System Audit Bot", subject: "Excessive ride cancellation rate (>8%)", status: "Investigating" },
    ],
    compliance: {
      backgroundCheck: "Passed",
      drugTest: "Pending",
      safetyCert: "Expired",
    },
    lifecycleHistory: [
      { date: "2026-09-03", event: "Driver Suspended", actor: "System Security Bot", notes: "Suspended due to expired inspection and cancellation rate." },
    ],
    auditLogs: [
      { timestamp: "2026-09-03 10:15", action: "Flagged Account Suspension", performedBy: "Security Center", ipAddress: "127.0.0.1" },
    ],
  },
];
