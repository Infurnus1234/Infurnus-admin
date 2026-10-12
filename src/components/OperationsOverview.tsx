"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Users,
  Car,
  Store,
  Truck,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  IndianRupee,
  MapPin,
} from "lucide-react";
import { useBackendQuery } from "@/lib/use-backend-query";
import {
  requestLabel,
  requestTimestamp,
  shortIdentifier,
} from "@/lib/request-models";
import { PageHeader } from "./layout/PageHeader";
import {
  BookingStatusChart,
  CategoryChart,
  ReceiptsChart,
} from "./DashboardCharts";
type Summary = {
  rides: { status: string; count: number }[];
  deliveries: { status: string; count: number }[];
  rentals?: { status: string; count: number }[];
  vehicleCategories?: { category: string; count: number; total: number }[];
  receiptSeries?: { month: string; currency: string; amount: string }[] | null;
};
type Booking = {
  id: string;
  account_display_name?: string;
  status: string;
  pickup_address?: string;
  destination_address?: string;
  created_at: string;
  fare_estimate?: string;
  final_fare?: string;
  total_amount?: string;
  currency?: string;
};
export function OperationsOverview({
  role,
}: {
  role: "admin" | "super-admin";
}) {
  const [period, setPeriod] = useState({ from: "", to: "" }),
    [preset, setPreset] = useState("All records");
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
  const operations = useBackendQuery<Summary>(
    "/admin/operations/summary?" + query,
  );
  const rides = useBackendQuery<{ items: Booking[] }>(
    "/admin/operations/rides?pageSize=5&" + query,
  );
  const logistics = useBackendQuery<{ items: Booking[] }>(
    "/admin/operations/logistics?pageSize=5&" + query,
  );
  const rentals = useBackendQuery<{ items: Booking[] }>(
    "/admin/operations/rentals?pageSize=5&" + query,
  );
  const fleet = useBackendQuery<{
    items: {
      id: string;
      plateNumber: string;
      driverName?: string;
      latitude: number | null;
      longitude: number | null;
      status: string;
    }[];
  }>("/admin/fleet/vehicles?pageSize=10");
  const summary = operations.data;
  const states =
    summary && Array.isArray(summary.rentals)
      ? [...summary.rides, ...summary.deliveries, ...summary.rentals]
      : undefined;
  const counts = states
    ? Object.entries(
        states.reduce<Record<string, number>>((map, row) => {
          const key = row.status.toLowerCase();
          map[key] = (map[key] || 0) + row.count;
          return map;
        }, {}),
      ).map(([status, count]) => ({ status, count }))
    : undefined;
  const total = counts?.reduce((sum, row) => sum + row.count, 0),
    completed = counts
      ?.filter((row) => ["completed", "delivered"].includes(row.status))
      .reduce((sum, row) => sum + row.count, 0),
    cancelled = counts
      ?.filter((row) => row.status === "cancelled")
      .reduce((sum, row) => sum + row.count, 0);
  const recent = [
    ...(rides.data?.items || []).map((row) => ({ ...row, source: "rides" })),
    ...(logistics.data?.items || []).map((row) => ({
      ...row,
      source: "logistics",
    })),
    ...(rentals.data?.items || []).map((row) => ({
      ...row,
      source: "rentals",
    })),
  ]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, 5);
  const metrics = [
    {
      title: "Total Users",
      value: accounts.data?.users.total,
      icon: Users,
      color: "orange",
      note: "Current registered accounts",
    },
    {
      title: "Total Drivers",
      value: accounts.data?.drivers.total,
      icon: UserDriver,
      color: "orange",
      note: "Driver and combined-role accounts",
    },
    {
      title: "Total Vendors",
      value: undefined,
      icon: Store,
      color: "green",
      note: "Vendor entity not configured",
    },
    {
      title: "Total Vehicles",
      value: accounts.data?.vehicles.total,
      icon: Car,
      color: "blue",
      note: "Current inventory records",
    },
    {
      title: "Total Bookings",
      value: total,
      icon: CalendarCheck,
      color: "blue",
      note: "Rides, logistics and rentals",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "green",
      note: "Completed or delivered records",
    },
    {
      title: "Cancelled",
      value: cancelled,
      icon: XCircle,
      color: "red",
      note: "Current cancellation status",
    },
    {
      title: "Total Revenue",
      value: undefined,
      icon: IndianRupee,
      color: "purple",
      note: "Revenue definition not connected",
    },
  ];
  function load() {
    accounts.refresh();
    operations.refresh();
    rides.refresh();
    logistics.refresh();
    rentals.refresh();
    fleet.refresh();
  }
  function choose(days: number, label: string) {
    const today = new Date(),
      start = new Date();
    start.setDate(start.getDate() - days + 1);
    const date = (d: Date) =>
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0");
    setPeriod({ from: date(start), to: date(today) });
    setPreset(label);
  }
  const error =
    accounts.error ||
    operations.error ||
    rides.error ||
    logistics.error ||
    rentals.error;
  return (
    <section className="workspace-section dashboard-workspace">
      <PageHeader
        title="Dashboard"
        description="Current platform operations · refresh for the latest records"
        actions={
          <div className="dashboard-presets">
            {[
              [1, "Today"],
              [7, "7 Days"],
              [30, "30 Days"],
            ].map(([days, label]) => (
              <button
                key={label}
                className={preset === label ? "is-active" : ""}
                aria-pressed={preset === label}
                onClick={() => choose(Number(days), String(label))}
              >
                {label}
              </button>
            ))}
            <button
              className={preset === "All records" ? "is-active" : ""}
              aria-pressed={preset === "All records"}
              onClick={() => {
                setPeriod({ from: "", to: "" });
                setPreset("All records");
              }}
            >
              All records
            </button>
          </div>
        }
      />
      <div className="dashboard-period">
        <label>
          Booking records from
          <input
            type="date"
            value={period.from}
            onChange={(e) => {
              setPeriod({ ...period, from: e.target.value });
              setPreset("Custom");
            }}
          />
        </label>
        <label>
          Through
          <input
            type="date"
            value={period.to}
            min={period.from}
            onChange={(e) => {
              setPeriod({ ...period, to: e.target.value });
              setPreset("Custom");
            }}
          />
        </label>
        <button disabled={accounts.busy || operations.busy} onClick={load}>
          Refresh dashboard
        </button>
        <span>
          Account KPIs are current totals; booking and receipt panels use these
          creation dates.
        </span>
      </div>
      {error && (
        <p role="alert" className="workspace-error">
          {error}
        </p>
      )}
      <div className="dashboard-kpis">
        {metrics.map((metric, index) => (
          <article className="dashboard-kpi" key={metric.title}>
            <div className={"kpi-icon " + metric.color}>
              <metric.icon size={28} />
            </div>
            <div>
              <h2>{metric.title}</h2>
              <strong>
                {(index < 4 ? accounts.busy : operations.busy)
                  ? "Loading…"
                  : metric.value === undefined
                    ? "Unavailable"
                    : metric.value.toLocaleString("en-IN")}
              </strong>
              <p>{metric.note}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="dashboard-middle">
        <section className="review-card">
          <div className="dashboard-card-title">
            <h2>Live Booking Monitoring</h2>
            <Link href={"/" + role + "/fleets"}>View fleet</Link>
          </div>
          <div className="dashboard-map-unavailable">
            <MapPin size={38} />
            <h3>Browser map not configured</h3>
            <p>
              Live geographic visualization needs the approved browser Maps SDK
              configuration. No simulated markers or locations are shown.
            </p>
            <Link href={"/" + role + "/fleets"}>
              Open actual fleet location records
            </Link>
          </div>
          {fleet.error && <p role="alert">{fleet.error}</p>}
          <div className="dashboard-fleet-status">
            {fleet.busy
              ? "Loading fleet records…"
              : fleet.data?.items.length
                ? fleet.data.items.slice(0, 3).map((vehicle) => (
                    <p key={vehicle.id}>
                      <strong>{vehicle.plateNumber}</strong>
                      <span>
                        {vehicle.driverName || "Name unavailable"} ·{" "}
                        {requestLabel(vehicle.status)}
                      </span>
                    </p>
                  ))
                : "No fleet location records returned."}
          </div>
        </section>
        <section className="review-card">
          <div className="dashboard-card-title">
            <h2>Recent Bookings</h2>
            <Link href={"/" + role + "/rides"}>View rides</Link>
          </div>
          {rides.busy || logistics.busy || rentals.busy ? (
            <p role="status">Loading actual recent bookings…</p>
          ) : recent.length ? (
            <div className="recent-bookings">
              {recent.map((row) => (
                <Link
                  href={"/" + role + "/" + row.source + "/" + row.id}
                  key={row.id}
                >
                  <div
                    className={
                      "recent-icon " +
                      (row.source === "rides"
                        ? "blue"
                        : row.source === "rentals"
                          ? "purple"
                          : "orange")
                    }
                  >
                    {row.source === "rides" ? (
                      <Car size={20} />
                    ) : (
                      <Truck size={20} />
                    )}
                  </div>
                  <div className="recent-booking-main">
                    <strong>
                      {row.account_display_name || "Name unavailable"}
                    </strong>
                    <span>
                      {requestLabel(row.source)} · {shortIdentifier(row.id)}
                    </span>
                    <small>
                      {row.pickup_address || row.destination_address
                        ? [row.pickup_address, row.destination_address]
                            .filter(Boolean)
                            .join(" → ")
                        : "Route information not returned"}
                    </small>
                  </div>
                  <div className="recent-booking-status">
                    <time>{requestTimestamp(row.created_at)}</time>
                    {(row.final_fare ??
                      row.total_amount ??
                      row.fare_estimate) != null && (
                      <strong>
                        {row.final_fare ??
                          row.total_amount ??
                          row.fare_estimate}
                        {row.currency ? ` ${row.currency}` : ""}
                      </strong>
                    )}
                    <span
                      className="status-badge"
                      data-status={row.status.toUpperCase()}
                    >
                      {requestLabel(row.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="dashboard-empty">No bookings in this period.</p>
          )}
        </section>
      </div>
      <div className="dashboard-bottom">
        <section className="review-card">
          <div className="dashboard-card-title">
            <h2>Captured Receipts Overview</h2>
            <span>Monthly</span>
          </div>
          <ReceiptsChart rows={summary?.receiptSeries} />
        </section>
        <section className="review-card">
          <div className="dashboard-card-title">
            <h2>Booking Status</h2>
            <span>{preset}</span>
          </div>
          <BookingStatusChart rows={counts} />
        </section>
        <section className="review-card">
          <div className="dashboard-card-title">
            <h2>Top Vehicle Categories</h2>
            <span>Ride bookings</span>
          </div>
          <CategoryChart rows={summary?.vehicleCategories} />
        </section>
      </div>
    </section>
  );
}
const UserDriver = Users;
