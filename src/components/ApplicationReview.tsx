"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  UserRound,
  ShieldCheck,
  FileText,
  Clock,
} from "lucide-react";
import { PageHeader } from "./layout/PageHeader";
import { Modal } from "./ui/Modal";
import { DocumentsPanel, type SubmittedDocument } from "./DocumentsPanel";
import { useBackendQuery } from "@/lib/use-backend-query";
import { adminApi } from "@/lib/admin-api";
import { reviewReturnPath } from "@/lib/review-context";
import {
  requesterName,
  requesterRole,
  requestLabel,
  requestTarget,
  requestTimestamp,
  reviewPayload,
  roleLabel,
  type ApprovalDetails,
} from "@/lib/request-models";
export function ApplicationReview({
  id,
  role,
}: {
  id: string;
  role: "admin" | "super-admin";
}) {
  const params = useSearchParams();
  const back = reviewReturnPath(params.get("returnTo"), role);
  const {
    data: detail,
    busy: loading,
    error: readError,
    refresh,
  } = useBackendQuery<ApprovalDetails>(`/provider-approvals/${id}`);
  const [reason, setReason] = useState(""),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | null>(
    null,
  );
  async function save() {
    if (!detail || !decision) return;
    setSaving(true);
    setError("");
    try {
      await adminApi(
        `/provider-approvals/${id}/review`,
        "POST",
        reviewPayload(detail, decision, reason),
      );
      setDecision(null);
      setNotice("Decision persisted by the backend.");
      refresh();
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Decision failed. Reload and retry.",
      );
    } finally {
      setSaving(false);
    }
  }
  if (loading)
    return (
      <section className="workspace-section">
        <Link href={back} className="action-link">
          <ArrowLeft size={16} />
          Back to requests
        </Link>
        <div className="review-card" role="status">
          Loading application and authorized evidence…
        </div>
      </section>
    );
  if (!detail)
    return (
      <section className="workspace-section">
        <Link href={back}>Back to requests</Link>
        <div className="review-card">
          <h1>Application unavailable</h1>
          <p role="alert">
            {readError || "This request could not be found or is inaccessible."}
          </p>
          <button onClick={refresh}>Retry</button>
        </div>
      </section>
    );
  const documents: SubmittedDocument[] = detail.documents.map((doc) => ({
    id: doc.id,
    label: requestLabel(doc.document_code || doc.document_type),
    status: doc.verification_status || doc.status || "UNKNOWN",
    mimeType: doc.mime_type,
    number: doc.document_metadata?.documentNumber,
    createdAt: doc.created_at,
    reviewedAt: doc.verified_at || doc.reviewed_at,
    reason: doc.rejection_reason,
    expiresAt: doc.document_metadata?.expiresAt,
    pages: doc.pages || [],
  }));
  const canReview =
    detail.request.status === "PENDING" && detail.request.can_review !== false;
  const target = detail.target;
  return (
    <section className="workspace-section">
      <PageHeader
        title="Application review"
        description="Inspect the submitted information and actual evidence before making a decision."
        breadcrumbs={[
          { label: "Verification Requests", href: back },
          { label: "Application review" },
        ]}
        actions={
          <Link href={back} className="admin-button admin-button-secondary">
            <ArrowLeft size={16} />
            Back to requests
          </Link>
        }
      />
      <header className="application-hero review-card">
        <div className="application-avatar">
          <UserRound size={32} />
        </div>
        <div>
          <h2>{requesterName(detail.request)}</h2>
          <p>
            {requesterRole(detail.request)} ·{" "}
            {requestLabel(detail.request.request_type)}
          </p>
          <small>Application {id}</small>
        </div>
        <span className="status-badge" data-status={detail.request.status}>
          {requestLabel(detail.request.status)}
        </span>
      </header>
      {notice && (
        <p role="status" className="review-success">
          {notice}
        </p>
      )}
      {(error || readError) && (
        <p role="alert" className="workspace-error">
          {error || readError}
        </p>
      )}
      <div className="application-layout">
        <div className="application-main">
          <section className="review-card">
            <h2>
              <UserRound size={18} />
              Applicant information
            </h2>
            <dl className="review-fields">
              <div>
                <dt>Name / business</dt>
                <dd>{requesterName(detail.request)}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{requesterRole(detail.request)}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{detail.request.requester_email || "Not provided"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{detail.request.requester_phone || "Not provided"}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{requestTimestamp(detail.request.submitted_at)}</dd>
              </div>
              <div>
                <dt>Target</dt>
                <dd>{requestTarget(detail.request)}</dd>
              </div>
            </dl>
          </section>
          {(target.license_number || target.license_expiry) && (
            <section className="review-card">
              <h2>
                <ShieldCheck size={18} />
                Driving licence
              </h2>
              <dl className="review-fields">
                <div>
                  <dt>Licence number</dt>
                  <dd>{target.license_number || "Not provided"}</dd>
                </div>
                <div>
                  <dt>Expiry</dt>
                  <dd>{requestTimestamp(target.license_expiry || null)}</dd>
                </div>
                <div>
                  <dt>Verification</dt>
                  <dd>
                    {requestLabel(target.verification_status || "UNKNOWN")}
                  </dd>
                </div>
              </dl>
            </section>
          )}
          {(target.address ||
            target.city ||
            target.state ||
            target.business_name ||
            target.plate_number) && (
            <section className="review-card">
              <h2>Related profile information</h2>
              <dl className="review-fields">
                {[
                  ["Address", target.address],
                  ["City", target.city],
                  ["State", target.state],
                  ["Business", target.business_name],
                  ["Vehicle registration", target.plate_number],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
              </dl>
            </section>
          )}
          <DocumentsPanel
            documents={documents}
            kind="approval"
            owner={id}
            initialDocumentId={detail.request.target_id}
          />
          <section className="review-card">
            <h2>
              <Clock size={18} />
              Verification history
            </h2>
            <ol className="review-timeline">
              {detail.history.map((event) => (
                <li key={event.id}>
                  <span className="status-badge" data-status={event.status}>
                    {requestLabel(event.status)}
                  </span>
                  <strong>
                    {event.reviewed_at
                      ? event.reviewer_display_name ||
                        "Reviewer name unavailable"
                      : "Awaiting review"}
                  </strong>
                  {event.reviewed_at && (
                    <span>{roleLabel(event.reviewer_account_role)}</span>
                  )}
                  <time>
                    {requestTimestamp(
                      event.reviewed_at || event.submitted_at || null,
                    )}
                  </time>
                  {event.rejection_reason && <p>{event.rejection_reason}</p>}
                </li>
              ))}
            </ol>
          </section>
        </div>
        <aside className="application-actions">
          <section className="review-card">
            <h2>
              <FileText size={18} />
              Review decision
            </h2>
            <p className="admin-muted">
              Decisions use the current backend state and version. An approval
              label does not replace evidence inspection.
            </p>
            <label>
              Review reason
              <textarea
                value={reason}
                maxLength={1000}
                disabled={saving || !canReview}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Required when rejecting an application"
              />
            </label>
            <div className="review-actions">
              <button
                className="workspace-primary"
                disabled={saving || !canReview}
                onClick={() => setDecision("APPROVED")}
              >
                Approve application
              </button>
              <button
                className="admin-button-danger"
                disabled={saving || !canReview || !reason.trim()}
                onClick={() => setDecision("REJECTED")}
              >
                Reject application
              </button>
            </div>
            {!canReview && (
              <p className="admin-muted">
                This request is reviewed or your account cannot review this
                resource.
              </p>
            )}
            <button disabled={saving} onClick={refresh}>
              Reload current version
            </button>
            <p className="admin-muted">
              Correction requests are available only in the existing fleet
              application workflow; this request API supports approval and
              rejection.
            </p>
          </section>
        </aside>
      </div>
      <Modal
        isOpen={!!decision}
        onClose={() => {
          if (!saving) setDecision(null);
        }}
        title={
          decision === "APPROVED" ? "Confirm approval" : "Confirm rejection"
        }
        footer={
          <>
            <button disabled={saving} onClick={() => setDecision(null)}>
              Cancel
            </button>
            <button
              disabled={saving}
              className="primary-action"
              onClick={() => void save()}
            >
              {saving ? "Saving…" : "Confirm decision"}
            </button>
          </>
        }
      >
        <p>
          {decision === "APPROVED" ? "Approve" : "Reject"} the application from{" "}
          {requesterName(detail.request)}?
        </p>
        <p>{reason.trim() || "No review reason supplied."}</p>
        {error && <p role="alert">{error}</p>}
      </Modal>
    </section>
  );
}
