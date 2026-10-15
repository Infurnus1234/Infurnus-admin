"use client";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  dashboardPeriodQuery,
  periodError,
  presetPeriod,
} from "@/lib/dashboard-period";
import { dashboardDestination } from "@/lib/dashboard-navigation";
import { FleetMap } from "./FleetMap";
import type { FleetMapVehicle } from "@/lib/fleet-map";
import {
  Users,
  Car,
  Truck,
  CalendarCheck,
  CheckCircle2,
  XCircle,
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
function Overview({ role }: { role: "admin" | "super-admin" }) {
  const search = useSearchParams(),
    pathname = usePathname(),
    router = useRouter();
  const period = { from: search.get("from") || "", to: search.get("to") || "" };
  const preset =
    search.get("period") ||
    (period.from || period.to ? "Custom" : "All records");
  const invalidPeriod = periodError(period);
  const query = dashboardPeriodQuery(period);
  function setPeriod(next: typeof period, label = "Custom") {
    const parameters = new URLSearchParams(dashboardPeriodQuery(next));
    if (label !== "All records") parameters.set("period", label);
    router.replace(pathname + (parameters.size ? "?" + parameters : ""), {
      scroll: false,
    });
  }
  const accounts = useBackendQuery<{
    users: { total: number };
    drivers: { total: number };
    partners: { total: number };
    vehicles: { total: number };
    pendingApprovals: number;
  }>("/admin/dashboard?" + query, !invalidPeriod);
  const operations = useBackendQuery<Summary>(
    "/admin/operations/summary?" + query,
    !invalidPeriod,
  );
  const rides = useBackendQuery<{ items: Booking[] }>(
    "/admin/operations/rides?pageSize=5&" + query,
    !invalidPeriod,
  );
  const logistics = useBackendQuery<{ items: Booking[] }>(
    "/admin/operations/logistics?pageSize=5&" + query,
    !invalidPeriod,
  );
  const rentals = useBackendQuery<{ items: Booking[] }>(
    "/admin/operations/rentals?pageSize=5&" + query,
    !invalidPeriod,
  );
  const fleet = useBackendQuery<{
    items: FleetMapVehicle[];
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
      note: "Accounts registered in this period",
    },
    {
      title: "Total Drivers",
      value: accounts.data?.drivers.total,
      icon: UserDriver,
      color: "orange",
      note: "Driver profiles created in this period",
    },
    {
      title: "Total Vehicles",
      value: accounts.data?.vehicles.total,
      icon: Car,
      color: "blue",
      note: "Vehicles registered in this period",
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
      note: "Current status of bookings created in period",
    },
    {
      title: "Cancelled",
      value: cancelled,
      icon: XCircle,
      color: "red",
      note: "Current status of bookings created in period",
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
    setPeriod(presetPeriod(days), label);
  }
  const error =
    invalidPeriod ||
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
              [2, "2 Days"],
              [7, "7 Days"],
              [15, "15 Days"],
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
                setPeriod({ from: "", to: "" }, "All records");
              }}
            >
              All records
            </button>
          </div>
        }
      />
      <div className="dashboard-period">
        <label>
          Records from
          <input
            type="date"
            value={period.from}
            onChange={(e) => {
              setPeriod({ ...period, from: e.target.value });
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
            }}
          />
        </label>
        <button
          disabled={!!invalidPeriod || accounts.busy || operations.busy}
          onClick={load}
        >
          Refresh dashboard
        </button>
        <span>
          Asia/Kolkata calendar dates, inclusive. Registrations and booking
          creation use this period; booking statuses are current, not historical
          transitions. Receipts use capture time. Live fleet is current.
        </span>
      </div>
      {error && (
        <p role="alert" className="workspace-error">
          {error}
        </p>
      )}
      <div className="dashboard-kpis">
        {metrics.map((metric, index) => {
          const href = dashboardDestination(role, metric.title, period);
          const content = (
            <>
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
            </>
          );
          return href ? (
            <Link
              className="dashboard-kpi"
              key={metric.title}
              href={href}
              aria-label={`Open ${metric.title.toLowerCase()}`}
            >
              {content}
            </Link>
          ) : (
            <article className="dashboard-kpi" key={metric.title}>
              {content}
            </article>
          );
        })}
      </div>
      <div className="dashboard-middle">
        <section className="review-card">
          <div className="dashboard-card-title">
            <h2>Live Booking Monitoring</h2>
            <Link href={"/" + role + "/fleets"}>View fleet</Link>
          </div>
          <FleetMap
            key={fleet.busy ? "loading" : "loaded"}
            vehicles={fleet.data?.items || []}
            role={role}
            busy={fleet.busy}
            error={fleet.error}
          />
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
          {rides.error || logistics.error || rentals.error || invalidPeriod ? (
            <p role="alert">Recent bookings unavailable for this period.</p>
          ) : rides.busy || logistics.busy || rentals.busy ? (
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
                            .join(" â†’ ")
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
        {summary?.receiptSeries != null && (
          <section className="review-card">
            <div className="dashboard-card-title">
              <h2>Captured Receipts Overview</h2>
              <span>Monthly</span>
            </div>
            <ReceiptsChart rows={summary?.receiptSeries} />
          </section>
        )}
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

export function OperationsOverview(props: { role: "admin" | "super-admin" }) {
  return (
    <Suspense fallback={<p role="status">Loading Dashboard…</p>}>
      <Overview {...props} />
    </Suspense>
  );
}
