/** Public origin only. This module does not add authentication or wire mock UI data to APIs. */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://infurnus-api-675633214574.asia-south2.run.app"
).replace(/\/+$/, "");

/** Preserve the caller's exact backend path; never add an /api prefix. */
export function apiUrl(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("API paths must start with a single slash");
  }
  return `${API_BASE_URL}${path}`;
}
