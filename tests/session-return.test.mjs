import { test } from "node:test";
import assert from "node:assert/strict";
import { sessionReturnPath } from "../src/lib/session-return.ts";
test("refresh preserves local workspace details and filters", () => {
  for (const path of [
    "/admin/users?page=2",
    "/super-admin/drivers/example",
    "/super-admin/finance",
    "/admin",
  ])
    assert.equal(sessionReturnPath(path), path);
});
test("refresh rejects external, normalized escape and malformed destinations", () => {
  for (const path of [
    "https://evil.invalid",
    "//evil.invalid",
    "/admin/../../login",
    "/admin\\evil",
    "/administer",
    "/api/backend/auth/logout",
    "/admin\n/evil",
    null,
  ])
    assert.equal(sessionReturnPath(path), null);
});
