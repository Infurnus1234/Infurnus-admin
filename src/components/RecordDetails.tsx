"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useBackendQuery } from "@/lib/use-backend-query";
import {
  operationConfigs,
  fieldLabel,
  fieldValue,
  type ModuleKey,
} from "@/lib/operations";
import { roleLabel, requestLabel } from "@/lib/request-models";
import { PageHeader } from "./layout/PageHeader";
export function RecordDetails({
  module,
  id,
  role,
}: {
  module: ModuleKey;
  id: string;
  role: "admin" | "super-admin";
}) {
  const config = operationConfigs[module];
  const direct = ["users", "partners", "vehicles", "fleets"].includes(module);
  const path = direct
    ? `${config.endpoint}/${id}`
    : `${config.endpoint}?recordId=${id}&pageSize=1`;
  const { data, busy, error, refresh } =
    useBackendQuery<Record<string, unknown>>(path);
  const row = direct
    ? data
    : (data?.items as Record<string, unknown>[] | undefined)?.[0];
  const parent = `/${role}/${module}`;
  if (busy)
    return (
      <div className="review-card" role="status">
        Loading record…
      </div>
    );
  return (
    <section className="workspace-section">
      <PageHeader
        title={`${config.title} details`}
        breadcrumbs={[
          { label: config.title, href: parent },
          { label: "Details" },
        ]}
        actions={
          <Link className="admin-button admin-button-secondary" href={parent}>
            <ArrowLeft size={16} />
            Back to {config.title.toLowerCase()}
          </Link>
        }
      />
      {!row ? (
        <div className="review-card">
          <h2>Record unavailable</h2>
          <p role="alert">
            {error || "No authorized record was found for this identifier."}
          </p>
          <button onClick={refresh}>Retry</button>
        </div>
      ) : (
        <>
          <article className="review-card">
            <h2>
              {String(
                row.businessName ||
                  row.plateNumber ||
                  row.account_display_name ||
                  [row.firstName, row.lastName].filter(Boolean).join(" ") ||
                  "Record information",
              )}
            </h2>
            {row.role || row.account_role ? (
              <p className="admin-muted">
                {roleLabel(String(row.role || row.account_role))}
              </p>
            ) : null}
            {config.note && <p className="admin-muted">{config.note}</p>}
            <dl className="review-fields">
              {Object.entries(row)
                .filter(
                  ([key, value]) =>
                    (value === null || typeof value !== "object") &&
                    !/storage|token|password|secret|metadata/i.test(key),
                )
                .map(([key, value]) => (
                  <div key={key}>
                    <dt>{fieldLabel(key)}</dt>
                    <dd>
                      {key === "role" || key === "account_role"
                        ? roleLabel(
                            typeof value === "string" ? value : undefined,
                          )
                        : /status$/i.test(key) && typeof value === "string"
                          ? requestLabel(value)
                          : fieldValue(
                              value,
                              config.columns.find((c) => c.key === key)
                                ?.format ??
                                (/At$|_at$/.test(key) ? "date" : undefined),
                            )}
                    </dd>
                  </div>
                ))}
            </dl>
          </article>
          {["vehicles", "drivers"].map(
            (relation) =>
              Array.isArray(row[relation]) && (
                <article className="review-card" key={relation}>
                  <h2>Related {relation}</h2>
                  <div className="review-related-records">
                    {(row[relation] as Record<string, unknown>[]).map(
                      (record) => (
                        <Link
                          href={`/${role}/${relation}/${record.id}`}
                          key={String(record.id)}
                        >
                          <strong>
                            {relation === "drivers"
                              ? [record.firstName, record.lastName]
                                  .filter(Boolean)
                                  .join(" ") || "Name unavailable"
                              : String(
                                  record.plateNumber ||
                                    "Registration unavailable",
                                )}
                          </strong>
                          <span>
                            {requestLabel(
                              String(record.verificationStatus || "UNKNOWN"),
                            )}
                          </span>
                        </Link>
                      ),
                    )}
                  </div>
                </article>
              ),
          )}
          <button onClick={refresh}>Refresh record</button>
        </>
      )}
    </section>
  );
}
