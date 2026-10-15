import test from "node:test";
import assert from "node:assert/strict";
import {
  presetPeriod,
  periodError,
  dashboardPeriodQuery,
} from "../src/lib/dashboard-period.ts";
import { dashboardDestination } from "../src/lib/dashboard-navigation.ts";
for (const [days, from] of [
  [1, "2026-10-15"],
  [2, "2026-10-14"],
  [7, "2026-10-09"],
  [15, "2026-10-01"],
  [30, "2026-09-16"],
]) {
  test(`${days} calendar days use Asia/Kolkata even before midnight UTC`, () => {
    assert.deepEqual(presetPeriod(days, new Date("2026-10-14T18:30:00Z")), {
      from,
      to: "2026-10-15",
    });
  });
}
test("calendar subtraction crosses year and leap-day boundaries", () => {
  assert.deepEqual(presetPeriod(7, new Date("2026-01-01T01:00:00Z")), {
    from: "2025-12-26",
    to: "2026-01-01",
  });
  assert.deepEqual(presetPeriod(2, new Date("2024-03-01T01:00:00Z")), {
    from: "2024-02-29",
    to: "2024-03-01",
  });
});
test("invalid/reversed dates cannot load misleading totals", () => {
  for (const period of [
    { from: "2026-02-30", to: "" },
    { from: "invalid", to: "" },
    { from: "2026-10-16", to: "2026-10-15" },
  ])
    assert.notEqual(periodError(period), "");
  assert.equal(periodError({ from: "", to: "" }), "");
  assert.equal(dashboardPeriodQuery({ from: "", to: "" }), "");
});
test("every supported metric drilldown preserves the selected cohort", () => {
  for (const title of [
    "Total Users",
    "Total Drivers",
    "Total Vehicles",
    "Total Bookings",
    "Completed",
    "Cancelled",
  ]) {
    const url = new URL(
      dashboardDestination("admin", title, {
        from: "2026-10-01",
        to: "2026-10-15",
      }),
      "http://localhost",
    );
    assert.equal(url.searchParams.get("from"), "2026-10-01");
    assert.equal(url.searchParams.get("to"), "2026-10-15");
  }
});
