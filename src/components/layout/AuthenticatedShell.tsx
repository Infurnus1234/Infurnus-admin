import { redirect } from "next/navigation";
import { currentIdentity, refreshCookie } from "@/lib/backend-session";
import { cookies, headers } from "next/headers";
import { sessionReturnPath } from "@/lib/session-return";
import { AppShell } from "./AppShell";
import { canOpenPage } from "@/lib/access-policy";
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
  if (
    !canOpenPage(
      identity.role,
      identity.permissions || [],
      returnTo || (superOnly ? "/super-admin" : "/admin"),
      identity.scoped,
    )
  )
    return <PermissionDenied />;
  const role = identity.role === "super_admin" ? "super-admin" : "admin";
  // Navigation is a presentation aid; the backend enforces every operation.
  const permissions = identity.permissions || [];
  return (
    <AppShell
      role={role}
      user={{
        id: identity.id,
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
