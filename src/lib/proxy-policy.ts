export function allowedBackendPath(method: string, path: string): boolean {
  const uuid = "[\\da-f-]{36}";
  if (
    method === "POST" &&
    /^\/auth\/(login|login\/verify|login\/resend|refresh|logout)$/.test(path)
  )
    return true;
  if (
    method === "GET" &&
    [
      "/provider-approvals",
      "/admin/drivers",
      "/admin/drivers/applications",
    ].includes(path)
  )
    return true;
  if (
    method === "GET" &&
    new RegExp(`^/(provider-approvals|admin/drivers)/${uuid}$`, "i").test(path)
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
