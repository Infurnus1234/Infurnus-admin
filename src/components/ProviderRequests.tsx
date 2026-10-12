"use client";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "./layout/PageHeader";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { adminApi, ApiError } from "@/lib/admin-api";
import {
  ApprovalRequest,
  requestPage,
  requesterName,
  requesterRole,
  requestLabel,
  requestTarget,
  shortIdentifier,
  statusLabel,
} from "@/lib/request-models";

export function ProviderRequests() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(params.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(
    ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "EXPIRED", "ALL"].includes(
      params.get("status") || "",
    )
      ? params.get("status")!
      : "PENDING",
  );
  const [page, setPage] = useState(
    Math.max(1, Math.min(4000, Number(params.get("page")) || 1)),
  );
  const filtered = requests.filter((row) =>
    [
      row.id,
      row.requester_id,
      requesterName(row),
      requesterRole(row),
      requestTarget(row),
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
  const load = useCallback(async () => {
    try {
      setRequests(
        await adminApi<ApprovalRequest[]>(
          `/provider-approvals?status=${statusFilter}`,
        ),
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        router.replace("/login");
      setError(
        error instanceof Error ? error.message : "Unable to load requests",
      );
    } finally {
      setLoading(false);
    }
  }, [router, statusFilter]);
  useEffect(() => {
    let active = true;
    adminApi<ApprovalRequest[]>(`/provider-approvals?status=${statusFilter}`)
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
  }, [router, statusFilter]);
  function open(id: string) {
    const context = new URLSearchParams({
      q: filter,
      status: statusFilter,
      page: String(currentPage),
    });
    router.push(
      `/${pathname.startsWith("/super-admin") ? "super-admin" : "admin"}/driver-requests/${id}?returnTo=${encodeURIComponent(pathname + "?" + context)}`,
    );
  }
  return (
    <section className="workspace-section live-workspace">
      <PageHeader
        title="Provider approval requests"
        description="Review requests, supporting documents and decision history."
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
            placeholder="Name, role, ID or request type"
          />
        </label>
        <label>
          Status
          <select
            value={statusFilter}
            disabled={loading}
            onChange={(event) => {
              setLoading(true);
              setError("");
              setRequests([]);
              setPage(1);
              setStatusFilter(event.target.value);
            }}
          >
            {[
              "PENDING",
              "APPROVED",
              "REJECTED",
              "CANCELLED",
              "EXPIRED",
              "ALL",
            ].map((status) => (
              <option key={status} value={status}>
                {status === "ALL" ? "All statuses" : requestLabel(status)}
              </option>
            ))}
          </select>
        </label>
        <button
          disabled={loading}
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
              !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
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
          <button disabled={loading || !lookupId.trim()}>Find request</button>
        </form>
      </div>
      <p className="workspace-caption">
        Up to 100 requests for the selected status are loaded. Search applies to
        this list; use a request ID to open older review history.
      </p>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading requests…</p>
      ) : requests.length === 0 ? (
        <p>
          {error
            ? "Requests could not be loaded. Resolve the error and retry."
            : "No requests for this status"}
        </p>
      ) : (
        <div
          className="table-scroll"
          role="region"
          aria-label="Provider approval requests table"
          tabIndex={0}
        >
          <table className="operations-table requests-table">
            <caption className="sr-only">Provider approval requests</caption>
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
                    <span className="request-label" title={requesterName(row)}>
                      {requesterName(row)}
                    </span>

                    <span className="cell-secondary role-badge">
                      {requesterRole(row)}
                    </span>
                  </td>
                  <td>
                    <span className="request-type">
                      {requestLabel(row.request_type)}
                    </span>
                  </td>
                  <td>
                    <span className="request-label" title={requestTarget(row)}>
                      {requestTarget(row)}
                    </span>
                    <span className="cell-secondary" title={row.target_id}>
                      {shortIdentifier(row.target_id)}
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
                    <button disabled={loading} onClick={() => open(row.id)}>
                      View
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
            disabled={loading || currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.max(1, Math.ceil(filtered.length / 10))}{" "}
            · {filtered.length} requests
          </span>
          <button
            disabled={loading || currentPage * 10 >= filtered.length}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
