export function reviewReturnPath(
  value: string | null | undefined,
  role: "admin" | "super-admin",
) {
  const fallback = `/${role}/driver-requests`;
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.length > 1200
  )
    return fallback;
  const url = new URL(value, "https://local.invalid");
  return [`/${role}/driver-requests`, `/${role}/approvals`].includes(
    url.pathname,
  )
    ? url.pathname + url.search
    : fallback;
}
