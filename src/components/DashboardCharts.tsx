"use client";
import { requestLabel } from "@/lib/request-models";
const colors = [
  "var(--admin-success)",
  "var(--admin-error)",
  "var(--admin-primary)",
  "var(--admin-info)",
  "var(--admin-purple)",
  "var(--admin-muted)",
];
const statusColor = (status: string) =>
  /completed|delivered/i.test(status)
    ? colors[0]
    : /cancelled|failed/i.test(status)
      ? colors[1]
      : /progress|active|assigned/i.test(status)
        ? colors[2]
        : colors[3];
export function BookingStatusChart({
  rows,
}: {
  rows: { status: string; count: number }[] | undefined;
}) {
  if (!rows)
    return (
      <p className="admin-muted">Booking status reporting is unavailable.</p>
    );
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  if (!total)
    return (
      <p className="dashboard-empty">No bookings in the selected period.</p>
    );
  return (
    <div className="booking-chart">
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label={`${total} real bookings by current status`}
      >
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke="#F2F4F7"
          strokeWidth="24"
        />
        {rows.map((row, index) => {
          const arc = (row.count / total) * 452.389,
            start =
              (rows
                .slice(0, index)
                .reduce((sum, previous) => sum + previous.count, 0) /
                total) *
              452.389;
          return (
            <circle
              key={row.status}
              cx="100"
              cy="100"
              r="72"
              fill="none"
              stroke={statusColor(row.status)}
              strokeWidth="24"
              strokeDasharray={`${arc} ${452.389 - arc}`}
              strokeDashoffset={-start}
              transform="rotate(-90 100 100)"
            />
          );
        })}
        <text x="100" y="99" textAnchor="middle" fontSize="25" fontWeight="700">
          {total.toLocaleString("en-IN")}
        </text>
        <text
          x="100"
          y="120"
          textAnchor="middle"
          fontSize="10"
          fill="var(--admin-muted)"
        >
          Total bookings
        </text>
      </svg>
      <ul>
        {rows.map((row) => (
          <li key={row.status}>
            <i style={{ background: statusColor(row.status) }} />
            <span>{requestLabel(row.status)}</span>
            <strong>
              {row.count.toLocaleString("en-IN")}{" "}
              <small>({((row.count / total) * 100).toFixed(1)}%)</small>
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
export function CategoryChart({
  rows,
}: {
  rows: { category: string; count: number; total: number }[] | undefined;
}) {
  if (!rows)
    return <p className="admin-muted">Category reporting unavailable.</p>;
  const total = rows[0]?.total ?? 0;
  return total ? (
    <div className="category-chart">
      {rows.map((row, index) => (
        <div key={row.category}>
          <span>{requestLabel(row.category)}</span>
          <div className="category-track">
            <i
              style={{
                width: (row.count / total) * 100 + "%",
                background: colors[(index + 2) % colors.length],
              }}
            />
          </div>
          <strong>{row.count}</strong>
          <small>{((row.count / total) * 100).toFixed(1)}%</small>
        </div>
      ))}
    </div>
  ) : (
    <p className="dashboard-empty">No ride category records in this period.</p>
  );
}
export function ReceiptsChart({
  rows,
}: {
  rows:
    { month: string; currency: string; amount: string }[] | null | undefined;
}) {
  if (!rows)
    return (
      <p className="dashboard-empty">
        Financial reporting is unavailable for this view.
      </p>
    );
  const currencies = [...new Set(rows.map((row) => row.currency))];
  if (!rows.length)
    return (
      <p className="dashboard-empty">No captured receipts in this period.</p>
    );
  return (
    <div className="receipts-charts">
      {currencies.map((currency) => {
        const values = rows.filter((row) => row.currency === currency),
          max = Math.max(...values.map((row) => Number(row.amount)));
        return (
          <figure key={currency}>
            <figcaption>{currency} · current CAPTURED records</figcaption>
            <div className="receipt-bars">
              {values.map((row) => (
                <div key={row.month}>
                  <span>
                    {Number(row.amount).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <i
                    style={{
                      height:
                        max > 0
                          ? Math.max(2, (Number(row.amount) / max) * 125)
                          : 0,
                    }}
                  />
                  <small>{row.month}</small>
                </div>
              ))}
            </div>
          </figure>
        );
      })}
      <p className="admin-muted">
        Recorded captured receipts by creation month, separated by currency.
        These are not net revenue or profit; refunded records are excluded.
      </p>
    </div>
  );
}
