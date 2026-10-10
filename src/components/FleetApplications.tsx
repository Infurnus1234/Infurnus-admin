"use client";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { FleetApplication, Page, statusLabel } from "@/lib/request-models";
export function FleetApplications() {
  const [data, setData] = useState<Page<FleetApplication> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");
  const [page, setPage] = useState(1);
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
    } catch (error) {
      setError(error instanceof Error ? error.message : "Review failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h2>Fleet applications — separate from provider approvals</h2>
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
      <p role="alert">{error}</p>
      {(busy || (!data && !error)) && <p>Loading applications…</p>}
      {data?.items.length === 0 && <p>No fleet applications</p>}
      <label>
        Review reason
        <textarea
          maxLength={1000}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </label>
      {data?.items.map((row) => (
        <article key={row.id}>
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
                (status !== "APPROVED" && !reason.trim())
              }
              onClick={() => review(row.id, status)}
            >
              {statusLabel(status)}
            </button>
          ))}
        </article>
      ))}
      <button disabled={busy || page === 1} onClick={() => setPage(page - 1)}>
        Previous applications
      </button>
      <span>
        Page {page}; total {data?.total ?? 0}
      </span>
      <button
        disabled={busy || !data || page * 100 >= data.total}
        onClick={() => setPage(page + 1)}
      >
        Next applications
      </button>
    </section>
  );
}
