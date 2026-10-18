export function sidebarPreferenceKey(accountId: string, role: string) {
  return `infurnus.sidebar.collapsed.v1:${encodeURIComponent(accountId)}:${role}`;
}
export function sidebarIsCollapsed(value: string | null) {
  return value === "true";
}
export function sidebarLayout(
  mobile: boolean,
  mobileOpen: boolean,
  collapsed: boolean,
) {
  return {
    expanded: mobile ? mobileOpen : !collapsed,
    inertContent: mobile && mobileOpen,
  };
}
