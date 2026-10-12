"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeader } from "./layout/PageHeader";
import { useBackendQuery } from "@/lib/use-backend-query";
import {
  roleLabel,
  requestLabel,
  type Driver,
  type Page,
} from "@/lib/request-models";
export function DriverRecords() {
  const pathname = usePathname();
  const role = pathname.startsWith("/super-admin") ? "super-admin" : "admin";
  const [page, setPage] = useState(1),
    [pageSize, setPageSize] = useState(25),
    [draft, setDraft] = useState(""),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState("");
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search.trim()) query.set("search", search.trim());
  if (status) query.set("verificationStatus", status);
  const { data, busy, error, refresh } = useBackendQuery<Page<Driver>>(
    "/admin/drivers?" + query,
  );
  return (
    <section className="workspace-section">
      <PageHeader
        title="Drivers"
        description="Verified identities, account status, vehicle associations and submitted documents."
      />
      <form
        className="operations-toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(draft);
        }}
      >
        <label>
          Search drivers
          <input
            value={draft}
            maxLength={150}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Name, email or phone"
          />
        </label>
        <label>
          Verification
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All statuses</option>
            {["pending", "under_review", "approved", "rejected"].map((s) => (
              <option key={s} value={s}>
                {requestLabel(s)}
              </option>
            ))}
          </select>
        </label>
        <button className="workspace-primary" disabled={busy}>
          Apply filters
        </button>
        <button type="button" disabled={busy} onClick={refresh}>
          Refresh
        </button>
      </form>
      {error && (
        <p className="workspace-error" role="alert">
          {error}
        </p>
      )}
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
            {busy ? (
              <tr>
                <td colSpan={5}>Loading drivers…</td>
              </tr>
            ) : data?.items.length ? (
              data.items.map((driver) => (
                <tr key={driver.id}>
                  <td>
                    <strong className="request-label">
                      {[driver.firstName, driver.lastName]
                        .filter(Boolean)
                        .join(" ") || "Name unavailable"}
                    </strong>
                    <span className="role-badge">{roleLabel(driver.role)}</span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      data-status={driver.verificationStatus.toUpperCase()}
                    >
                      {requestLabel(driver.verificationStatus)}
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      data-status={driver.userStatus.toUpperCase()}
                    >
                      {requestLabel(driver.userStatus)}
                    </span>
                  </td>
                  <td>{driver.city || "Not provided"}</td>
                  <td>
                    <Link
                      className="admin-button admin-button-secondary"
                      href={`/${role}/drivers/${driver.id}`}
                    >
                      View driver
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  {error
                    ? "Records unavailable; retry above."
                    : "No drivers match these filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <nav className="operations-pagination" aria-label="Driver pages">
        <label>
          Rows per page
          <select
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <span>
          {data
            ? data.total + " drivers · Page " + page
            : "Records unavailable"}
        </span>
        <button
          disabled={busy || page === 1}
          onClick={() => setPage((v) => v - 1)}
        >
          Previous
        </button>
        <button
          disabled={busy || !data || page * pageSize >= data.total}
          onClick={() => setPage((v) => v + 1)}
        >
          Next
        </button>
      </nav>
    </section>
  );
}
