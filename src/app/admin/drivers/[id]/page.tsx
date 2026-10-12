import { notFound } from "next/navigation";
import { DriverDetailsView } from "@/components/DriverDetailsView";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[\da-f-]{36}$/i.test(id)) notFound();
  return <DriverDetailsView id={id} role="admin" />;
}
