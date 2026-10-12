export type ModuleKey =
  | "commission"
  | "refunds"
  | "users"
  | "partners"
  | "vehicles"
  | "fleets"
  | "rides"
  | "logistics"
  | "rentals"
  | "finance"
  | "wallets"
  | "transactions"
  | "settlements"
  | "coupons"
  | "notifications"
  | "support"
  | "audit-logs";
export interface OperationConfig {
  title: string;
  endpoint: string;
  searchKey: string;
  statusKey?: string;
  statuses?: string[];
  columns: {
    key: string;
    label: string;
    format?: "date" | "rupees" | "paise" | "boolean";
  }[];
  note?: string;
  superOnly?: boolean;
}
const id = { key: "id", label: "Record ID" };
const created = {
  key: "created_at",
  label: "Created",
  format: "date" as const,
};
const status = { key: "status", label: "Status" };
export const operationConfigs: Record<ModuleKey, OperationConfig> = {
  commission: {
    title: "Recorded commission",
    endpoint: "/admin/operations/commission",
    searchKey: "search",
    statusKey: "status",
    statuses: ["completed"],
    columns: [
      id,
      status,
      { key: "booking_gross_paise", label: "Booked gross", format: "paise" },
      {
        key: "booking_commission_paise",
        label: "Booked commission",
        format: "paise",
      },
      {
        key: "booking_driver_earnings_paise",
        label: "Booked driver earnings",
        format: "paise",
      },
      { key: "currency", label: "Currency" },
      created,
    ],
    superOnly: true,
    note: "Booking-time amounts from the backend fare snapshot, in each record's currency. These are not settled payouts. Missing historical snapshots remain unavailable. Commission configuration awaits an approved policy.",
  },
  refunds: {
    title: "Refund monitoring",
    endpoint: "/admin/operations/refunds",
    searchKey: "search",
    columns: [
      id,
      { key: "payment_id", label: "Payment" },
      status,
      { key: "amount", label: "Amount", format: "rupees" },
      { key: "currency", label: "Currency" },
      created,
    ],
    superOnly: true,
    note: "Existing refund ledger only. Refund execution is unavailable; no payment gateway is invoked.",
  },
  users: {
    title: "User accounts",
    endpoint: "/admin/users",
    searchKey: "search",
    statusKey: "status",
    statuses: ["active", "suspended", "banned"],
    columns: [
      { key: "displayName", label: "Name" },
      { key: "role", label: "Role" },
      { key: "email", label: "Email" },
      status,
      { key: "createdAt", label: "Joined", format: "date" },
    ],
  },
  partners: {
    title: "Partners",
    endpoint: "/admin/partners",
    searchKey: "search",
    statusKey: "approvalStatus",
    statuses: ["pending", "under_review", "approved", "rejected"],
    columns: [
      { key: "businessName", label: "Business" },
      { key: "approvalStatus", label: "Approval" },
      { key: "kycStatus", label: "KYC" },
      { key: "vehicleCount", label: "Vehicles" },
      { key: "createdAt", label: "Joined", format: "date" },
    ],
  },
  vehicles: {
    title: "Vehicle inventory",
    endpoint: "/admin/vehicles",
    searchKey: "plate",
    columns: [
      { key: "plateNumber", label: "Registration" },
      { key: "make", label: "Make" },
      { key: "model", label: "Model" },
      { key: "isActive", label: "Active", format: "boolean" },
      { key: "insuranceStatus", label: "Insurance" },
      { key: "createdAt", label: "Registered", format: "date" },
    ],
  },
  fleets: {
    title: "Fleet monitoring",
    endpoint: "/admin/fleet/vehicles",
    searchKey: "search",
    statusKey: "status",
    statuses: ["active", "on_trip", "offline", "registered"],
    columns: [
      id,
      { key: "plateNumber", label: "Registration" },
      { key: "driverName", label: "Driver" },
      status,
      { key: "city", label: "City" },
      { key: "lastLocationAt", label: "Location updated", format: "date" },
    ],
  },
  rides: {
    title: "Ride bookings",
    endpoint: "/admin/operations/rides",
    searchKey: "search",
    statusKey: "status",
    statuses: [
      "requested",
      "searching",
      "driver_assigned",
      "driver_arriving",
      "driver_arrived",
      "in_progress",
      "completed",
      "cancelled",
    ],
    columns: [
      id,
      { key: "sector", label: "Service" },
      status,
      { key: "pickup_address", label: "Pickup" },
      { key: "destination_address", label: "Destination" },
      { key: "fare_estimate", label: "Estimate (INR)", format: "rupees" },
      created,
    ],
    note: "Monitoring is read-only. Booking transitions remain controlled by the existing ride lifecycle.",
  },
  logistics: {
    title: "Logistics & parcel orders",
    endpoint: "/admin/operations/logistics",
    searchKey: "search",
    statusKey: "status",
    statuses: [
      "PENDING",
      "CONFIRMED",
      "ASSIGNED",
      "PICKUP_IN_PROGRESS",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
      "CANCELLED",
      "FAILED",
    ],
    columns: [
      id,
      { key: "user_id", label: "Customer" },
      status,
      { key: "scheduled_pickup_at", label: "Pickup scheduled", format: "date" },
      created,
    ],
    note: "The current schema has logistics orders but no separate parcel subtype. Orders are not relabelled as parcel bookings.",
  },
  rentals: {
    title: "Rental bookings",
    endpoint: "/admin/operations/rentals",
    searchKey: "search",
    statusKey: "status",
    statuses: ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"],
    columns: [
      id,
      { key: "vehicle_id", label: "Vehicle" },
      status,
      { key: "start_at", label: "Starts", format: "date" },
      { key: "total_amount", label: "Amount", format: "rupees" },
      { key: "currency", label: "Currency" },
    ],
  },
  finance: {
    title: "Payment monitoring",
    endpoint: "/admin/operations/payments",
    searchKey: "search",
    statusKey: "status",
    statuses: ["INITIATED", "AUTHORIZED", "CAPTURED", "REFUNDED", "FAILED"],
    columns: [
      id,
      { key: "user_id", label: "Customer" },
      status,
      { key: "amount", label: "Amount", format: "rupees" },
      { key: "currency", label: "Currency" },
      created,
    ],
    superOnly: true,
    note: "Read-only recorded payments. Gateway capture/refund actions are unavailable in this panel; no payment service is invoked.",
  },
  wallets: {
    title: "Provider wallets",
    endpoint: "/admin/operations/wallets",
    searchKey: "search",
    columns: [
      id,
      { key: "balance_paise", label: "Balance", format: "paise" },
      { key: "currency", label: "Currency" },
      created,
    ],
    superOnly: true,
  },
  transactions: {
    title: "Wallet transactions",
    endpoint: "/admin/operations/transactions",
    searchKey: "search",
    columns: [
      id,
      { key: "user_id", label: "Provider" },
      { key: "entry_type", label: "Type" },
      { key: "amount_paise", label: "Amount (INR)", format: "paise" },
      {
        key: "balance_after_paise",
        label: "Balance after (INR)",
        format: "paise",
      },
      created,
    ],
    superOnly: true,
  },
  settlements: {
    title: "Settlement monitoring",
    endpoint: "/admin/operations/settlements",
    searchKey: "search",
    statusKey: "status",
    statuses: ["PENDING", "PROCESSING", "SUCCESS", "FAILED"],
    columns: [
      id,
      { key: "user_id", label: "Provider" },
      status,
      { key: "amount_paise", label: "Amount (INR)", format: "paise" },
      created,
    ],
    superOnly: true,
    note: "Existing payout records only. Execution and settlement changes are unavailable; no gateway integration is added.",
  },
  coupons: {
    title: "Promo codes",
    endpoint: "/admin/operations/coupons",
    searchKey: "search",
    columns: [
      { key: "code", label: "Code" },
      { key: "discount_type", label: "Discount type" },
      { key: "discount_value", label: "Value (% or paise)" },
      { key: "is_active", label: "Active", format: "boolean" },
      { key: "usage_count", label: "Redemptions" },
      { key: "expires_at", label: "Expires", format: "date" },
    ],
    note: "Discount values retain the backend unit: percentage or integer paise for fixed discounts; caps/minimum fares are in paise.",
  },
  notifications: {
    title: "Notification delivery",
    endpoint: "/admin/operations/notifications",
    searchKey: "search",
    statusKey: "status",
    statuses: ["PENDING", "SENT", "DELIVERED", "FAILED"],
    columns: [
      id,
      { key: "notification_type", label: "Type" },
      { key: "channel", label: "Channel" },
      { key: "delivery_status", label: "Delivery" },
      { key: "attempt_count", label: "Attempts" },
      created,
    ],
    note: "Delivery metadata only. Message contents and provider payloads are not exposed.",
  },
  support: {
    title: "Support tickets",
    endpoint: "/admin/operations/support",
    searchKey: "search",
    statusKey: "status",
    statuses: ["OPEN", "UNDER_REVIEW", "RESOLVED", "CLOSED"],
    columns: [
      id,
      { key: "ticket_number", label: "Ticket" },
      { key: "subject", label: "Subject" },
      status,
      { key: "category", label: "Category" },
      created,
    ],
  },
  "audit-logs": {
    title: "Activity history",
    endpoint: "/admin/operations/activity",
    searchKey: "search",
    columns: [
      id,
      { key: "user_id", label: "Actor" },
      { key: "event_type", label: "Event" },
      { key: "entity_type", label: "Entity" },
      { key: "entity_id", label: "Target" },
      created,
    ],
    superOnly: true,
    note: "Existing recorded activity; arbitrary metadata is excluded to prevent sensitive payload leakage.",
  },
};
// Backend-resolved account identity is the label; full foreign IDs remain in details.
for (const key of [
  "commission",
  "refunds",
  "rides",
  "logistics",
  "rentals",
  "finance",
  "wallets",
  "transactions",
  "settlements",
  "notifications",
  "support",
  "audit-logs",
] as const) {
  const config = operationConfigs[key];
  config.columns = config.columns.filter(
    (column) =>
      !["user_id", "customer_id", "assigned_driver_id"].includes(column.key) &&
      !(key === "wallets" && column.key === "id"),
  );
  config.columns.unshift(
    {
      key: "account_display_name",
      label: key === "commission" ? "Driver" : "Account",
    },
    { key: "account_role", label: "Role" },
  );
}
export function operationPath(
  key: ModuleKey,
  page: number,
  search: string,
  status: string,
  role = "customer",
  pageSize = 25,
) {
  const config = operationConfigs[key];
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (key === "users") query.set("role", role);
  if (search.trim()) query.set(config.searchKey, search.trim());
  if (status && config.statusKey) query.set(config.statusKey, status);
  return `${config.endpoint}?${query}`;
}
export function fieldValue(value: unknown, format?: string): string {
  if (value === null || value === undefined || value === "")
    return "Not provided";
  if (format === "boolean") return value === true ? "Yes" : "No";
  if (format === "date") {
    const date = new Date(String(value));
    return Number.isNaN(date.getTime())
      ? "Unavailable"
      : date.toLocaleString("en-IN");
  }
  if (format === "rupees" || format === "paise") {
    const number = Number(value);
    return Number.isFinite(number)
      ? (number / (format === "paise" ? 100 : 1)).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "Unavailable";
  }
  return typeof value === "object" ? "See related records" : String(value);
}

export function recordValue(
  row: Record<string, unknown>,
  key: string,
  format?: string,
) {
  if (key === "account_display_name")
    return typeof row[key] === "string" && (row[key] as string).trim()
      ? (row[key] as string)
      : "Name unavailable";
  if (key === "displayName")
    return (
      [row.firstName, row.lastName]
        .filter((value) => typeof value === "string" && value.trim())
        .join(" ") || "Name unavailable"
    );
  return fieldValue(row[key], format);
}
export function fieldLabel(key: string) {
  const label = key.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}
