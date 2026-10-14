import { cookies } from "next/headers";

export const backendOrigin = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://infurnus-api-675633214574.asia-south2.run.app"
).replace(/\/+$/, "");
export const accessCookie = "infurnus_admin_access";
export const refreshCookie =
  process.env.AUTH_REFRESH_COOKIE_NAME || "infurnus_refresh_token";
export const csrfCookie =
  process.env.AUTH_CSRF_COOKIE_NAME || "infurnus_csrf_token";
export interface AdminIdentity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "super_admin";
  status: string;
  permissions?: string[];
  scoped?: boolean;
}

export async function backendFetch(path: string, init: RequestInit = {}) {
  return fetch(`${backendOrigin}${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(25000),
  });
}

// Decoding only locates the identity. The backend validates the signature, account and role.
export async function identityFor(
  token: string,
): Promise<AdminIdentity | null> {
  try {
    const claims = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    );
    if (!/^[\da-f-]{36}$/i.test(claims.sub)) return null;
    const response = await backendFetch("/admin/access/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    const identity = (await response.json()).data as AdminIdentity;
    return identity.id === claims.sub &&
      identity.status === "active" &&
      ["admin", "super_admin"].includes(identity.role)
      ? identity
      : null;
  } catch {
    return null;
  }
}

export async function currentIdentity() {
  const token = (await cookies()).get(accessCookie)?.value;
  return token ? identityFor(token) : null;
}
