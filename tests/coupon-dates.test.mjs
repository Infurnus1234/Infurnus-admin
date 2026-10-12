import { test } from "node:test";
import assert from "node:assert/strict";
import { couponDates } from "../src/lib/coupon-dates.ts";
test("promo dates reject absent or invalid starts before confirmation", () => {
  for (const value of ["", "not-a-date"])
    assert.throws(() => couponDates(value, ""), /valid start/);
});
test("promo expiry must be valid and strictly later than start", () => {
  for (const value of ["bad", "2026-10-12T12:00", "2026-10-11T12:00"])
    assert.throws(
      () => couponDates("2026-10-12T12:00", value),
      /after the start/,
    );
});
test("valid local input becomes backend ISO dates; absent expiry stays null", () => {
  assert.equal(couponDates("2026-10-12T12:00", "").expiresAt, null);
  const result = couponDates("2026-10-12T12:00", "2026-10-13T12:00");
  assert.equal(
    new Date(result.expiresAt) - new Date(result.startsAt),
    86400000,
  );
});
