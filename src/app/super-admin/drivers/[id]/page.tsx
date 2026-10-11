import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  accessCookie,
  backendFetch,
  currentIdentity,
} from "@/lib/backend-session";
import type { DriverDetails } from "@/lib/request-models";

interface DriverDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = { title: "INFURNUS | Driver details" };

export default async function DriverDetailsPage({
  params,
}: DriverDetailsPageProps) {
  const { id } = await params;
  const identity = await currentIdentity();
  if (!identity) redirect("/login");
  if (identity.role !== "super_admin") redirect("/admin/drivers");
  if (!/^[\da-f-]{36}$/i.test(id)) notFound();
  const token = (await cookies()).get(accessCookie)!.value;
  const response = await backendFetch(`/admin/drivers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Unable to retrieve Driver details");
  const driver = (await response.json()).data as DriverDetails;
  return (
    <section className="workspace-section live-workspace">
      <PageHeader
        title={driver.user.firstName + " " + driver.user.lastName}
        description="Driver account and verification details"
        breadcrumbs={[
          { label: "Drivers", href: "/super-admin/drivers" },
          { label: "Details" },
        ]}
      />
      <article className="detail-panel workspace-note">
        <dl className="detail-list">
          <dt>Verification</dt>
          <dd>{driver.verificationStatus}</dd>
          <dt>Account</dt>
          <dd>{driver.user.status}</dd>
        </dl>
        {driver.rejectionReason && <p>{driver.rejectionReason}</p>}
        <h2>Documents</h2>
        {driver.documents.length ? (
          driver.documents.map((document) => (
            <p key={document.id}>
              {document.documentType}: {document.verificationStatus}
            </p>
          ))
        ) : (
          <p>No documents returned.</p>
        )}
        <Link className="action-link" href="/super-admin/drivers">
          Return to drivers
        </Link>
      </article>
    </section>
  );
}
