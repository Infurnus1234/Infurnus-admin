export interface CouponRecord {
  id: string;
  code: string;
  discountType: "Percentage" | "Fixed Amount";
  discountValue: string;
  usageCount: number;
  maxUsageLimit: number;
  userLimit: number;
  expiryDate: string;
  eligibility: string;
  status: "Active" | "Expired" | "Depleted" | "Scheduled";
  
  // Restrictions
  geoRestriction: string;
  vehicleRestriction: string;
  rideRestriction: string;

  // Analytics & History
  totalDiscountAmount: string;
  redemptionHistory: {
    userName: string;
    rideId: string;
    discountApplied: string;
    date: string;
  }[];
}

export type NotificationTargetType =
  | "Individual Users"
  | "Multiple Users"
  | "All Users"
  | "Individual Drivers"
  | "Multiple Drivers"
  | "All Drivers"
  | "Admins"
  | "Partners"
  | "Fleets"
  | "State"
  | "District"
  | "City"
  | "Operational Group";

export type NotificationDeliveryType =
  | "Immediate"
  | "Scheduled"
  | "Broadcast"
  | "Targeted"
  | "Transactional"
  | "Operational";

export interface NotificationRecord {
  id: string;
  title: string;
  body: string;
  targetType: NotificationTargetType;
  targetDetails: string;
  type: NotificationDeliveryType;
  channel: "In-App" | "Push Notification" | "SMS";
  scheduledTime?: string;
  sentAt: string;
  recipientCount: number;
  status: "Sent" | "Scheduled" | "Failed";
}

export const MOCK_COUPONS: CouponRecord[] = [
  {
    id: "CPN-101",
    code: "SUMMER2026",
    discountType: "Percentage",
    discountValue: "20% OFF",
    usageCount: 1240,
    maxUsageLimit: 5000,
    userLimit: 1,
    expiryDate: "2026-10-31",
    eligibility: "All Passengers",
    status: "Active",
    geoRestriction: "Berlin & Munich",
    vehicleRestriction: "EV Sedan Only",
    rideRestriction: "Min Fare €10.00",
    totalDiscountAmount: "€4,960.00",
    redemptionHistory: [
      { userName: "Eleanor Vance", rideId: "RD-8801", discountApplied: "€4.90", date: "2026-09-28" },
      { userName: "Julian Thorne", rideId: "RD-8410", discountApplied: "€6.40", date: "2026-09-28" },
    ],
  },
  {
    id: "CPN-102",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    discountValue: "€10.00 Credit",
    usageCount: 890,
    maxUsageLimit: 1000,
    userLimit: 1,
    expiryDate: "2026-12-31",
    eligibility: "New Registered Users",
    status: "Active",
    geoRestriction: "Germany-wide",
    vehicleRestriction: "All Vehicles",
    rideRestriction: "First Ride Only",
    totalDiscountAmount: "€8,900.00",
    redemptionHistory: [
      { userName: "Amara Diop", rideId: "RD-980", discountApplied: "€10.00", date: "2026-09-29" },
    ],
  },
  {
    id: "CPN-103",
    code: "VIPLUXURY",
    discountType: "Percentage",
    discountValue: "30% OFF",
    usageCount: 500,
    maxUsageLimit: 500,
    userLimit: 2,
    expiryDate: "2026-09-01",
    eligibility: "VIP Members",
    status: "Depleted",
    geoRestriction: "Frankfurt",
    vehicleRestriction: "Luxury Van",
    rideRestriction: "Min Fare €30.00",
    totalDiscountAmount: "€7,500.00",
    redemptionHistory: [],
  },
];

export const MOCK_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: "NOTIF-901",
    title: "Berlin Surge Pricing Update",
    body: "Peak demand pricing active in Berlin Mitte. Earn 1.5x on all dispatches between 18:00-22:00.",
    targetType: "All Drivers",
    targetDetails: "Berlin Zone Drivers",
    type: "Broadcast",
    channel: "Push Notification",
    sentAt: "2026-09-29 17:00",
    recipientCount: 8940,
    status: "Sent",
  },
  {
    id: "NOTIF-902",
    title: "System Maintenance Scheduled",
    body: "Scheduled server optimization will occur on Oct 2 between 02:00-03:00 UTC.",
    targetType: "Admins",
    targetDetails: "All Admin Accounts",
    type: "Operational",
    channel: "In-App",
    sentAt: "2026-09-28 10:30",
    recipientCount: 136,
    status: "Sent",
  },
];
