"use client";
import { useCallback, useState, useSyncExternalStore } from "react";
import {
  sidebarPreferenceKey,
  sidebarIsCollapsed,
  sidebarLayout,
} from "./sidebar-state";
const desktopQuery = "(min-width:1024px)";
function subscribeViewport(notify: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
export function useSidebarState(accountId: string, role: string) {
  const key = sidebarPreferenceKey(accountId, role);
  const mobile = useSyncExternalStore(
    subscribeViewport,
    () => !window.matchMedia(desktopQuery).matches,
    () => false,
  );
  const stored = useSyncExternalStore(
    useCallback(
      (notify: () => void) => {
        const sync = (event: StorageEvent) => {
          if (event.key === key || event.key === null) notify();
        };
        window.addEventListener("storage", sync);
        window.addEventListener("infurnus-sidebar-change", notify);
        return () => {
          window.removeEventListener("storage", sync);
          window.removeEventListener("infurnus-sidebar-change", notify);
        };
      },
      [key],
    ),
    useCallback(() => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }, [key]),
    () => null,
  );
  const [fallback, setFallback] = useState<{
    key: string;
    collapsed: boolean;
  } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed =
    fallback?.key === key ? fallback.collapsed : sidebarIsCollapsed(stored);
  const layout = sidebarLayout(mobile, mobileOpen, collapsed);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  function toggle() {
    if (mobile) setMobileOpen((open) => !open);
    else {
      try {
        localStorage.setItem(key, String(!collapsed));
        setFallback(null);
        window.dispatchEvent(new Event("infurnus-sidebar-change"));
      } catch {
        setFallback({ key, collapsed: !collapsed });
      }
    }
    requestAnimationFrame(() =>
      document
        .getElementById(layout.expanded ? "show-sidebar" : "hide-sidebar")
        ?.focus(),
    );
  }
  return { ...layout, toggle, closeMobile };
}
