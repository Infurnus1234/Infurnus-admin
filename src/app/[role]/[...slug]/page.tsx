import { notFound } from "next/navigation";
import { MASTER_NAVIGATION_CONFIG } from "@/config/navigation";
import { AuthenticatedShell } from "@/components/layout/AuthenticatedShell";
import { UnavailableModule } from "@/components/UnavailableModule";
import { OperationsRecords } from "@/components/OperationsRecords";
import { PricingConfiguration } from "@/components/PricingConfiguration";
import { OperationsReports } from "@/components/OperationsReports";
import { operationConfigs, type ModuleKey } from "@/lib/operations";
export default async function Page({
  params,
}: {
  params: Promise<{ role: string; slug: string[] }>;
}) {
  const { role, slug } = await params;
  if (role !== "admin" && role !== "super-admin") notFound();
  const item = MASTER_NAVIGATION_CONFIG.find(
    (item) => item.path === slug.join("/"),
  );
  if (!item) notFound();
  const moduleKey = slug.join("/") as ModuleKey;
  const config = operationConfigs[moduleKey];
  return (
    <AuthenticatedShell
      superOnly={role === "super-admin" || !!config?.superOnly}
    >
      {slug.join("/") === "reports" ? (
        <OperationsReports />
      ) : slug.join("/") === "pricing" ? (
        <PricingConfiguration />
      ) : config ? (
        <OperationsRecords module={moduleKey} />
      ) : (
        <UnavailableModule title={item.title} role={role} />
      )}
    </AuthenticatedShell>
  );
}
