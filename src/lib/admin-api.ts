export class ApiError extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
async function perform<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const response = await fetch(`/api/backend${path}`, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (response.status === 204) return undefined as T;
  let envelope;
  try {
    envelope = await response.json();
  } catch {
    throw new ApiError(
      "Backend returned an unreadable response. Please retry.",
      response.ok ? 502 : response.status,
    );
  }
  if (!envelope || typeof envelope !== "object")
    throw new ApiError(
      "Backend returned an invalid response. Please retry.",
      response.ok ? 502 : response.status,
    );
  if (!response.ok || !envelope.success)
    throw new ApiError(
      envelope.error?.message || "Request failed",
      response.status,
    );
  return envelope.data as T;
}

// Serialize this dashboard's requests so refresh-token rotation is not raced by sibling views.
let pending: Promise<unknown> = Promise.resolve();
export function withAdminSession<T>(operation: () => Promise<T>): Promise<T> {
  const result = pending.then(operation);
  pending = result.catch(() => undefined);
  return result;
}
export function adminApi<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  return withAdminSession(() => perform<T>(path, method, body));
}

export async function documentAccessUrl(
  requestId: string,
  documentId: string,
  page: number,
  pageCount: number,
): Promise<string> {
  const path = `/provider-approvals/${requestId}/documents/${documentId}/access-url`;
  let result: { accessUrl: string };
  try {
    result = await adminApi<{ accessUrl: string }>(`${path}?page=${page}`);
  } catch (error) {
    // Legacy single-file records have a root asset but no document-page row.
    // The same authorized endpoint supports that asset without a page query.
    if (!(
      page === 1 &&
      pageCount === 1 &&
      error instanceof ApiError &&
      error.status === 404 &&
      ["Page not found", "Stored document/page not found"].includes(
        error.message,
      )
    ))
      throw error;
    result = await adminApi<{ accessUrl: string }>(path);
  }
  const url = new URL(result.accessUrl);
  if (
    url.protocol !== "https:" &&
    !(
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname)
    )
  )
    throw new Error("Invalid document access URL");
  return url.href;
}
