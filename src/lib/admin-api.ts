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
  const envelope = await response.json();
  if (!response.ok || !envelope.success)
    throw new ApiError(
      envelope.error?.message || "Request failed",
      response.status,
    );
  return envelope.data as T;
}

// Serialize this dashboard's requests so refresh-token rotation is not raced by sibling views.
let pending: Promise<unknown> = Promise.resolve();
export function adminApi<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const result = pending.then(() => perform<T>(path, method, body));
  pending = result.catch(() => undefined);
  return result;
}
