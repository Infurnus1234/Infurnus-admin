import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { accessCookie, backendFetch, currentIdentity } from "@/lib/backend-session";
import type { DriverDetails } from "@/lib/request-models";

interface DriverDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = { title: "INFURNUS | Driver details" };

export default async function DriverDetailsPage({ params }: DriverDetailsPageProps) {
  const { id } = await params;
  const identity = await currentIdentity();
  if (!identity) redirect("/login");
  if (identity.role !== "super_admin") redirect("/admin/drivers");
  if (!/^[\da-f-]{36}$/i.test(id)) notFound();
  const token = (await cookies()).get(accessCookie)!.value;
  const response = await backendFetch(`/admin/drivers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Unable to retrieve Driver details");
  const driver = (await response.json()).data as DriverDetails;
  return <article><h1>{driver.user.firstName} {driver.user.lastName}</h1><p>Verification: {driver.verificationStatus}; Account: {driver.user.status}</p><p>{driver.rejectionReason}</p><h2>Documents</h2>{driver.documents.map(document => <p key={document.id}>{document.documentType}: {document.verificationStatus}</p>)}<Link href="/super-admin/drivers">Return to drivers and authorized account/document actions</Link></article>;
}
