import { test } from "node:test";
import assert from "node:assert/strict";
import { allowedBackendPath } from "../src/lib/proxy-policy.ts";
const id = "11111111-1111-4111-8111-111111111111";
test("Fleet Owner workspace proxy allows only the reviewed read contract", () => {
  assert.equal(
    allowedBackendPath(
      "GET",
      `/provider-approvals/fleet-owners/${id}/overview`,
    ),
    true,
  );
  for (const method of ["POST", "PUT", "PATCH", "DELETE"])
    assert.equal(
      allowedBackendPath(
        method,
        `/provider-approvals/fleet-owners/${id}/overview`,
      ),
      false,
    );
  assert.equal(
    allowedBackendPath("GET", `/provider-approvals/fleet-owners/${id}/secrets`),
    false,
  );
  assert.equal(
    allowedBackendPath(
      "GET",
      "/provider-approvals/fleet-owners/not-a-uuid/overview",
    ),
    false,
  );
});

test("document policy proxy admits read/update only, not arbitrary methods", () => {
  assert.equal(
    allowedBackendPath("GET", "/provider-approvals/document-policies"),
    true,
  );
  assert.equal(
    allowedBackendPath("PUT", "/provider-approvals/document-policies"),
    true,
  );
  assert.equal(
    allowedBackendPath("POST", "/provider-approvals/document-policies"),
    false,
  );
  assert.equal(
    allowedBackendPath("DELETE", "/provider-approvals/document-policies"),
    false,
  );
});
