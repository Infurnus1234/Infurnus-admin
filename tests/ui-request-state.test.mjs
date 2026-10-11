import { test } from "node:test";
import assert from "node:assert/strict";
import {
  statusLabel,
  reviewPayload,
  requestPage,
} from "../src/lib/request-models.ts";

test("request pagination remains valid when the last page shrinks after review", () => {
  assert.equal(requestPage(10, 100), 10);
  assert.equal(requestPage(10, 90), 9);
  assert.equal(requestPage(10, 0), 1);
});
test("driver and partner document statuses remain readable, including missing optional values", () => {
  assert.equal(statusLabel("CHANGES_REQUESTED"), "changes requested");
  assert.equal(statusLabel("pending"), "pending");
  assert.equal(statusLabel(undefined), "Not provided");
  assert.equal(statusLabel(null), "Not provided");
});
test("approval does not accept missing target version even when a reason is supplied", () => {
  assert.throws(
    () => reviewPayload({ target: { updated_at: "" } }, "APPROVED", "Reviewed"),
    /version/,
  );
});
