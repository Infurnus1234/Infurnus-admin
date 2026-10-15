export type WorkspaceRole = "admin" | "super-admin";
export type BookingGroup = "all" | "completed" | "cancelled";
export function dashboardDestination(
  role: WorkspaceRole,
  title: string,
  period: { from: string; to: string },
) {
  const target: Record<string, string> = {
    "Total Users": "users?role=all",
    "Total Drivers": "drivers",
    "Total Vehicles": "vehicles",
    "Total Bookings": "bookings?group=all",
    Completed: "bookings?group=completed",
    Cancelled: "bookings?group=cancelled",
  };
  // Undefined vendor/revenue metrics have no authorized business definition.
  if (!target[title]) return null;
  const url = new URL(`/${role}/${target[title]}`, "https://local.invalid");
  if (
    title === "Total Users" ||
    title === "Total Drivers" ||
    title === "Total Vehicles" ||
    title === "Total Bookings" ||
    title === "Completed" ||
    title === "Cancelled"
  ) {
    if (period.from) url.searchParams.set("from", period.from);
    if (period.to) url.searchParams.set("to", period.to);
  }
  return url.pathname + url.search;
}
export function bookingGroupStatus(
  group: string,
  module: "rides" | "logistics" | "rentals",
) {
  if (group === "completed")
    return { rides: "completed", logistics: "DELIVERED", rentals: "COMPLETED" }[
      module
    ];
  if (group === "cancelled")
    return module === "rides" ? "cancelled" : "CANCELLED";
  return "";
}
export function recordReturnPath(
  value: string | null | undefined,
  role: WorkspaceRole,
  module: string,
) {
  const fallback = `/${role}/${module}`;
  if (
    !value ||
    value.includes("\\") ||
    value.startsWith("//") ||
    !value.startsWith("/") ||
    value.length > 1200
  )
    return fallback;
  const url = new URL(value, "https://local.invalid");
  return [fallback, `/${role}/bookings`].includes(url.pathname)
    ? url.pathname + url.search
    : fallback;
}
