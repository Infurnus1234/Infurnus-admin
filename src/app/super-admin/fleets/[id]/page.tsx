import { notFound } from "next/navigation";
import { RecordDetails } from "@/components/RecordDetails";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[\da-f-]{36}$/i.test(id)) notFound();
  return <RecordDetails module="fleets" id={id} role="super-admin" />;
}
