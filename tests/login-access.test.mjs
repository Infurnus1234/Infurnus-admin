import test from "node:test";
import assert from "node:assert/strict";
import {
  proxyOrigin,
  sameOriginMutation,
  allowedBackendPath,
} from "../src/lib/proxy-policy.ts";
import { reviewPayload } from "../src/lib/request-models.ts";
test("administrative password route is allowed and legacy OTP login is unavailable", () => {
  assert.equal(allowedBackendPath("POST", "/auth/admin/login"), true);
  for (const path of [
    "/auth/login",
    "/auth/login/verify",
    "/auth/login/resend",
  ]) {
    assert.equal(allowedBackendPath("POST", path), false);
  }
});
test("loopback development origin works without weakening production origin checks", () => {
  assert.equal(
    proxyOrigin(undefined, true, "127.0.0.1:3100", "http://localhost:3100"),
    "http://127.0.0.1:3100",
  );
  assert.equal(
    proxyOrigin(
      undefined,
      false,
      "attacker.invalid",
      "https://admin.example.invalid",
    ),
    "https://admin.example.invalid",
  );
  assert.equal(
    proxyOrigin(
      "https://approved.example.invalid",
      true,
      "127.0.0.1:3100",
      "fallback",
    ),
    "https://approved.example.invalid",
  );
  assert.equal(
    sameOriginMutation(
      "POST",
      "https://attacker.invalid",
      "http://127.0.0.1:3100",
    ),
    false,
  );
});
test("request detail, document and persisted review paths are allowed; privileged arbitrary paths are denied", () => {
  const id = "00000000-0000-4000-8000-000000000001";
  assert.equal(allowedBackendPath("GET", `/provider-approvals/${id}`), true);
  assert.equal(
    allowedBackendPath(
      "GET",
      `/provider-approvals/${id}/documents/${id}/access-url`,
    ),
    true,
  );
  assert.equal(
    allowedBackendPath("POST", `/provider-approvals/${id}/review`),
    true,
  );
  assert.equal(allowedBackendPath("POST", "/admin/admins"), false);
});
test("review requires current backend version and a rejection reason", () => {
  assert.throws(
    () => reviewPayload({ target: { updated_at: "" } }, "APPROVED", ""),
    /version/,
  );
  assert.throws(
    () =>
      reviewPayload(
        { target: { updated_at: "2026-10-11T00:00:00.123456Z" } },
        "REJECTED",
        " ",
      ),
    /reason/,
  );
});
