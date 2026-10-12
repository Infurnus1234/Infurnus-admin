"use client";
import Link from "next/link";
import { useState } from "react";
import { useBackendQuery } from "@/lib/use-backend-query";
import { Car, ClipboardCheck, ArrowRight, Inbox } from "lucide-react";
import { PageHeader } from "./layout/PageHeader";
export function OperationsOverview({
  role,
}: {
  role: "admin" | "super-admin";
}) {
  const [period, setPeriod] = useState({ from: "", to: "" });
  const query = new URLSearchParams();
  if (period.from) query.set("from", period.from);
  if (period.to) query.set("to", period.to);
  const accounts = useBackendQuery<{
    users: { total: number };
    drivers: { total: number };
    partners: { total: number };
    vehicles: { total: number };
    pendingApprovals: number;
  }>("/admin/dashboard");
  const operations = useBackendQuery<{
    rides: { status: string; count: number }[];
    deliveries: { status: string; count: number }[];
    capturedPayments:
      { currency: string; amount: string; count: number }[] | null;
  }>("/admin/operations/summary?" + query);
  const counts = accounts.data,
    summary = operations.data,
    busy = accounts.busy || operations.busy,
    error = accounts.error || operations.error;
  function load() {
    accounts.refresh();
    operations.refresh();
  }
  const items = [
    {
      path: "drivers",
      title: "Drivers",
      description: "View verified account and document information.",
      icon: Car,
    },
    {
      path: "driver-requests",
      title: "Driver requests",
      description: "Review pending provider changes and their history.",
      icon: Inbox,
    },
    {
      path: "approvals",
      title: "Approval center",
      description: "Review provider requests and fleet applications.",
      icon: ClipboardCheck,
    },
  ];
  return (
    <section className="workspace-section">
      <PageHeader
        title="Operations overview"
        description="Manage the work that keeps your network moving."
      />
      <div className="operations-toolbar">
        <label>
          Created from
          <input
            type="date"
            value={period.from}
            onChange={(e) => setPeriod({ ...period, from: e.target.value })}
          />
        </label>
        <label>
          Created through
          <input
            type="date"
            value={period.to}
            min={period.from}
            onChange={(e) => setPeriod({ ...period, to: e.target.value })}
          />
        </label>
        <button disabled={busy} onClick={() => void load()}>
          Refresh dashboard
        </button>
      </div>
      {error && (
        <p role="alert" className="workspace-error">
          {error}
        </p>
      )}
      <div className="overview-grid" aria-busy={busy}>
        {[
          ["Customers & accounts", counts?.users.total],
          ["Drivers", counts?.drivers.total],
          ["Partners", counts?.partners.total],
          ["Vehicles", counts?.vehicles.total],
          ["Pending applications", counts?.pendingApprovals],
        ].map(([label, value]) => (
          <article className="overview-card" key={label}>
            <h2>{label}</h2>
            <strong className="kpi-value">
              {busy ? "Loading…" : (value ?? "Unavailable")}
            </strong>
            <p>Current registered records</p>
          </article>
        ))}
      </div>
      <div className="overview-grid">
        {[
          ["Ride status", summary?.rides],
          ["Delivery status", summary?.deliveries],
        ].map(([title, rows]) => (
          <article className="overview-card" key={String(title)}>
            <h2>{String(title)}</h2>
            {busy ? (
              <p>Loading…</p>
            ) : Array.isArray(rows) ? (
              rows.length ? (
                rows.map((row) => (
                  <p key={row.status}>
                    {row.status.replaceAll("_", " ")}{" "}
                    <strong>{row.count}</strong>
                  </p>
                ))
              ) : (
                <p>No bookings in this period.</p>
              )
            ) : (
              <p>Operational data unavailable.</p>
            )}
          </article>
        ))}
        <article className="overview-card">
          <h2>Captured payment receipts</h2>
          {summary?.capturedPayments ? (
            summary.capturedPayments.length ? (
              summary.capturedPayments.map((row) => (
                <p key={row.currency}>
                  {row.currency}{" "}
                  {Number(row.amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  · {row.count} payments
                </p>
              ))
            ) : (
              <p>No captured payments in this period.</p>
            )
          ) : (
            <p>Financial data unavailable for this view.</p>
          )}
          <p>
            Current CAPTURED records created in the selected period. These
            receipts are not platform revenue or profit.
          </p>
        </article>
      </div>
      <div className="overview-grid">
        {items.map((item) => (
          <Link
            key={item.path}
            href={`/${role}/${item.path}`}
            className="overview-card"
          >
            <item.icon size={24} aria-hidden="true" />
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <span>
              Open workspace <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
      <div className="workspace-note">
        Account counts show current totals. Booking and receipt summaries use
        the selected creation dates. Unsupported integrations are clearly marked
        unavailable.
      </div>
    </section>
  );
}
