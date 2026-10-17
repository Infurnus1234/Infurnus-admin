import { adminApi, ApiError } from "./admin-api.ts";
import type { ApprovalRequest } from "./request-models.ts";

// Preserve the existing review flow until the compatible backend rolls out.
// Authorization and server failures must never be hidden by this fallback.
export async function approvalQuery<T>(
  path: string,
  fallback: string,
): Promise<T> {
  try {
    return await adminApi<T>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 400)
      return adminApi<T>(fallback);
    throw error;
  }
}
export function loadProviderApprovals(status: string) {
  const path = `/provider-approvals?status=${status}`;
  return approvalQuery<ApprovalRequest[]>(path + "&group=driver", path);
}
