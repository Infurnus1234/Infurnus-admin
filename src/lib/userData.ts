export interface DetailedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  emergencyContact: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  addressLine: string;
  registrationDate: string;
  totalRides: number;
  paymentStatus: "Good Standing" | "Pending Verification" | "Payment Overdue";
  accountStatus: "Active" | "Suspended" | "Deactivated";
  lastActive: string;
  
  // Detailed Drawer Data
  profile: {
    dob: string;
    gender: string;
    preferredLanguage: string;
    kycStatus: "Verified" | "Pending" | "Unverified";
  };
  rideHistory: {
    id: string;
    date: string;
    pickup: string;
    dropoff: string;
    fare: string;
    status: "Completed" | "Cancelled";
  }[];
  paymentHistory: {
    id: string;
    date: string;
    amount: string;
    method: string;
    status: "Paid" | "Refunded" | "Failed";
  }[];
  couponUsage: {
    code: string;
    discount: string;
    usedOn: string;
  }[];
  complaints: {
    id: string;
    subject: string;
    date: string;
    status: "Resolved" | "Open" | "Escalated";
  }[];
  loginSessions: {
    device: string;
    ip: string;
    location: string;
    lastActive: string;
  }[];
}

export const MOCK_DETAILED_USERS: DetailedUser[] = [
  {
    id: "USR-8901",
    name: "Eleanor Vance",
    email: "eleanor.vance@infurnus.org",
    avatar: "EV",
    phone: "+49 151 2345 6789",
    emergencyContact: "+49 151 9876 5432 (Spouse)",
    city: "Berlin",
    state: "Berlin",
    country: "Germany",
    zipCode: "10115",
    addressLine: "Friedrichstraße 42",
    registrationDate: "2025-01-15",
    totalRides: 48,
    paymentStatus: "Good Standing",
    accountStatus: "Active",
    lastActive: "10 mins ago",
    profile: {
      dob: "1992-04-12",
      gender: "Female",
      preferredLanguage: "German",
      kycStatus: "Verified",
    },
    rideHistory: [
      { id: "RD-901", date: "2026-09-28 18:30", pickup: "Alexanderplatz", dropoff: "Brandenburg Gate", fare: "€14.50", status: "Completed" },
      { id: "RD-872", date: "2026-09-25 09:15", pickup: "Hauptbahnhof", dropoff: "Potsdamer Platz", fare: "€11.20", status: "Completed" },
      { id: "RD-750", date: "2026-09-18 22:10", pickup: "Kreuzberg", dropoff: "Neukölln", fare: "€18.00", status: "Cancelled" },
    ],
    paymentHistory: [
      { id: "PAY-104", date: "2026-09-28", amount: "€14.50", method: "Apple Pay (Visa •••• 4242)", status: "Paid" },
      { id: "PAY-092", date: "2026-09-25", amount: "€11.20", method: "Apple Pay (Visa •••• 4242)", status: "Paid" },
    ],
    couponUsage: [
      { code: "SUMMER2026", discount: "20% OFF", usedOn: "2026-08-14" },
      { code: "WELCOME10", discount: "€10 Credit", usedOn: "2025-01-15" },
    ],
    complaints: [
      { id: "CMP-44", subject: "Driver minor delay due to traffic", date: "2026-07-20", status: "Resolved" },
    ],
    loginSessions: [
      { device: "iPhone 15 Pro (iOS 18.1)", ip: "185.220.101.4", location: "Berlin, DE", lastActive: "10 mins ago" },
      { device: "MacBook Pro (macOS 15.0)", ip: "185.220.101.4", location: "Berlin, DE", lastActive: "Yesterday" },
    ],
  },
  {
    id: "USR-8902",
    name: "Julian Thorne",
    email: "j.thorne@infurnus.org",
    avatar: "JT",
    phone: "+49 160 5551 234",
    emergencyContact: "+49 160 9998 765 (Brother)",
    city: "Munich",
    state: "Bavaria",
    country: "Germany",
    zipCode: "80331",
    addressLine: "Maximilianstraße 12",
    registrationDate: "2025-03-22",
    totalRides: 29,
    paymentStatus: "Good Standing",
    accountStatus: "Active",
    lastActive: "1 hour ago",
    profile: {
      dob: "1988-11-05",
      gender: "Male",
      preferredLanguage: "English",
      kycStatus: "Verified",
    },
    rideHistory: [
      { id: "RD-920", date: "2026-09-29 11:00", pickup: "Marienplatz", dropoff: "Englischer Garten", fare: "€16.80", status: "Completed" },
    ],
    paymentHistory: [
      { id: "PAY-110", date: "2026-09-29", amount: "€16.80", method: "Mastercard •••• 8812", status: "Paid" },
    ],
    couponUsage: [],
    complaints: [],
    loginSessions: [
      { device: "Samsung Galaxy S24 (Android 14)", ip: "84.112.50.12", location: "Munich, DE", lastActive: "1 hour ago" },
    ],
  },
  {
    id: "USR-8903",
    name: "Clara Sterling",
    email: "clara.s@infurnus.org",
    avatar: "CS",
    phone: "+49 172 4443 210",
    emergencyContact: "+49 172 1112 333 (Mother)",
    city: "Hamburg",
    state: "Hamburg",
    country: "Germany",
    zipCode: "20095",
    addressLine: "Mönckebergstraße 8",
    registrationDate: "2025-06-10",
    totalRides: 6,
    paymentStatus: "Pending Verification",
    accountStatus: "Suspended",
    lastActive: "3 days ago",
    profile: {
      dob: "1995-08-30",
      gender: "Female",
      preferredLanguage: "German",
      kycStatus: "Pending",
    },
    rideHistory: [
      { id: "RD-610", date: "2026-09-12 14:00", pickup: "Speicherstadt", dropoff: "Altona", fare: "€22.00", status: "Completed" },
    ],
    paymentHistory: [
      { id: "PAY-080", date: "2026-09-12", amount: "€22.00", method: "SEPA Direct Debit", status: "Failed" },
    ],
    couponUsage: [
      { code: "HAMBURG5", discount: "€5 Credit", usedOn: "2025-06-10" },
    ],
    complaints: [
      { id: "CMP-89", subject: "Failed payment authorization dispute", date: "2026-09-13", status: "Open" },
    ],
    loginSessions: [
      { device: "iPad Air (iPadOS 18.0)", ip: "92.201.88.90", location: "Hamburg, DE", lastActive: "3 days ago" },
    ],
  },
  {
    id: "USR-8904",
    name: "Harrison Brooks",
    email: "h.brooks@infurnus.org",
    avatar: "HB",
    phone: "+49 152 7776 543",
    emergencyContact: "+49 152 2223 444 (Partner)",
    city: "Frankfurt",
    state: "Hesse",
    country: "Germany",
    zipCode: "60311",
    addressLine: "Zeil 106",
    registrationDate: "2024-11-04",
    totalRides: 0,
    paymentStatus: "Payment Overdue",
    accountStatus: "Deactivated",
    lastActive: "2 weeks ago",
    profile: {
      dob: "1983-02-17",
      gender: "Male",
      preferredLanguage: "English",
      kycStatus: "Unverified",
    },
    rideHistory: [],
    paymentHistory: [],
    couponUsage: [],
    complaints: [],
    loginSessions: [],
  },
  {
    id: "USR-8905",
    name: "Amara Diop",
    email: "a.diop@infurnus.org",
    avatar: "AD",
    phone: "+49 171 9994 321",
    emergencyContact: "+49 171 8882 111 (Friend)",
    city: "Cologne",
    state: "NRW",
    country: "Germany",
    zipCode: "50667",
    addressLine: "Hohe Straße 77",
    registrationDate: "2026-02-01",
    totalRides: 74,
    paymentStatus: "Good Standing",
    accountStatus: "Active",
    lastActive: "5 mins ago",
    profile: {
      dob: "1991-09-14",
      gender: "Female",
      preferredLanguage: "French",
      kycStatus: "Verified",
    },
    rideHistory: [
      { id: "RD-980", date: "2026-09-29 19:40", pickup: "Cologne Cathedral", dropoff: "Deutz", fare: "€12.90", status: "Completed" },
    ],
    paymentHistory: [
      { id: "PAY-142", date: "2026-09-29", amount: "€12.90", method: "PayPal", status: "Paid" },
    ],
    couponUsage: [
      { code: "VIPPLUS", discount: "15% OFF", usedOn: "2026-09-01" },
    ],
    complaints: [],
    loginSessions: [
      { device: "Pixel 9 Pro (Android 15)", ip: "178.200.12.44", location: "Cologne, DE", lastActive: "5 mins ago" },
    ],
  },
];
