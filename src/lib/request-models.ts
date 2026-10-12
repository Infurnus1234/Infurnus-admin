export interface ApprovalRequest {
  id: string;
  requester_id: string;
  requester_role: string;
  requester_display_name?: string | null;
  requester_account_role?: string | null;
  target_description?: string | null;
  can_review?: boolean;
  request_type: string;
  target_type: string;
  target_id: string;
  status: string;
  submitted_at: string;
}
export interface ReviewDocument {
  id: string;
  document_type: string;
  document_code?: string;
  status?: string;
  verification_status?: string;
  pageCount: number;
}
export interface ApprovalDetails {
  request: ApprovalRequest;
  target: {
    updated_at: string;
    verification_status?: string;
    first_name?: string;
    user_id?: string;
  };
  documents: ReviewDocument[];
  history: {
    id: string;
    status: string;
    reviewed_at: string | null;
    rejection_reason: string | null;
    requester_display_name?: string | null;
    requester_account_role?: string | null;
    requester_role?: string;
  }[];
}
export interface Driver {
  id: string;
  role?: string;
  userId: string;
  firstName: string;
  lastName: string;
  verificationStatus: string;
  userStatus: string;
  city: string | null;
}
export interface DriverDetails {
  id: string;
  role?: string;
  verificationStatus: string;
  rejectionReason: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    status: string;
    role?: string;
  };
  documents: { id: string; documentType: string; verificationStatus: string }[];
}
export interface FleetApplication {
  id: string;
  driverProfileId: string;
  firstName: string;
  lastName: string;
  requesterRole?: string;
  partnerBusinessName: string;
  status: string;
  requestedSector: string;
  requestedVehicleCategory: string;
}
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
export const statusLabel = (value: string | null | undefined) =>
  value ? value.replaceAll("_", " ").toLowerCase() : "Not provided";
const roleLabels: Record<string, string> = {
  driver: "Driver",
  fleet_owner: "Fleet Owner",
  driver_fleet_owner: "Driver + Fleet Owner",
  customer: "Customer",
  user: "Customer",
  vendor: "Vendor",
  admin: "Admin",
  super_admin: "Super Admin",
};
export function roleLabel(role: string | null | undefined) {
  return role ? roleLabels[role] || "Role unavailable" : "Role unavailable";
}
export function requesterName(request: ApprovalRequest) {
  return request.requester_display_name?.trim() || "Name unavailable";
}
export function requesterRole(request: ApprovalRequest) {
  return roleLabel(request.requester_account_role || request.requester_role);
}
export function shortIdentifier(id: string) {
  return id.length > 16 ? id.slice(0, 8) + "…" + id.slice(-4) : id;
}
const documentLabels: Record<string, string> = {
  AADHAAR: "Aadhaar",
  PAN: "PAN",
  DRIVING_LICENCE: "Driving Licence",
  PROFILE_PHOTO: "Profile Photo",
  ADDRESS_PROOF: "Address Proof",
  VEHICLE_RC: "Vehicle Registration Document",
  VEHICLE_INSURANCE: "Vehicle Insurance",
  VEHICLE_PERMIT: "Vehicle Permit",
  VEHICLE_FITNESS: "Vehicle Fitness",
  OTHER: "Other Document",
};
export function requestLabel(value: string) {
  return (
    documentLabels[value.toUpperCase()] ||
    value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}
export function requestTarget(request: ApprovalRequest) {
  return request.target_description
    ? documentLabels[request.target_description.toUpperCase()] ||
        request.target_description
    : requestLabel(request.target_type);
}
export const requestPage = (page: number, total: number) =>
  Math.max(1, Math.min(page, Math.max(1, Math.ceil(total / 10))));
export function requestTimestamp(value: string | null) {
  if (!value) return "Not reviewed";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Time unavailable"
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}
export function reviewPayload(
  details: ApprovalDetails,
  status: "APPROVED" | "REJECTED",
  reason: string,
) {
  if (!details.target.updated_at)
    throw new Error("Current target version is unavailable");
  if (status === "REJECTED" && !reason.trim())
    throw new Error("A rejection reason is required");
  return {
    status,
    expectedUpdatedAt: details.target.updated_at,
    ...(reason.trim() ? { reason: reason.trim() } : {}),
  };
}
