import { notFound } from "next/navigation";
import { MASTER_NAVIGATION_CONFIG } from "@/config/navigation";
import { AuthenticatedShell } from "@/components/layout/AuthenticatedShell";
import { hasAdminBackend } from "@/lib/feature-availability";
import { OperationsRecords } from "@/components/OperationsRecords";
import { PricingConfiguration } from "@/components/PricingConfiguration";
import { OperationsReports } from "@/components/OperationsReports";
import { operationConfigs, type ModuleKey } from "@/lib/operations";
import { RecordDetails } from "@/components/RecordDetails";
import { BookingsOverview } from "@/components/BookingsOverview";
import { FullFleetMap } from "@/components/FullFleetMap";
export default async function Page({
  params,
}: {
  params: Promise<{ role: string; slug: string[] }>;
}) {
  const { role, slug } = await params;
  if (role !== "admin" && role !== "super-admin") notFound();
  if (!hasAdminBackend(slug.join("/"))) notFound();
  if (slug.join("/") === "map")
    return (
      <AuthenticatedShell superOnly={role === "super-admin"}>
        <FullFleetMap role={role} />
      </AuthenticatedShell>
    );
  if (slug.join("/") === "bookings")
    return (
      <AuthenticatedShell superOnly={role === "super-admin"}>
        <BookingsOverview />
      </AuthenticatedShell>
    );
  const detail =
    slug.length === 2 &&
    /^[\da-f-]{36}$/i.test(slug[1]) &&
    Object.hasOwn(operationConfigs, slug[0]);
  if (detail) {
    const key = slug[0] as ModuleKey;
    return (
      <AuthenticatedShell superOnly={role === "super-admin"}>
        <RecordDetails module={key} id={slug[1]} role={role} />
      </AuthenticatedShell>
    );
  }
  const item =
    slug.join("/") === "audit-logs"
      ? { title: "Activity history" }
      : MASTER_NAVIGATION_CONFIG.find((item) => item.path === slug.join("/"));
  if (!item) notFound();
  const moduleKey = slug.join("/") as ModuleKey;
  const config = operationConfigs[moduleKey];
  if (slug.join("/") !== "reports" && slug.join("/") !== "pricing" && !config)
    notFound();
  return (
    <AuthenticatedShell superOnly={role === "super-admin"}>
      {slug.join("/") === "reports" ? (
        <OperationsReports />
      ) : slug.join("/") === "pricing" ? (
        <PricingConfiguration />
      ) : (
        <OperationsRecords module={moduleKey} />
      )}
    </AuthenticatedShell>
  );
}
