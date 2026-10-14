/** Convert explicitly entered reference bounds; never substitute a minimum for a maximum. */
export function perKmReferenceInput(form: {
  perKmRate: string;
  perKmRateMax: string;
}) {
  const amounts = [form.perKmRate, form.perKmRateMax].map((value) => {
    const amount = Number(value);
    if (
      !value.trim() ||
      !Number.isFinite(amount) ||
      amount < 0 ||
      amount > 99999999.99 ||
      !/^\d+(?:\.\d{1,2})?$/.test(String(amount))
    )
      throw Error(
        "Enter both per-km bounds using valid amounts with at most two decimal places.",
      );
    return Math.round(amount * 100);
  });
  if (amounts[1] < amounts[0])
    throw Error("Maximum per-km rate must be at least the minimum.");
  return { minimum: amounts[0], maximum: amounts[1] };
}
