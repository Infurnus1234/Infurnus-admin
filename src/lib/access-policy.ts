export function pagePermission(path: string): string | null {
  const segments = path.split("?")[0].split("/").filter(Boolean);
  const moduleName = segments[1] || "dashboard";
  const resource =
    (
      {
        map: "fleet",
        "driver-requests": "approvals",
        approvals: "approvals",
        fleets: "fleet",
        "audit-logs": "activity",
        finance: "payments",
        bookings: "reports",
      } as Record<string, string>
    )[moduleName] || moduleName;
  const supported = [
    "dashboard",
    "users",
    "drivers",
    "partners",
    "vehicles",
    "pricing",
    "fleet",
    "approvals",
    "rides",
    "logistics",
    "rentals",
    "payments",
    "wallets",
    "transactions",
    "settlements",
    "commission",
    "refunds",
    "coupons",
    "support",
    "notifications",
    "activity",
    "reports",
  ];
  if (!supported.includes(resource)) return null;
  const detail =
    segments.length > 2 &&
    ["users", "drivers", "partners", "vehicles", "fleet", "approvals"].includes(
      resource,
    );
  return `${resource}.${detail ? "detail" : "read"}`;
}
export function canOpenPage(
  role: string,
  grants: readonly string[],
  path: string,
  scoped = false,
) {
  if (role === "super_admin") return true;
  const key = pagePermission(path);
  if (role !== "admin" || !key || scoped) return false;
  return (
    grants.includes(key) &&
    (!key.endsWith(".detail") ||
      grants.includes(key.replace(".detail", ".read")))
  );
}
