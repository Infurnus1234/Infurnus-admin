// Re-enable only when the corresponding backend contract and permission checks exist.
const unsupportedPages = new Set([
  "resources",
  "resource-scope",
  "security",
  "system-config",
  "features",
  "settings",
]);
export function hasAdminBackend(path: string): boolean {
  return !unsupportedPages.has(path.split("/")[0]);
}
