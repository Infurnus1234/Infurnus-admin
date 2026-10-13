import { test } from "node:test";
import assert from "node:assert/strict";
import {
  operationConfigs,
  operationPath,
  fieldValue,
} from "../src/lib/operations.ts";
import { allowedBackendPath } from "../src/lib/proxy-policy.ts";
test("support mutation is allowed only on its scoped status endpoint", () => {
  const path =
    "/admin/operations/support/11111111-1111-4111-8111-111111111111/status";
  assert.equal(allowedBackendPath("PATCH", path), true);
  assert.equal(allowedBackendPath("DELETE", path), false);
  assert.equal(allowedBackendPath("POST", path), false);
  assert.equal(
    allowedBackendPath("PATCH", "/admin/operations/support/not-an-id/status"),
    false,
  );
});
test("every operational read uses an explicitly allowed backend endpoint", () => {
  for (const config of Object.values(operationConfigs))
    assert.equal(allowedBackendPath("GET", config.endpoint), true);
});
test("customer filters use backend role and search fields", () => {
  const url = new URL(
    operationPath("users", 2, " Ada & Co ", "active"),
    "https://example.invalid",
  );
  assert.equal(url.searchParams.get("role"), "customer");
  assert.equal(url.searchParams.get("search"), "Ada & Co");
  assert.equal(url.searchParams.get("status"), "active");
  assert.equal(url.searchParams.get("page"), "2");
});
test("vehicle registration uses plate filter rather than unsupported generic search", () =>
  assert.match(operationPath("vehicles", 1, "BR01", ""), /plate=BR01/));
test("financial display converts backend paise, distinguishes missing from zero", () => {
  assert.equal(fieldValue(0, "paise"), "0.00");
  assert.equal(fieldValue(null, "paise"), "Not provided");
  assert.equal(fieldValue(12005, "paise"), "120.05");
});
test("finance and activity screens require Super Admin", () => {
  for (const key of [
    "commission",
    "refunds",
    "finance",
    "wallets",
    "transactions",
    "settlements",
    "audit-logs",
  ])
    assert.equal(operationConfigs[key].superOnly, true);
});
test("read visibility does not enable payout or payment execution", () => {
  for (const path of [
    "/admin/operations/payments",
    "/admin/operations/settlements",
  ])
    assert.equal(allowedBackendPath("POST", path), false);
});
