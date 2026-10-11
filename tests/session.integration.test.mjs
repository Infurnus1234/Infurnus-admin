import { test } from "node:test";
import assert from "node:assert/strict";

// Opt-in only against the disposable visibility fixture server documented in the report.
// These .invalid accounts use disposable test credentials, never production credentials.
test(
  "real backend Admin session, role boundary, cookie rotation and logout",
  { skip: !process.env.ADMIN_INTEGRATION_URL },
  async () => {
    const origin = process.env.ADMIN_INTEGRATION_URL;
    const url = new URL(origin);
    assert(
      ["127.0.0.1", "localhost"].includes(url.hostname),
      "Local disposable environment only",
    );
    const jar = new Map();
    async function call(path, method = "GET", body, requestOrigin = origin) {
      const response = await fetch(origin + path, {
        method,
        redirect: "manual",
        headers: {
          Cookie: [...jar].map(([key, value]) => `${key}=${value}`).join("; "),
          "Content-Type": "application/json",
          Origin: requestOrigin,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      for (const cookie of response.headers.getSetCookie()) {
        const pair = cookie.split(";")[0];
        const separator = pair.indexOf("=");
        const name = pair.slice(0, separator),
          value = pair.slice(separator + 1);
        if (value) jar.set(name, value);
        else jar.delete(name);
      }
      return response;
    }
    let response = await call("/super-admin/driver-requests");
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "/login");
    response = await call("/api/backend/provider-approvals");
    assert.equal(response.status, 401);
    response = await call("/api/backend/auth/admin/login", "POST", {
      email: "visibility-1@example.invalid",
      password: "Local-fixture-only-2026!",
    });
    assert.equal(response.status, 200);
    const payload = (await response.json()).data;
    assert.equal(payload.identity.role, "admin");
    assert.equal(payload.accessToken, undefined);
    assert.equal(payload.csrfToken, undefined);
    assert(
      response.headers
        .getSetCookie()
        .every((cookie) => /HttpOnly/i.test(cookie)),
    );
    assert(jar.has("infurnus_refresh_token"));
    assert(jar.has("infurnus_csrf_token"));
    response = await call("/super-admin/driver-requests");
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "/admin/driver-requests");
    response = await call("/admin/driver-requests");
    assert.equal(response.status, 200);
    response = await call("/api/backend/provider-approvals");
    assert.equal(response.status, 200);
    response = await call("/api/backend/admin/admins", "POST", {});
    assert.equal(response.status, 404);
    response = await call(
      "/api/backend/auth/refresh",
      "POST",
      {},
      "https://untrusted.example",
    );
    assert.equal(response.status, 403);
    jar.delete("infurnus_admin_access");
    response = await call("/api/backend/provider-approvals");
    assert.equal(response.status, 200);
    assert(jar.has("infurnus_admin_access"));
    response = await call("/api/backend/auth/logout", "POST");
    assert.equal(response.status, 204);
    assert(!jar.has("infurnus_admin_access"));
    response = await call("/api/backend/provider-approvals");
    assert.equal(response.status, 401);
    response = await call("/api/backend/auth/admin/login", "POST", {
      email: "visibility-2@example.invalid",
      password: "Local-fixture-only-2026!",
    });
    assert.equal(response.status, 403);
    assert(!jar.has("infurnus_admin_access"));
  },
);
