"use client";
import { Modal } from "./ui/Modal";
import { PageHeader } from "./layout/PageHeader";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { FleetApplication, Page, statusLabel } from "@/lib/request-models";
export function FleetApplications() {
  const [data, setData] = useState<Page<FleetApplication> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [page, setPage] = useState(1);
  const selectedApplication = data?.items.find(
    (row) => row.id === confirmation?.id,
  );
  const load = useCallback(async () => {
    try {
      setData(
        await adminApi<Page<FleetApplication>>(
          `/admin/drivers/applications?page=${page}&pageSize=100`,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load applications",
      );
    } finally {
      setBusy(false);
    }
  }, [page]);
  useEffect(() => {
    let active = true;
    adminApi<Page<FleetApplication>>(
      `/admin/drivers/applications?page=${page}&pageSize=100`,
    )
      .then((rows) => {
        if (active) setData(rows);
      })
      .catch((error) => {
        if (active)
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load applications",
          );
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [page]);
  async function review(id: string, status: string) {
    setBusy(true);
    setError("");
    try {
      await adminApi(`/admin/drivers/applications/${id}/review`, "POST", {
        status,
        ...(reason.trim() ? { reviewReason: reason.trim() } : {}),
      });
      await load();
      setConfirmation(null);
      setReason("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Review failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="workspace-section live-workspace">
      <PageHeader
        headingLevel={2}
        title="Fleet applications"
        description="Review fleet membership applications separately from provider changes."
      />
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          await load();
        }}
      >
        Refresh applications
      </button>
      {error && <p role="alert">{error}</p>}
      {(busy || (!data && !error)) && <p>Loading applications…</p>}
      {data?.items.length === 0 && <p>No fleet applications</p>}
      {data?.items.map((row) => (
        <article className="fleet-application" key={row.id}>
          <p>
            {row.firstName} {row.lastName} → {row.partnerBusinessName};{" "}
            {row.requestedSector}/{row.requestedVehicleCategory}:{" "}
            {statusLabel(row.status)}
          </p>
          {["APPROVED", "REJECTED", "CHANGES_REQUESTED"].map((status) => (
            <button
              key={status}
              disabled={
                busy ||
                !["PENDING", "UNDER_REVIEW", "CHANGES_REQUESTED"].includes(
                  row.status,
                ) ||
                false
              }
              onClick={() => {
                setReason("");
                setConfirmation({ id: row.id, status });
              }}
            >
              {statusLabel(status)}
            </button>
          ))}
        </article>
      ))}
      <button
        disabled={busy || page === 1}
        onClick={() => {
          setBusy(true);
          setError("");
          setData(null);
          setPage(page - 1);
        }}
      >
        Previous applications
      </button>
      <span>
        Page {page}; total {data?.total ?? 0}
      </span>
      <button
        disabled={busy || !data || page * 100 >= data.total}
        onClick={() => {
          setBusy(true);
          setError("");
          setData(null);
          setPage(page + 1);
        }}
      >
        Next applications
      </button>
      <Modal
        isOpen={!!confirmation}
        onClose={() => {
          if (!busy) setConfirmation(null);
        }}
        title="Review fleet application"
        description="The review reason applies only to this selected application."
        footer={
          <>
            <button disabled={busy} onClick={() => setConfirmation(null)}>
              Cancel
            </button>
            <button
              className="primary-action"
              disabled={
                busy || (!reason.trim() && confirmation?.status !== "APPROVED")
              }
              onClick={() =>
                confirmation && review(confirmation.id, confirmation.status)
              }
            >
              {busy ? "Saving…" : "Confirm decision"}
            </button>
          </>
        }
      >
        <p>
          {selectedApplication?.firstName} {selectedApplication?.lastName} →{" "}
          {selectedApplication?.partnerBusinessName}
        </p>
        <p className="detail-id">{confirmation?.id}</p>
        <p>Decision: {confirmation && statusLabel(confirmation.status)}</p>
        <label>
          Review reason
          {confirmation?.status !== "APPROVED" ? " (required)" : " (optional)"}
          <textarea
            maxLength={1000}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        {error && <p role="alert">{error}</p>}
      </Modal>
    </section>
  );
}
