export interface ApprovalRequest {
  id: string;
  requester_id: string;
  requester_role: string;
  request_type: string;
  target_type: string;
  target_id: string;
  status: string;
  submitted_at: string;
}
export interface ReviewDocument {
  id: string;
  document_type: string;
  status: string;
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
  }[];
}
export interface Driver {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  verificationStatus: string;
  userStatus: string;
  city: string | null;
}
export interface DriverDetails {
  id: string;
  verificationStatus: string;
  rejectionReason: string | null;
  user: { id: string; firstName: string; lastName: string; status: string };
  documents: { id: string; documentType: string; verificationStatus: string }[];
}
export interface FleetApplication {
  id: string;
  driverProfileId: string;
  firstName: string;
  lastName: string;
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
export const statusLabel = (value: string) =>
  value.replaceAll("_", " ").toLowerCase();
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
