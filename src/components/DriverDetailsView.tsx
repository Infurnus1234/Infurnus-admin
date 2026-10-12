"use client";
import { useState } from "react";
import Link from "next/link";
import { UserRound, ArrowLeft, Car, ShieldCheck } from "lucide-react";
import { PageHeader } from "./layout/PageHeader";
import { Modal } from "./ui/Modal";
import { DocumentsPanel, type SubmittedDocument } from "./DocumentsPanel";
import { useBackendQuery } from "@/lib/use-backend-query";
import { adminApi } from "@/lib/admin-api";
import {
  requestLabel,
  requestTimestamp,
  roleLabel,
} from "@/lib/request-models";
interface DriverRecord {
  id: string;
  role?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  verificationStatus: string;
  rejectionReason?: string;
  availabilityStatus?: string;
  createdAt?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email?: string;
    phone?: string;
    status: string;
  };
  documents: {
    id: string;
    documentType: string;
    documentCode?: string;
    documentNumber?: string;
    mimeType?: string;
    verificationStatus: string;
    rejectionReason?: string;
    createdAt?: string;
    verifiedAt?: string;
    expiresAt?: string;
    pages: SubmittedDocument["pages"];
  }[];
  vehicles: {
    id: string;
    plateNumber: string;
    make: string;
    model: string;
    verificationStatus: string;
    isActive: boolean;
  }[];
  applications?: {
    id: string;
    partnerBusinessName?: string;
    status: string;
    reviewReason?: string;
    submittedAt?: string;
    reviewedAt?: string;
  }[];
}
export function DriverDetailsView({
  id,
  role,
}: {
  id: string;
  role: "admin" | "super-admin";
}) {
  const {
    data: driver,
    busy,
    error: readError,
    refresh,
  } = useBackendQuery<DriverRecord>(`/admin/drivers/${id}`);
  const [status, setStatus] = useState<string | null>(null),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  async function save() {
    if (!driver || !status) return;
    setSaving(true);
    setError("");
    try {
      await adminApi(`/admin/users/${driver.user.id}/status`, "PATCH", {
        status,
      });
      setStatus(null);
      setNotice("Account status saved by the backend.");
      refresh();
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Status update failed",
      );
    } finally {
      setSaving(false);
    }
  }
  const parent = `/${role}/drivers`;
  if (busy)
    return (
      <div className="review-card" role="status">
        Loading driver details…
      </div>
    );
  if (!driver)
    return (
      <div className="review-card">
        <h1>Driver unavailable</h1>
        <p role="alert">
          {readError || "This driver record is not accessible."}
        </p>
        <button onClick={refresh}>Retry</button>
        <Link href={parent}>Return to drivers</Link>
      </div>
    );
  const name =
    [driver.user.firstName, driver.user.lastName].filter(Boolean).join(" ") ||
    "Name unavailable";
  const documents: SubmittedDocument[] = driver.documents.map((doc) => ({
    id: doc.id,
    label: requestLabel(doc.documentCode || doc.documentType),
    status: doc.verificationStatus,
    number: doc.documentNumber,
    mimeType: doc.mimeType,
    createdAt: doc.createdAt,
    reviewedAt: doc.verifiedAt,
    reason: doc.rejectionReason,
    expiresAt: doc.expiresAt,
    pages: doc.pages || [],
  }));
  return (
    <section className="workspace-section">
      <PageHeader
        title="Driver details"
        description="Account, licence, vehicle associations and actual submitted evidence."
        breadcrumbs={[{ label: "Drivers", href: parent }, { label: name }]}
        actions={
          <Link className="admin-button admin-button-secondary" href={parent}>
            <ArrowLeft size={16} />
            Back to drivers
          </Link>
        }
      />
      <header className="application-hero review-card">
        <div className="application-avatar">
          <UserRound />
        </div>
        <div>
          <h2>{name}</h2>
          <p>
            {roleLabel(driver.user.role || driver.role)} ·{" "}
            {driver.user.email || "Email not provided"}
          </p>
          <small>Driver {driver.id}</small>
        </div>
        <span
          className="status-badge"
          data-status={driver.verificationStatus.toUpperCase()}
        >
          {requestLabel(driver.verificationStatus)}
        </span>
      </header>
      {notice && (
        <p role="status" className="review-success">
          {notice}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      <div className="application-layout">
        <div className="application-main">
          <section className="review-card">
            <h2>Personal and contact information</h2>
            <dl className="review-fields">
              {[
                ["Full name", name],
                ["Phone", driver.user.phone],
                ["Email", driver.user.email],
                ["Date of birth", driver.dob],
                ["Gender", driver.gender],
                ["Address", driver.address],
                ["City", driver.city],
                ["State", driver.state],
                ["Postal code", driver.pinCode],
                [
                  "Registered",
                  driver.createdAt
                    ? requestTimestamp(driver.createdAt)
                    : undefined,
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value || "Not provided"}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="review-card">
            <h2>
              <ShieldCheck size={18} />
              Licence and verification
            </h2>
            <dl className="review-fields">
              <div>
                <dt>Licence number</dt>
                <dd>{driver.licenseNumber || "Not provided"}</dd>
              </div>
              <div>
                <dt>Licence expiry</dt>
                <dd>
                  {driver.licenseExpiry
                    ? requestTimestamp(driver.licenseExpiry)
                    : "Not provided"}
                </dd>
              </div>
              <div>
                <dt>Verification</dt>
                <dd>{requestLabel(driver.verificationStatus)}</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>{requestLabel(driver.availabilityStatus || "UNKNOWN")}</dd>
              </div>
            </dl>
            {driver.rejectionReason && (
              <p className="review-comment">{driver.rejectionReason}</p>
            )}
          </section>
          <DocumentsPanel
            initialDocumentId={
              driver.documents.find(
                (document) => document.documentCode === "DRIVING_LICENCE",
              )?.id
            }
            documents={documents}
            owner={driver.id}
            kind="driver"
          />
          <section className="review-card">
            <h2>
              <Car size={18} />
              Associated vehicles
            </h2>
            {driver.vehicles.length ? (
              <div className="review-related-records">
                {driver.vehicles.map((vehicle) => (
                  <Link
                    href={`/${role}/vehicles/${vehicle.id}`}
                    key={vehicle.id}
                  >
                    <strong>{vehicle.plateNumber}</strong>
                    <span>
                      {vehicle.make} {vehicle.model}
                    </span>
                    <span>
                      {requestLabel(vehicle.verificationStatus)} ·{" "}
                      {vehicle.isActive ? "Active" : "Inactive"}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No associated vehicle records.</p>
            )}
          </section>
          <section className="review-card">
            <h2>Fleet application history</h2>
            {driver.applications?.length ? (
              <ol className="review-timeline">
                {driver.applications.map((app) => (
                  <li key={app.id}>
                    <strong>
                      {app.partnerBusinessName || "Business name unavailable"}
                    </strong>
                    <span>{requestLabel(app.status)}</span>
                    <time>
                      {requestTimestamp(
                        app.reviewedAt || app.submittedAt || null,
                      )}
                    </time>
                    {app.reviewReason && <p>{app.reviewReason}</p>}
                  </li>
                ))}
              </ol>
            ) : (
              <p>No fleet application history returned.</p>
            )}
          </section>
        </div>
        <aside className="application-actions">
          <section className="review-card">
            <h2>Account actions</h2>
            <p>
              Current status:{" "}
              <span
                className="status-badge"
                data-status={driver.user.status.toUpperCase()}
              >
                {requestLabel(driver.user.status)}
              </span>
            </p>
            {["active", "suspended", "banned"]
              .filter((value) => value !== driver.user.status)
              .map((value) => (
                <button
                  key={value}
                  disabled={saving}
                  onClick={() => setStatus(value)}
                >
                  {value === "active" ? "Restore account" : `Set ${value}`}
                </button>
              ))}
            <Link
              className="action-link"
              href={`/${role}/driver-requests?status=ALL&q=${encodeURIComponent(name)}`}
            >
              Open verification requests
            </Link>
            <button disabled={saving} onClick={refresh}>
              Refresh driver details
            </button>
            <p className="admin-muted">
              Availability and assignments remain controlled by their existing
              backend workflows.
            </p>
          </section>
        </aside>
      </div>
      <Modal
        isOpen={!!status}
        onClose={() => {
          if (!saving) setStatus(null);
        }}
        title="Confirm account status"
        footer={
          <>
            <button disabled={saving} onClick={() => setStatus(null)}>
              Cancel
            </button>
            <button
              className="primary-action"
              disabled={saving}
              onClick={() => void save()}
            >
              {saving ? "Saving…" : "Confirm change"}
            </button>
          </>
        }
      >
        <p>
          Change {name}&apos;s account status to {status}?
        </p>
        {error && <p role="alert">{error}</p>}
      </Modal>
    </section>
  );
}
