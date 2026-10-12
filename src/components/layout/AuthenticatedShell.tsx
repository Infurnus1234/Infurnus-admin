import { redirect } from "next/navigation";
import { currentIdentity, refreshCookie } from "@/lib/backend-session";
import { cookies, headers } from "next/headers";
import { sessionReturnPath } from "@/lib/session-return";
import { AppShell } from "./AppShell";
import type { AdminPermission } from "@/types";
import { PermissionDenied } from "../PermissionDenied";

export async function AuthenticatedShell({
  children,
  superOnly = false,
}: {
  children: React.ReactNode;
  superOnly?: boolean;
}) {
  const identity = await currentIdentity();
  const returnTo = sessionReturnPath(
    (await headers()).get("x-infurnus-workspace-path"),
  );
  if (!identity)
    redirect(
      (await cookies()).get(refreshCookie)?.value
        ? "/session/restore" +
            (returnTo ? "?returnTo=" + encodeURIComponent(returnTo) : "")
        : "/login",
    );
  if (superOnly && identity.role !== "super_admin") return <PermissionDenied />;
  const role = identity.role === "super_admin" ? "super-admin" : "admin";
  // Navigation is a presentation aid; the backend enforces every operation.
  const permissions: AdminPermission[] = [
    "VIEW_DASHBOARD",
    "VIEW_USERS",
    "VIEW_PARTNERS",
    "VIEW_VEHICLES",
    "VIEW_FLEETS",
    "VIEW_RIDES",
    "VIEW_COUPONS",
    "VIEW_NOTIFICATIONS",
    "VIEW_SUPPORT",
    "VIEW_REPORTS",
    "VIEW_DRIVERS",
    "VIEW_DRIVER_REQUESTS",
    "VIEW_APPROVALS",
  ];
  if (identity.role === "super_admin")
    permissions.push("VIEW_PAYMENTS", "VIEW_AUDIT_LOGS");
  return (
    <AppShell
      role={role}
      user={{
        name: `${identity.firstName} ${identity.lastName}`,
        email: identity.email,
        role,
        permissions,
      }}
    >
      {children}
    </AppShell>
  );
}
