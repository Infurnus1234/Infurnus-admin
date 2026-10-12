"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBackendQuery } from "@/lib/use-backend-query";
import { adminApi } from "@/lib/admin-api";
import {
  operationConfigs,
  operationPath,
  fieldValue,
  recordValue,
  fieldLabel,
  type ModuleKey,
} from "@/lib/operations";
import { PageHeader } from "./layout/PageHeader";
import { Modal } from "./ui/Modal";
import { CouponCreate } from "./CouponCreate";
import { roleLabel, requestLabel, shortIdentifier } from "@/lib/request-models";
interface RecordsPage {
  items: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize: number;
}
export function OperationsRecords({
  module,
  readOnly = false,
  headingLevel = 1,
}: {
  module: ModuleKey;
  readOnly?: boolean;
  headingLevel?: 1 | 2;
}) {
  const config = operationConfigs[module];
  const pathname = usePathname();
  const routeRole = pathname.startsWith("/super-admin")
    ? "super-admin"
    : "admin";
  const [pageSize, setPageSize] = useState(25);

  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("customer");

  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Record<string, unknown> | null>(
    null,
  );
  const [mutation, setMutation] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  async function saveMutation() {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      await adminApi(
        module === "users"
          ? `/admin/users/${selected.id}/status`
          : `/admin/operations/coupons/${selected.id}/active`,
        "PATCH",
        module === "users"
          ? { status: mutation }
          : {
              isActive: mutation === "activate",
              expectedUpdatedAt: selected.version_timestamp,
            },
      );
      setSelected(null);
      setMutation("");
      setNotice("Change saved by the backend.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }
  const {
    data,
    busy,
    error: readError,
    refresh: load,
  } = useBackendQuery<RecordsPage>(
    operationPath(module, page, search, status, role, pageSize),
  );
  const pages = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));
  return (
    <section className="workspace-section">
      <PageHeader
        headingLevel={headingLevel}
        title={config.title}
        description="Browse records, review details and manage supported actions."
      />
      <form
        className="operations-toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(draft);
        }}
      >
        {module === "users" && (
          <label>
            Account type
            <select
              value={role}
              onChange={(event) => {
                setPage(1);
                setRole(event.target.value);
              }}
            >
              {["customer", "driver", "fleet_owner", "driver_fleet_owner"].map(
                (value) => (
                  <option key={value} value={value}>
                    {roleLabel(value)}
                  </option>
                ),
              )}
            </select>
          </label>
        )}
        <label>
          Search {module === "vehicles" ? "registration" : "records"}
          <input
            value={draft}
            maxLength={module === "vehicles" ? 20 : 150}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              module === "vehicles"
                ? "Registration number"
                : [
                      "users",
                      "partners",
                      "support",
                      "coupons",
                      "notifications",
                      "audit-logs",
                      "fleets",
                    ].includes(module)
                  ? "Search text"
                  : "Record ID"
            }
          />
        </label>
        {config.statuses && (
          <label>
            Status
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All statuses</option>
              {config.statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        )}
        <button className="workspace-primary" disabled={busy}>
          Apply filters
        </button>
        <button type="button" disabled={busy} onClick={() => void load()}>
          Refresh
        </button>
      </form>
      {module === "coupons" && !readOnly && (
        <div className="operations-toolbar">
          <CouponCreate
            onSaved={() => {
              setNotice("Promo code created.");
              load();
            }}
          />
        </div>
      )}
      {config.note && <p className="workspace-note">{config.note}</p>}
      {(error || readError) && (
        <p role="alert" className="workspace-error">
          {error || readError}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      <div
        className="table-scroll"
        role="region"
        aria-label={`${config.title} table`}
        tabIndex={0}
        aria-busy={busy}
      >
        <table
          className="operations-table"
          style={{ minWidth: Math.max(960, config.columns.length * 155 + 100) }}
        >
          <caption className="sr-only">
            {config.title}; values are from the backend
          </caption>
          <thead>
            <tr>
              {config.columns.map((c) => (
                <th key={c.key} scope="col">
                  {c.label}
                </th>
              ))}
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            {busy ? (
              <tr>
                <td colSpan={config.columns.length + 1}>Loading records…</td>
              </tr>
            ) : data?.items.length ? (
              data.items.map((row) => (
                <tr key={String(row.id)}>
                  {config.columns.map((c) => (
                    <td key={c.key}>
                      <span
                        className={`record-cell ${/status$/i.test(c.key) || c.key === "account_role" || c.key === "role" ? "status-badge" : ""}`}
                        data-status={
                          /status$/i.test(c.key)
                            ? String(row[c.key] || "").toUpperCase()
                            : undefined
                        }
                        title={recordValue(row, c.key, c.format)}
                      >
                        {c.key === "account_role" || c.key === "role"
                          ? roleLabel(
                              typeof row[c.key] === "string"
                                ? String(row[c.key])
                                : undefined,
                            )
                          : /status$/i.test(c.key) && row[c.key]
                            ? requestLabel(String(row[c.key]))
                            : c.key === "id" || c.key.endsWith("_id")
                              ? shortIdentifier(
                                  recordValue(row, c.key, c.format),
                                )
                              : recordValue(row, c.key, c.format)}
                      </span>
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(row);
                        setMutation("");
                        setError("");
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={config.columns.length + 1}>
                  {error || readError
                    ? "Records unavailable. Retry using Refresh."
                    : "No records match these filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <nav className="operations-pagination" aria-label="Record pages">
        <label>
          Rows per page
          <select
            value={pageSize}
            onChange={(event) => {
              setPage(1);
              setPageSize(Number(event.target.value));
            }}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </label>
        <span>
          {data
            ? `${data.total} records · Page ${page} of ${pages}`
            : "Records unavailable"}
        </span>
        <button disabled={busy || page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <button
          disabled={busy || !data || page >= pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </nav>
      <Modal
        isOpen={!!selected}
        onClose={() => {
          if (!saving) setSelected(null);
        }}
        title={`${config.title} record`}
        size="lg"
      >
        {selected && (
          <Link
            className="action-link"
            href={`/${routeRole}/${module}/${selected.id}`}
          >
            Open full record details
          </Link>
        )}
        <dl className="record-details">
          {selected &&
            Object.entries(selected)
              .filter(
                ([, value]) => typeof value !== "object" || value === null,
              )
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{fieldLabel(key)}</dt>
                  <dd>
                    {key === "role" || key === "account_role"
                      ? roleLabel(typeof value === "string" ? value : undefined)
                      : fieldValue(
                          value,
                          config.columns.find((c) => c.key === key)?.format ??
                            (/At$|_at$/.test(key) ? "date" : undefined),
                        )}
                  </dd>
                </div>
              ))}
        </dl>
        {selected &&
          ["vehicles", "drivers"].map(
            (relation) =>
              Array.isArray(selected[relation]) && (
                <section key={relation} className="workspace-section">
                  <h3>{fieldLabel(relation)}</h3>
                  {(selected[relation] as Record<string, unknown>[]).length ? (
                    (selected[relation] as Record<string, unknown>[]).map(
                      (row, index) => (
                        <dl
                          className="record-details related-record"
                          key={String(row.id || index)}
                        >
                          {Object.entries(row)
                            .filter(
                              ([, value]) =>
                                typeof value !== "object" || value === null,
                            )
                            .map(([key, value]) => (
                              <div key={key}>
                                <dt>{fieldLabel(key)}</dt>
                                <dd>
                                  {key === "role"
                                    ? roleLabel(String(value || ""))
                                    : fieldValue(
                                        value,
                                        /At$|_at$/.test(key)
                                          ? "date"
                                          : undefined,
                                      )}
                                </dd>
                              </div>
                            ))}
                        </dl>
                      ),
                    )
                  ) : (
                    <p>No related {relation} are recorded.</p>
                  )}
                </section>
              ),
          )}
        {selected &&
          !readOnly &&
          (module === "users" || module === "coupons") && (
            <div className="operations-toolbar">
              {mutation ? (
                <>
                  <p>
                    Confirm {mutation} for this{" "}
                    {module === "users" ? "user account" : "promo code"}?
                  </p>
                  <button disabled={saving} onClick={() => void saveMutation()}>
                    {saving ? "Saving…" : "Confirm change"}
                  </button>
                  <button disabled={saving} onClick={() => setMutation("")}>
                    Cancel change
                  </button>
                </>
              ) : module === "users" ? (
                ["active", "suspended", "banned"]
                  .filter((s) => s !== selected.status)
                  .map((s) => (
                    <button key={s} onClick={() => setMutation(s)}>
                      Set {s}
                    </button>
                  ))
              ) : (
                <button
                  onClick={() =>
                    setMutation(selected.is_active ? "deactivate" : "activate")
                  }
                >
                  {selected.is_active ? "Deactivate" : "Activate"} promo code
                </button>
              )}
            </div>
          )}
        {error && <p role="alert">{error}</p>}
      </Modal>
    </section>
  );
}
