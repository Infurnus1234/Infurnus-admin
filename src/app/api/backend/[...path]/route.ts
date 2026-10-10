import { NextRequest, NextResponse } from "next/server";
import {
  accessCookie,
  refreshCookie,
  csrfCookie,
  backendFetch,
  identityFor,
} from "@/lib/backend-session";
import { allowedBackendPath, sameOriginMutation } from "@/lib/proxy-policy";

const fail = (message: string, status: number) =>
  NextResponse.json({ success: false, error: { message } }, { status });
async function handle(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const path = "/" + (await context.params).path.join("/");
  if (!allowedBackendPath(request.method, path))
    return fail("Unsupported operation", 404);
  if (
    !sameOriginMutation(
      request.method,
      request.headers.get("origin"),
      process.env.ADMIN_APP_ORIGIN || request.nextUrl.origin,
    )
  )
    return fail("Invalid request origin", 403);
  const authentication = path.startsWith("/auth/");
  const cookieHeader = [refreshCookie, csrfCookie]
    .map((name) => `${name}=${request.cookies.get(name)?.value || ""}`)
    .join("; ");
  let token = request.cookies.get(accessCookie)?.value;
  const forwardedCookies: string[] = [];
  const headers = () => ({
    "Content-Type": "application/json",
    Cookie: cookieHeader,
    "X-CSRF-Token": request.cookies.get(csrfCookie)?.value || "",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });
  try {
    if (!authentication && !(token && (await identityFor(token)))) {
      const refresh = await backendFetch("/auth/refresh", {
        method: "POST",
        headers: headers(),
      });
      forwardedCookies.push(...refresh.headers.getSetCookie());
      if (refresh.ok) token = (await refresh.json()).data.accessToken;
      if (!(token && (await identityFor(token))))
        return fail("Session expired or administrator access denied", 401);
    }
    const response = await backendFetch(path + request.nextUrl.search, {
      method: request.method,
      headers: headers(),
      ...(request.method !== "GET" ? { body: await request.text() } : {}),
    });
    forwardedCookies.push(...response.headers.getSetCookie());
    const payload = response.status === 204 ? null : await response.json();
    if (response.ok && authentication && payload?.data?.accessToken) {
      token = payload.data.accessToken;
      const identity = await identityFor(token!);
      if (!identity) return fail("Administrator account required", 403);
      delete payload.data.accessToken;
      delete payload.data.csrfToken;
      payload.data.identity = identity;
    }
    const result =
      response.status === 204
        ? new NextResponse(null, { status: 204 })
        : NextResponse.json(payload, { status: response.status });
    result.headers.set("Cache-Control", "no-store");
    if (token && response.ok)
      result.cookies.set(accessCookie, token, {
        httpOnly: true,
        secure: (
          process.env.ADMIN_APP_ORIGIN || request.nextUrl.origin
        ).startsWith("https:"),
        sameSite: "lax",
        path: "/",
      });
    if (path === "/auth/logout" && response.ok)
      for (const name of [accessCookie, refreshCookie, csrfCookie])
        result.cookies.delete(name);
    // Append after NextResponse cookie mutations: cookies.set serializes its own jar.
    // Keep backend refresh expiry/rotation semantics and keep every credential HttpOnly.
    for (const value of forwardedCookies)
      result.headers.append(
        "Set-Cookie",
        value
          .replace(/;\s*Path=[^;]*/i, "; Path=/")
          .replace(/;\s*SameSite=[^;]*/i, "; SameSite=Lax")
          .replace(/;\s*HttpOnly/gi, "") + "; HttpOnly",
      );
    return result;
  } catch {
    return fail("Backend unavailable; retry safely", 502);
  }
}
export const GET = handle;
export const POST = handle;
export const PATCH = handle;
