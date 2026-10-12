import { test } from "node:test";
import assert from "node:assert/strict";
import {
  requesterName,
  requesterRole,
  roleLabel,
  requestLabel,
  requestTarget,
  shortIdentifier,
} from "../src/lib/request-models.ts";
const base = {
  id: "request",
  requester_id: "2603be40-8ac8-46f7-9101-b2a6ce66a594",
  requester_role: "driver",
  request_type: "driver_verification",
  target_type: "driver_profile",
  target_id: "target",
  status: "PENDING",
  submitted_at: "2026-01-01T00:00:00Z",
};
test("actual identity replaces UUID; current classification takes precedence over queue snapshot", () => {
  assert.equal(
    requesterName({ ...base, requester_display_name: "Real Name" }),
    "Real Name",
  );
  assert.equal(
    requesterRole({ ...base, requester_account_role: "customer" }),
    "Customer",
  );
});
test("missing identities never fall back to a UUID as the name", () => {
  assert.equal(requesterName(base), "Name unavailable");
  assert.equal(shortIdentifier(base.requester_id), "2603be40…a594");
});
test("roles are mapped individually and never inferred from the request type", () => {
  for (const [role, label] of [
    ["driver", "Driver"],
    ["fleet_owner", "Fleet Owner"],
    ["driver_fleet_owner", "Driver + Fleet Owner"],
    ["customer", "Customer"],
    ["vendor", "Vendor"],
  ])
    assert.equal(
      requesterRole({ ...base, requester_account_role: role }),
      label,
    );
  assert.equal(roleLabel(undefined), "Role unavailable");
  assert.equal(roleLabel("unknown"), "Role unavailable");
});
test("document and request codes become readable while actual business text is preserved", () => {
  assert.equal(requestLabel("driver_verification"), "Driver Verification");
  assert.equal(requestLabel("PROFILE_PHOTO"), "Profile Photo");
  assert.equal(
    requestTarget({ ...base, target_description: "VEHICLE_RC" }),
    "Vehicle Registration Document",
  );
  assert.equal(
    requestTarget({ ...base, target_description: "ABC Logistics" }),
    "ABC Logistics",
  );
});
