import test from "node:test";
import assert from "node:assert/strict";
import {
  dashboardDestination,
  bookingGroupStatus,
  recordReturnPath,
} from "../src/lib/dashboard-navigation.ts";
import { locatedFleet, decodeRoute } from "../src/lib/fleet-map.ts";
import { emptyVehicleForm, vehiclePayload } from "../src/lib/vehicle-form.ts";
import { allowedBackendPath } from "../src/lib/proxy-policy.ts";
import { adminApi } from "../src/lib/admin-api.ts";
import { loadMapsSdk } from "../src/lib/maps-sdk.ts";
import { perKmReferenceInput } from "../src/lib/pricing-reference-input.ts";

test("reference pricing preserves the upper bound and rejects implicit or invalid maxima", () => {
  assert.deepEqual(
    perKmReferenceInput({ perKmRate: "26", perKmRateMax: "91" }),
    { minimum: 2600, maximum: 9100 },
  );
  for (const maximum of ["", "25", "NaN", "26.001"])
    assert.throws(() =>
      perKmReferenceInput({ perKmRate: "26", perKmRateMax: maximum }),
    );
});

test("SDK missing configuration fails safely and late authorization failure reaches the UI", async () => {
  const previousWindow = globalThis.window,
    previousDocument = globalThis.document;
  const window = new EventTarget();
  let removed = false,
    failures = 0;
  globalThis.window = window;
  globalThis.document = {
    createElement: () => ({
      remove() {
        removed = true;
      },
    }),
    head: {
      append() {
        queueMicrotask(() => {
          window.google = { maps: { Map: class {} } };
          window.__infurnusMapsReady();
        });
      },
    },
  };
  try {
    await assert.rejects(loadMapsSdk(""), /not configured/);
    window.addEventListener("infurnus-maps-auth-failure", () => failures++);
    await loadMapsSdk("test");
    window.gm_authFailure();
    assert.equal(failures, 1);
    assert.equal(removed, true);
    await assert.rejects(loadMapsSdk("test"), /authorization failed/);
  } finally {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  }
});

test("dashboard preserves role and booking period, with actual lifecycle statuses", () => {
  for (const role of ["admin", "super-admin"]) {
    assert.equal(
      dashboardDestination(role, "Total Users", {}),
      `/${role}/users?role=all`,
    );
    assert.equal(
      dashboardDestination(role, "Completed", {
        from: "2026-10-01",
        to: "2026-10-14",
      }),
      `/${role}/bookings?group=completed&from=2026-10-01&to=2026-10-14`,
    );
    assert.equal(dashboardDestination(role, "Total Vendors", {}), null);
  }
  assert.equal(bookingGroupStatus("completed", "logistics"), "DELIVERED");
  assert.equal(bookingGroupStatus("completed", "rides"), "completed");
  assert.equal(bookingGroupStatus("cancelled", "rentals"), "CANCELLED");
});
test("detail back links retain filters without escaping the authorized workflow", () => {
  assert.equal(
    recordReturnPath("/admin/vehicles?page=2&search=TEST", "admin", "vehicles"),
    "/admin/vehicles?page=2&search=TEST",
  );
  for (const unsafe of [
    "//example.com/admin/vehicles",
    "/\\example.com/admin/vehicles",
    "/super-admin/vehicles",
    "/admin/users",
    "https://example.com",
  ])
    assert.equal(
      recordReturnPath(unsafe, "admin", "vehicles"),
      "/admin/vehicles",
    );
});
test("map uses reported coordinates and backend geometry only", () => {
  assert.deepEqual(
    locatedFleet([
      { latitude: 0, longitude: 0, locationFresh: true },
      { latitude: 25, longitude: 85, locationFresh: false },
      { latitude: 25, longitude: 85 },
      { latitude: null, longitude: 85 },
      { latitude: 91, longitude: 85 },
      { latitude: 25, longitude: NaN },
    ]),
    [{ latitude: 0, longitude: 0, locationFresh: true }],
  );
  assert.deepEqual(decodeRoute("_p~iF~ps|U_ulLnnqC_mqNvxq`@"), [
    { lat: 38.5, lng: -120.2 },
    { lat: 40.7, lng: -120.95 },
    { lat: 43.252, lng: -126.453 },
  ]);
  assert.throws(() => decodeRoute("_"));
});
test("vehicle edits validate input and cannot alter ownership or verification privileges", () => {
  const valid = {
    ...emptyVehicleForm,
    make: "TEST",
    model: "Sample",
    plateNumber: "TEST-LOCAL",
    category: "sedan",
    fuelRatePerKm: "3.25",
    ownerId: "12345678-1234-1234-1234-123456789abc",
  };
  const edited = vehiclePayload(valid, true);
  assert.equal(edited.fuelRatePerKm, 3.25);
  assert.equal("ownerId" in edited, false);
  assert.equal("verificationStatus" in edited, false);
  for (const invalid of [
    { fuelRatePerKm: "NaN" },
    { seatingCapacity: "0" },
    { manufacturingYear: "1899" },
    { registrationDate: "2026-10-14", registrationExpiry: "2026-10-01" },
    { make: "" },
  ])
    assert.throws(() => vehiclePayload({ ...valid, ...invalid }, false));
});
test("proxy admits scoped vehicle and map operations without financial execution", () => {
  const id = "12345678-1234-1234-1234-123456789abc";
  assert.equal(allowedBackendPath("PATCH", `/vehicles/${id}`), true);
  assert.equal(allowedBackendPath("POST", `/vehicles/${id}/deactivate`), true);
  assert.equal(allowedBackendPath("POST", "/maps/route"), true);
  for (const route of [
    "/payments",
    "/admin/operations/settlements",
    "/vehicles/" + id + "/delete",
  ])
    assert.equal(allowedBackendPath("POST", route), false);
});
test("non-JSON API failures retain status and do not poison later requests", async () => {
  const original = globalThis.fetch;
  try {
    for (const status of [401, 502]) {
      globalThis.fetch = async () =>
        new Response("<html>error</html>", { status });
      await assert.rejects(
        adminApi("/admin/dashboard"),
        (error) => error.status === status,
      );
    }
    globalThis.fetch = async () => new Response("null", { status: 200 });
    await assert.rejects(
      adminApi("/admin/dashboard"),
      (error) => error.status === 502,
    );
    globalThis.fetch = async () =>
      Response.json({ success: true, data: { ok: true } });
    assert.deepEqual(await adminApi("/admin/dashboard"), { ok: true });
  } finally {
    globalThis.fetch = original;
  }
});
