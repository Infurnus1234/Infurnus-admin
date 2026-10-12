/** Only local workspace URLs can be restored; authorization still runs on the destination. */
export function sessionReturnPath(
  value: string | null | undefined,
): string | null {
  if (!value || value.length > 2048 || /[\\\r\n]/.test(value)) return null;
  if (!/^\/(admin|super-admin)(?:\/|\?|$)/.test(value)) return null;
  const url = new URL(value, "https://workspace.invalid");
  if (
    url.origin !== "https://workspace.invalid" ||
    !/^\/(admin|super-admin)(?:\/|$)/.test(url.pathname)
  )
    return null;
  return url.pathname + url.search;
}
