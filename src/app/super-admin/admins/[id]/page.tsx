import { notFound } from "next/navigation";
import { AdminManagement } from "@/components/AdminManagement";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id))
    notFound();
  return <AdminManagement adminId={id} />;
}
