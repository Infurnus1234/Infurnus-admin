export function allowedBackendPath(method: string, path: string): boolean {
  if (
    method === "DELETE" &&
    /^\/admin\/records\/(users|drivers|admins|partners|vehicles|vehicle-types|coupons)\/[\da-f-]{36}$/i.test(
      path,
    )
  )
    return true;
  const uuid = "[\\da-f-]{36}";
  if (
    method === "GET" &&
    ["/admin/access/me", "/admin/access/admins"].includes(path)
  )
    return true;
  if (method === "POST" && path === "/admin/access/admins") return true;
  if (
    method === "PATCH" &&
    new RegExp(`^/admin/access/admins/${uuid}/(permissions|status)$`, "i").test(
      path,
    )
  )
    return true;
  if (method === "POST" && path === "/vehicles") return true;
  if (
    ["GET", "PATCH"].includes(method) &&
    new RegExp(`^/vehicles/${uuid}$`, "i").test(path)
  )
    return true;
  if (
    method === "POST" &&
    new RegExp(`^/vehicles/${uuid}/deactivate$`, "i").test(path)
  )
    return true;
  if (method === "POST" && ["/maps/geocode", "/maps/route"].includes(path))
    return true;
  if (method === "POST" && path === "/admin/vehicle-types") return true;
  if (method === "POST" && path === "/admin/operations/coupons") return true;
  if (
    method === "PATCH" &&
    new RegExp(`^/admin/operations/support/${uuid}/status$`, "i").test(path)
  )
    return true;
  if (
    method === "PATCH" &&
    new RegExp(`^/admin/operations/coupons/${uuid}/active$`, "i").test(path)
  )
    return true;
  if (
    method === "PATCH" &&
    new RegExp(`^/admin/vehicle-types/${uuid}$`, "i").test(path)
  )
    return true;
  if (method === "POST" && /^\/auth\/(admin\/login|refresh|logout)$/.test(path))
    return true;
  if (
    method === "GET" &&
    [
      "/provider-approvals",
      "/admin/drivers",
      "/admin/drivers/applications",
      "/admin/dashboard",
      "/admin/users",
      "/admin/partners",
      "/admin/vehicles",
      "/admin/vehicle-types",
      "/admin/fleet/analytics",
      "/admin/fleet/vehicles",
    ].includes(path)
  )
    return true;
  if (
    method === "GET" &&
    /^\/admin\/operations\/(commission|refunds|summary|rides|logistics|rentals|payments|wallets|transactions|settlements|coupons|notifications|support|activity)$/.test(
      path,
    )
  )
    return true;
  if (
    method === "GET" &&
    new RegExp(
      `^/(provider-approvals|admin/drivers|admin/users|admin/vehicles|admin/partners|admin/fleet/vehicles)/${uuid}$`,
      "i",
    ).test(path)
  )
    return true;
  if (
    method === "GET" &&
    new RegExp(
      `^/admin/drivers/${uuid}/documents/${uuid}/access-url$`,
      "i",
    ).test(path)
  )
    return true;
  if (
    method === "GET" &&
    new RegExp(
      `^/provider-approvals/${uuid}/documents/${uuid}/access-url$`,
      "i",
    ).test(path)
  )
    return true;
  if (
    method === "POST" &&
    new RegExp(
      `^/(provider-approvals/${uuid}|admin/drivers/applications/${uuid})/review$`,
      "i",
    ).test(path)
  )
    return true;
  return (
    method === "PATCH" &&
    new RegExp(`^/admin/users/${uuid}/status$`, "i").test(path)
  );
}

export function sameOriginMutation(
  method: string,
  origin: string | null,
  expected: string,
) {
  return method === "GET" || origin === expected;
}

export function proxyOrigin(
  configured: string | undefined,
  development: boolean,
  host: string | null,
  fallback: string,
) {
  if (configured) return configured;
  // Next dev normalizes nextUrl to localhost even for 127.0.0.1 requests.
  if (
    development &&
    host &&
    /^(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/.test(host)
  )
    return `http://${host}`;
  return fallback;
}
