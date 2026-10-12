import { notFound } from "next/navigation";
import { ApplicationReview } from "@/components/ApplicationReview";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[\da-f-]{36}$/i.test(id)) notFound();
  return <ApplicationReview id={id} role="super-admin" />;
}
