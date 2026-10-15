import { test } from "node:test";
import assert from "node:assert/strict";

test(
  "protected page restores a valid backend session after access-token expiry",
  { skip: !process.env.ADMIN_INTEGRATION_URL },
  async () => {
    const origin = process.env.ADMIN_INTEGRATION_URL;
    assert(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
    const jar = new Map();
    async function call(path, method = "GET", body) {
      const response = await fetch(origin + path, {
        method,
        redirect: "manual",
        headers: {
          Cookie: [...jar].map(([key, value]) => `${key}=${value}`).join("; "),
          "Content-Type": "application/json",
          Origin: origin,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      for (const cookie of response.headers.getSetCookie()) {
        const pair = cookie.split(";")[0],
          index = pair.indexOf("=");
        const key = pair.slice(0, index),
          value = pair.slice(index + 1);
        if (!value) jar.delete(key);
        else jar.set(key, value);
      }
      return response;
    }
    assert.equal(
      (
        await call("/api/backend/auth/admin/login", "POST", {
          email: "visibility-1@example.invalid",
          password: "Local-fixture-only-2026!",
        })
      ).status,
      200,
    );
    jar.set("infurnus_admin_access", "expired-access-fixture");
    const protectedPage = await call("/admin/users");
    assert.equal(protectedPage.status, 307);
    assert.equal(
      protectedPage.headers.get("location"),
      "/session/restore?returnTo=%2Fadmin%2Fusers",
    );
    assert.equal((await call("/session/restore")).status, 200);
    assert.equal((await call("/api/backend/auth/refresh", "POST")).status, 200);
    assert.equal((await call("/admin/users")).status, 200);
    const forbiddenPage = await call("/admin/finance");
    assert.equal(forbiddenPage.status, 200);
    assert.match(await forbiddenPage.text(), /Access restricted/);
    assert.equal(
      (await call("/api/backend/admin/operations/payments")).status,
      403,
    );
    assert.equal((await call("/api/backend/auth/logout", "POST")).status, 204);
    assert.equal(
      (await call("/admin/users")).headers.get("location"),
      "/login",
    );
  },
);

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
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Access restricted/);
    response = await call("/super-admin/settings");
    assert.equal(response.status, 404);
    response = await call("/admin/settings");
    assert.equal(response.status, 404);
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
