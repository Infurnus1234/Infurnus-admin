export const DASHBOARD_TIME_ZONE = "Asia/Kolkata";
export type DashboardPeriod = { from: string; to: string };
export function presetPeriod(days: number, now = new Date()): DashboardPeriod {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: DASHBOARD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) =>
    parts.find((part) => part.type === type)!.value;
  const to = `${value("year")}-${value("month")}-${value("day")}`;
  const start = new Date(to + "T00:00:00Z");
  start.setUTCDate(start.getUTCDate() - days + 1);
  return { from: start.toISOString().slice(0, 10), to };
}
export function periodError(period: DashboardPeriod): string {
  for (const date of [period.from, period.to]) {
    if (!date) continue;
    const parsed = new Date(date + "T00:00:00Z");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date
    )
      return "Choose valid calendar dates.";
  }
  return period.from && period.to && period.from > period.to
    ? "The start date must be on or before the end date."
    : "";
}
export function dashboardPeriodQuery(period: DashboardPeriod): string {
  const query = new URLSearchParams();
  if (period.from) query.set("from", period.from);
  if (period.to) query.set("to", period.to);
  return query.toString();
}
