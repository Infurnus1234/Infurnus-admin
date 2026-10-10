import { redirect } from "next/navigation";
import { currentIdentity } from "@/lib/backend-session";
import { AppShell } from "./AppShell";
import type { AdminPermission } from "@/types";

export async function AuthenticatedShell({
  children,
  superOnly = false,
}: {
  children: React.ReactNode;
  superOnly?: boolean;
}) {
  const identity = await currentIdentity();
  if (!identity) redirect("/login");
  if (superOnly && identity.role !== "super_admin")
    redirect("/admin/driver-requests");
  const role = identity.role === "super_admin" ? "super-admin" : "admin";
  // Navigation is a presentation aid; the backend enforces every operation.
  const permissions: AdminPermission[] = [
    "VIEW_DRIVERS",
    "VIEW_DRIVER_REQUESTS",
    "VIEW_APPROVALS",
  ];
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
