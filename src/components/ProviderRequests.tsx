"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, ApiError } from "@/lib/admin-api";
import {
  ApprovalDetails,
  ApprovalRequest,
  reviewPayload,
  statusLabel,
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
        if (active)
          setError(
            error instanceof Error ? error.message : "Unable to load requests",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function open(id: string) {
    setBusy(true);
    setError("");
    setReason("");
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
      setNotice("Decision saved by the backend");
    } catch (error) {
      failure(error);
    } finally {
      setBusy(false);
    }
  }
  async function document(id: string, page: number) {
    if (!detail) return;
    setBusy(true);
    try {
      const result = await adminApi<{ accessUrl: string }>(
        `/provider-approvals/${detail.request.id}/documents/${id}/access-url?page=${page}`,
      );
      const url = new URL(result.accessUrl);
      if (
        url.protocol !== "https:" &&
        !(
          url.protocol === "http:" &&
          ["localhost", "127.0.0.1"].includes(url.hostname)
        )
      )
        throw new Error("Invalid document access URL");
      window.open(url.href, "_blank", "noopener,noreferrer");
    } catch (error) {
      failure(error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-5">
      <h1>Provider approval requests</h1>
      <p>
        The backend supplies up to 100 pending requests. Reviewed history is
        available within each request. Requester identifiers are shown where
        names are not supplied.
      </p>
      <button
        disabled={busy || loading}
        onClick={async () => {
          setLoading(true);
          setError("");
          await load();
        }}
      >
        Refresh
      </button>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void open(lookupId.trim());
        }}
      >
        <label>
          Request ID (including reviewed requests)
          <input
            value={lookupId}
            onChange={(event) => setLookupId(event.target.value)}
            required
          />
        </label>
        <button disabled={busy}>Find request</button>
      </form>
      <p role="alert">{error}</p>
      <p role="status">{notice}</p>
      {loading ? (
        <p>Loading requests…</p>
      ) : requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <table className="w-full">
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
            {requests.map((row) => (
              <tr key={row.id}>
                <td>
                  {row.requester_id}
                  <br />
                  {row.requester_role}
                </td>
                <td>{row.request_type}</td>
                <td>
                  {row.target_type}: {row.target_id}
                </td>
                <td>{row.submitted_at}</td>
                <td>{statusLabel(row.status)}</td>
                <td>
                  <button disabled={busy} onClick={() => open(row.id)}>
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {detail && (
        <article className="border p-5 space-y-3">
          <h2>Request {detail.request.id}</h2>
          <p>Status: {statusLabel(detail.request.status)}</p>
          <p>Target version: {detail.target.updated_at}</p>
          <h3>Documents</h3>
          {detail.documents.length ? (
            detail.documents.map((doc) => (
              <div key={doc.id}>
                {doc.document_type}: {statusLabel(doc.status)}{" "}
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
            onClick={() => review("APPROVED")}
          >
            Approve
          </button>
          <button
            disabled={
              busy || !reason.trim() || detail.request.status !== "PENDING"
            }
            onClick={() => review("REJECTED")}
          >
            Reject
          </button>
          <button disabled={busy} onClick={() => open(detail.request.id)}>
            Reload details/version
          </button>
          <h3>Review history</h3>
          {detail.history.map((row) => (
            <p key={row.id}>
              {statusLabel(row.status)} {row.reviewed_at} {row.rejection_reason}
            </p>
          ))}
        </article>
      )}
    </section>
  );
}
