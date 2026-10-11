"use client";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "./layout/PageHeader";
import { Modal } from "./ui/Modal";
import { useRouter } from "next/navigation";
import { adminApi, ApiError, documentAccessUrl } from "@/lib/admin-api";
import {
  ApprovalDetails,
  ApprovalRequest,
  reviewPayload,
  statusLabel,
  requestPage,
} from "@/lib/request-models";

export function ProviderRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [detail, setDetail] = useState<ApprovalDetails | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<"APPROVED" | "REJECTED" | null>(null);
  const filtered = requests.filter((row) =>
    [
      row.id,
      row.requester_id,
      row.request_type,
      row.target_id,
      row.status,
    ].some((value) =>
      (value || "").toLowerCase().includes(filter.toLowerCase()),
    ),
  );
  const currentPage = requestPage(page, filtered.length);
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10);
  const [lookupId, setLookupId] = useState("");
  const failure = (error: unknown) => {
    if (error instanceof ApiError && error.status === 401)
      router.replace("/login");
    setError(error instanceof Error ? error.message : "Request failed");
  };
  const load = useCallback(async () => {
    try {
      setRequests(await adminApi<ApprovalRequest[]>("/provider-approvals"));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        router.replace("/login");
      setError(
        error instanceof Error ? error.message : "Unable to load requests",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);
  useEffect(() => {
    let active = true;
    adminApi<ApprovalRequest[]>("/provider-approvals")
      .then((rows) => {
        if (active) setRequests(rows);
      })
      .catch((error) => {
        if (active) {
          if (error instanceof ApiError && error.status === 401)
            router.replace("/login");
          setError(
            error instanceof Error ? error.message : "Unable to load requests",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);
  async function open(id: string) {
    setBusy(true);
    setError("");
    setReason("");
    setDetail(null);
    try {
      setDetail(await adminApi<ApprovalDetails>(`/provider-approvals/${id}`));
    } catch (error) {
      failure(error);
    } finally {
      setBusy(false);
    }
  }
  async function review(status: "APPROVED" | "REJECTED") {
    if (!detail) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await adminApi(
        `/provider-approvals/${detail.request.id}/review`,
        "POST",
        reviewPayload(detail, status, reason),
      );
      setDetail(
        await adminApi<ApprovalDetails>(
          `/provider-approvals/${detail.request.id}`,
        ),
      );
      await load();
      setNotice("Decision saved successfully");
      setConfirm(null);
    } catch (error) {
      failure(error);
    } finally {
      setBusy(false);
    }
  }
  async function document(id: string, page: number) {
    if (!detail) return;
    setBusy(true);
    setError("");
    try {
      const accessUrl = await documentAccessUrl(
        detail.request.id,
        id,
        page,
        detail.documents.find((row) => row.id === id)?.pageCount || 1,
      );
      window.open(accessUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      failure(error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="workspace-section live-workspace">
      <PageHeader
        title="Provider approval requests"
        description="Review pending changes, supporting documents and decision history."
      />
      <div className="request-toolbar">
        <label className="filter-field">
          Filter loaded requests
          <input
            type="search"
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
              setPage(1);
            }}
            placeholder="ID, type, target or status"
          />
        </label>
        <button
          disabled={busy || loading}
          onClick={async () => {
            setLoading(true);
            setError("");
            await load();
            setPage(1);
          }}
        >
          Refresh
        </button>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (
              !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                lookupId.trim(),
              )
            ) {
              setError("Enter a valid request UUID.");
              return;
            }
            void open(lookupId.trim());
          }}
        >
          <label>
            Find a request by ID
            <input
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
              placeholder="Full request UUID"
              required
            />
          </label>
          <button disabled={busy || !lookupId.trim()}>Find request</button>
        </form>
      </div>
      <p className="workspace-caption">
        Up to 100 pending requests are supplied by the backend. Filtering
        applies to the loaded list; use a request ID to open reviewed history.
      </p>
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {loading ? (
        <p>Loading requests…</p>
      ) : requests.length === 0 ? (
        <p>
          {error
            ? "Requests could not be loaded. Resolve the error and retry."
            : "No pending requests"}
        </p>
      ) : (
        <div
          className="table-scroll"
          role="region"
          aria-label="Provider approval requests table"
          tabIndex={0}
        >
          <table className="operations-table requests-table">
            <caption className="sr-only">
              Pending provider approval requests
            </caption>
            <colgroup>
              <col className="col-requester" />
              <col className="col-type" />
              <col className="col-target" />
              <col className="col-date" />
              <col className="col-status" />
              <col className="col-action" />
            </colgroup>
            <thead>
              <tr>
                <th>Requester</th>
                <th>Request type</th>
                <th>Target</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="identifier" title={row.requester_id}>
                      {row.requester_id}
                    </span>

                    <span className="cell-secondary">
                      {statusLabel(row.requester_role)}
                    </span>
                  </td>
                  <td>
                    <span className="request-type">
                      {statusLabel(row.request_type)}
                    </span>
                  </td>
                  <td>
                    <span className="cell-secondary">
                      {statusLabel(row.target_type)}
                    </span>
                    <span className="identifier" title={row.target_id}>
                      {row.target_id}
                    </span>
                  </td>
                  <td>
                    <time dateTime={row.submitted_at} title={row.submitted_at}>
                      {new Date(row.submitted_at).toLocaleDateString()}
                      <span className="cell-secondary">
                        {new Date(row.submitted_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </time>
                  </td>
                  <td>
                    <span className="status-badge" data-status={row.status}>
                      {statusLabel(row.status)}
                    </span>
                  </td>
                  <td>
                    <button disabled={busy} onClick={() => open(row.id)}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && filtered.length === 0 && requests.length > 0 && (
        <p className="workspace-note">No requests match your filter.</p>
      )}
      {filtered.length > 0 && (
        <div className="pagination">
          <button
            disabled={busy || currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.max(1, Math.ceil(filtered.length / 10))}{" "}
            · {filtered.length} requests
          </span>
          <button
            disabled={busy || currentPage * 10 >= filtered.length}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
      {detail && (
        <Modal
          isOpen={!!detail}
          onClose={() => {
            if (!busy) {
              setDetail(null);
              setConfirm(null);
            }
          }}
          title="Request details"
          size="xl"
        >
          <article className="detail-panel">
            <p className="detail-id">Request {detail.request.id}</p>
            {error && <p role="alert">{error}</p>}
            {notice && <p role="status">{notice}</p>}
            <p>Status: {statusLabel(detail.request.status)}</p>
            <details>
              <summary>Full request identifiers and target version</summary>
              <dl className="detail-list">
                <dt>Requester</dt>
                <dd>{detail.request.requester_id}</dd>
                <dt>Target</dt>
                <dd>{detail.request.target_id}</dd>
                <dt>Version</dt>
                <dd>{detail.target.updated_at}</dd>
              </dl>
            </details>
            <h3>Documents</h3>
            {detail.documents.length ? (
              detail.documents.map((doc) => (
                <div key={doc.id}>
                  {doc.document_type}:{" "}
                  {statusLabel(doc.verification_status || doc.status)}{" "}
                  {Array.from(
                    { length: Math.min(5, doc.pageCount || 1) },
                    (_, i) => (
                      <button
                        key={i}
                        disabled={busy}
                        onClick={() => document(doc.id, i + 1)}
                      >
                        View page {i + 1}
                      </button>
                    ),
                  )}
                </div>
              ))
            ) : (
              <p>No documents returned</p>
            )}
            <label>
              Review reason
              <textarea
                value={reason}
                maxLength={1000}
                onChange={(event) => setReason(event.target.value)}
              />
            </label>
            <button
              disabled={busy || detail.request.status !== "PENDING"}
              onClick={() => setConfirm("APPROVED")}
            >
              Approve
            </button>
            <button
              disabled={
                busy || !reason.trim() || detail.request.status !== "PENDING"
              }
              onClick={() => setConfirm("REJECTED")}
            >
              Reject
            </button>
            <button disabled={busy} onClick={() => open(detail.request.id)}>
              Reload details/version
            </button>
            <h3>Review history</h3>
            {detail.history.map((row) => (
              <p key={row.id}>
                {statusLabel(row.status)} {row.reviewed_at}{" "}
                {row.rejection_reason}
              </p>
            ))}
          </article>
        </Modal>
      )}
      <Modal
        isOpen={!!confirm}
        onClose={() => {
          if (!busy) setConfirm(null);
        }}
        title={
          confirm === "APPROVED" ? "Confirm approval" : "Confirm rejection"
        }
        description="This decision updates the live request. Review the request and reason before confirming."
        footer={
          <>
            <button disabled={busy} onClick={() => setConfirm(null)}>
              Cancel
            </button>
            <button
              className="primary-action"
              disabled={busy}
              onClick={() => confirm && review(confirm)}
            >
              {busy ? "Saving…" : "Confirm decision"}
            </button>
          </>
        }
      >
        <p className="detail-id">{detail?.request.id}</p>
        <p>{reason.trim() || "No review reason supplied."}</p>
        {error && <p role="alert">{error}</p>}
      </Modal>
    </section>
  );
}
