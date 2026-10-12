"use client";
import { Modal } from "./ui/Modal";
import { PageHeader } from "./layout/PageHeader";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, ApiError, documentAccessUrl } from "@/lib/admin-api";
import {
  ApprovalDetails,
  ApprovalRequest,
  Driver,
  DriverDetails,
  Page,
  statusLabel,
  roleLabel,
} from "@/lib/request-models";
export function DriverRecords() {
  const router = useRouter();
  const [data, setData] = useState<Page<Driver> | null>(null);
  const [detail, setDetail] = useState<DriverDetails | null>(null);
  const [documentReview, setDocumentReview] = useState<ApprovalDetails | null>(
    null,
  );
  const [confirmation, setConfirmation] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setData(
        await adminApi<Page<Driver>>(`/admin/drivers?page=${page}&pageSize=25`),
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        router.replace("/login");
      setError(
        error instanceof Error ? error.message : "Unable to load drivers",
      );
    } finally {
      setBusy(false);
    }
  }, [page, router]);
  useEffect(() => {
    let active = true;
    adminApi<Page<Driver>>(`/admin/drivers?page=${page}&pageSize=25`)
      .then((rows) => {
        if (active) setData(rows);
      })
      .catch((error) => {
        if (active && error instanceof ApiError && error.status === 401)
          router.replace("/login");
        if (active)
          setError(
            error instanceof Error ? error.message : "Unable to load drivers",
          );
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [page, router]);
  async function open(id: string) {
    setBusy(true);
    setError("");
    setDetail(null);
    setDocumentReview(null);
    try {
      const driver = await adminApi<DriverDetails>(`/admin/drivers/${id}`);
      setDetail(driver);
      const requests = await adminApi<ApprovalRequest[]>("/provider-approvals");
      const related = requests.find(
        (row) =>
          row.target_type === "driver_profile" && row.target_id === driver.id,
      );
      setDocumentReview(
        related
          ? await adminApi<ApprovalDetails>(`/provider-approvals/${related.id}`)
          : null,
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load details",
      );
    } finally {
      setBusy(false);
    }
  }
  async function status(value: string) {
    if (!detail) return;
    setBusy(true);
    setError("");
    try {
      await adminApi(`/admin/users/${detail.user.id}/status`, "PATCH", {
        status: value,
      });
      setDetail(await adminApi<DriverDetails>(`/admin/drivers/${detail.id}`));
      await load();
      setConfirmation(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Status update failed");
    } finally {
      setBusy(false);
    }
  }
  async function viewDocument(documentId: string, page: number) {
    if (!documentReview) return;
    setBusy(true);
    setError("");
    try {
      const accessUrl = await documentAccessUrl(
        documentReview.request.id,
        documentId,
        page,
        documentReview.documents.find((row) => row.id === documentId)
          ?.pageCount || 1,
      );
      window.open(accessUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Document access failed",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="workspace-section live-workspace">
      <PageHeader
        title="Drivers"
        description="View driver verification, documents and account status."
      />
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          await load();
        }}
      >
        Refresh
      </button>
      {error && <p role="alert">{error}</p>}
      {(busy || (!data && !error)) && <p>Loading…</p>}
      {data?.items.length === 0 && <p>No drivers found</p>}
      <div
        className="table-scroll"
        role="region"
        aria-label="Drivers table"
        tabIndex={0}
      >
        <table className="operations-table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Verification</th>
              <th>Account</th>
              <th>City</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((row) => (
              <tr key={row.id}>
                <td>
                  {`${row.firstName || ""} ${row.lastName || ""}`.trim() ||
                    "Name unavailable"}{" "}
                  <span className="role-badge">{roleLabel(row.role)}</span>
                </td>
                <td>{statusLabel(row.verificationStatus)}</td>
                <td>{row.userStatus}</td>
                <td>{row.city}</td>
                <td>
                  <button disabled={busy} onClick={() => open(row.id)}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        disabled={busy || page === 1}
        onClick={() => {
          setBusy(true);
          setError("");
          setData(null);
          setPage(page - 1);
        }}
      >
        Previous
      </button>
      <span>
        Page {page}; total {data?.total ?? 0}
      </span>
      <button
        disabled={busy || !data || page * 25 >= data.total}
        onClick={() => {
          setBusy(true);
          setError("");
          setData(null);
          setPage(page + 1);
        }}
      >
        Next
      </button>
      {detail && (
        <Modal
          isOpen={!!detail}
          onClose={() => {
            if (!busy) setDetail(null);
          }}
          title="Driver details"
          size="xl"
        >
          <article className="detail-panel">
            {error && <p role="alert">{error}</p>}
            <h2>
              {detail.user.firstName} {detail.user.lastName}
            </h2>
            <p>
              <span className="role-badge">{roleLabel(detail.user.role)}</span>
            </p>
            <p>
              Verification: {detail.verificationStatus}; Account:{" "}
              {detail.user.status}
            </p>
            <p>{detail.rejectionReason}</p>
            <h3>Documents</h3>
            {detail.documents.map((document) => (
              <div key={document.id}>
                {document.documentType}:{" "}
                {statusLabel(document.verificationStatus)}
                {documentReview?.documents
                  .filter((row) => row.id === document.id)
                  .map((row) =>
                    Array.from(
                      { length: Math.min(5, row.pageCount || 1) },
                      (_, index) => (
                        <button
                          key={index}
                          disabled={busy}
                          onClick={() => viewDocument(row.id, index + 1)}
                        >
                          View page {index + 1}
                        </button>
                      ),
                    ),
                  )}
              </div>
            ))}
            {busy && !documentReview && <p>Loading document access…</p>}
            {!documentReview && !busy && (
              <p>
                No pending profile-review record is available for document
                access here. A known reviewed request ID can be opened in the
                approvals page.
              </p>
            )}
            {["active", "suspended", "banned"].map((value) => (
              <button
                key={value}
                disabled={busy || value === detail.user.status}
                onClick={() =>
                  setConfirmation({ id: detail.id, status: value })
                }
              >
                Set {value}
              </button>
            ))}
          </article>
        </Modal>
      )}
      <Modal
        isOpen={!!confirmation}
        onClose={() => {
          if (!busy) setConfirmation(null);
        }}
        title="Confirm account status"
        description="This changes the live account status. Verify the selected driver before confirming."
        footer={
          <>
            <button disabled={busy} onClick={() => setConfirmation(null)}>
              Cancel
            </button>
            <button
              className="primary-action"
              disabled={busy}
              onClick={() => confirmation && status(confirmation.status)}
            >
              {busy ? "Saving…" : "Confirm status"}
            </button>
          </>
        }
      >
        <p>
          {detail?.user.firstName} {detail?.user.lastName} →{" "}
          {confirmation?.status}
        </p>
        {error && <p role="alert">{error}</p>}
      </Modal>
    </section>
  );
}
