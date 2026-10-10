"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, ApiError } from "@/lib/admin-api";
import {
  ApprovalDetails,
  ApprovalRequest,
  Driver,
  DriverDetails,
  Page,
  statusLabel,
} from "@/lib/request-models";
export function DriverRecords() {
  const router = useRouter();
  const [data, setData] = useState<Page<Driver> | null>(null);
  const [detail, setDetail] = useState<DriverDetails | null>(null);
  const [documentReview, setDocumentReview] = useState<ApprovalDetails | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
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
        if (active)
          setError(
            error instanceof Error ? error.message : "Unable to load drivers",
          );
      });
    return () => {
      active = false;
    };
  }, [page]);
  async function open(id: string) {
    setBusy(true);
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
      const result = await adminApi<{ accessUrl: string }>(
        `/provider-approvals/${documentReview.request.id}/documents/${documentId}/access-url?page=${page}`,
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
      setError(
        error instanceof Error ? error.message : "Document access failed",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-4">
      <h1>Drivers</h1>
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
      <p role="alert">{error}</p>
      {(busy || (!data && !error)) && <p>Loading…</p>}
      {data?.items.length === 0 && <p>No drivers found</p>}
      <table className="w-full">
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
                {row.firstName} {row.lastName}
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
      <button disabled={busy || page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <span>
        Page {page}; total {data?.total ?? 0}
      </span>
      <button
        disabled={busy || !data || page * 25 >= data.total}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
      {detail && (
        <article>
          <h2>
            {detail.user.firstName} {detail.user.lastName}
          </h2>
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
          {!documentReview && (
            <p>
              No pending profile-review record is available for document access
              here. A known reviewed request ID can be opened in the approvals
              page.
            </p>
          )}
          {["active", "suspended", "banned"].map((value) => (
            <button
              key={value}
              disabled={busy || value === detail.user.status}
              onClick={() => status(value)}
            >
              Set {value}
            </button>
          ))}
        </article>
      )}
    </section>
  );
}
