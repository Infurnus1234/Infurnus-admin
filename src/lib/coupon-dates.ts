/** Input validation only; eligibility and promotion policy remain on the backend. */
export function couponDates(startsAt: string, expiresAt: string) {
  const start = new Date(startsAt);
  if (!startsAt || !Number.isFinite(start.getTime()))
    throw new Error("Enter a valid start date and time.");
  const expiry = expiresAt ? new Date(expiresAt) : null;
  if (expiry && (!Number.isFinite(expiry.getTime()) || expiry <= start))
    throw new Error("Expiry must be a valid date and time after the start.");
  return {
    startsAt: start.toISOString(),
    expiresAt: expiry?.toISOString() ?? null,
  };
}
