import { notFound } from "next/navigation";
import { MASTER_NAVIGATION_CONFIG } from "@/config/navigation";
import { AuthenticatedShell } from "@/components/layout/AuthenticatedShell";
import { UnavailableModule } from "@/components/UnavailableModule";
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
  return (
    <AuthenticatedShell superOnly={role === "super-admin"}>
      <UnavailableModule title={item.title} role={role} />
    </AuthenticatedShell>
  );
}
