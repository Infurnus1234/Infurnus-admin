"use client";
import Link from "next/link";
import { useState } from "react";
import { useBackendQuery } from "@/lib/use-backend-query";

function fieldLabel(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/^./, (c) => c.toUpperCase());
}
type Row = Record<string, unknown>;
type Overview = {
  owner: Row;
  section: string;
  items: Row[];
  hasNext: boolean;
  bank?: Row | null;
};
const sections = [
  "profile",
  "documents",
  "bank",
  "vehicles",
  "drivers",
  "activity",
] as const;
const labels = {
  profile: "Profile",
  documents: "Identity & vehicle documents",
  bank: "Bank details & history",
  vehicles: "Vehicles",
  drivers: "Drivers",
  activity: "Review activity",
};
export function FleetOwnerWorkspace({ partnerId }: { partnerId: string }) {
  const [section, setSection] = useState<(typeof sections)[number]>("profile");
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const query = new URLSearchParams({
    section,
    limit: "25",
    offset: String(offset),
    search,
    status,
  });
  const { data, busy, error, refresh } = useBackendQuery<Overview>(
    `/provider-approvals/fleet-owners/${partnerId}/overview?${query}`,
  );
  return (
    <article className="review-card">
      <h2>Fleet Owner management</h2>
      <p className="admin-muted">
        Identity and bank data are restricted to Super Admins. Review decisions
        use the existing independent approval workflow.
      </p>
      <Link href="/super-admin/document-policies">
        Configure global document requirements
      </Link>
      <nav className="operations-toolbar" aria-label="Fleet Owner sections">
        {sections.map((s) => (
          <button
            key={s}
            aria-pressed={section === s}
            onClick={() => {
              setSection(s);
              setOffset(0);
              setStatus("ALL");
              setSearch("");
            }}
          >
            {labels[s]}
          </button>
        ))}
      </nav>
      {section !== "profile" && section !== "bank" && (
        <div className="operations-toolbar">
          <label>
            Search
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOffset(0);
              }}
            />
          </label>
          <label>
            Status
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setOffset(0);
              }}
            >
              {[
                "ALL",
                "PENDING",
                "SUBMITTED",
                "VERIFIED",
                "APPROVED",
                "REJECTED",
                "EXPIRED",
                "CANCELLED",
                "ACTION_REQUIRED",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      {busy && <p role="status">Loading authorized records…</p>}
      {error && <p role="alert">{error}</p>}
      {data && (
        <>
          {section === "profile" && (
            <dl className="review-fields">
              {Object.entries(data.owner).map(([k, v]) => (
                <div key={k}>
                  <dt>{fieldLabel(k)}</dt>
                  <dd>{String(v ?? "Not provided")}</dd>
                </div>
              ))}
            </dl>
          )}
          {section === "bank" && (
            <>
              <p>
                Documentary approval does not establish bank ownership or enable
                payouts. No automated bank verification is configured.
              </p>
              {data.bank?.supportingDocumentApprovalId ? (
                <Link
                  href={`/super-admin/driver-requests/${data.bank.supportingDocumentApprovalId}`}
                >
                  Review private bank proof and holder name
                </Link>
              ) : null}
              {data.bank ? (
                <dl className="review-fields">
                  {[
                    "accountHolderName",
                    "bankName",
                    "branchName",
                    "accountNumberMasked",
                    "ifscCode",
                    "accountType",
                    "ownershipType",
                    "legalEntityName",
                    "nameComparison",
                    "supportingDocumentStatus",
                    "isVerified",
                    "reviewStatus",
                    "rejectionReason",
                  ].map((k) => (
                    <div key={k}>
                      <dt>{fieldLabel(k)}</dt>
                      <dd>{String(data.bank?.[k] ?? "Not provided")}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>No bank details submitted.</p>
              )}
            </>
          )}
          {data.items.map((row) => (
            <article className="review-card" key={String(row.id)}>
              <dl className="review-fields">
                {Object.entries(row)
                  .filter(
                    ([k, v]) =>
                      !["id", "userId", "approvalId", "snapshot"].includes(k) &&
                      (v === null || typeof v !== "object"),
                  )
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt>{fieldLabel(k)}</dt>
                      <dd>{String(v ?? "Not provided")}</dd>
                    </div>
                  ))}
              </dl>
              {row.approvalId ? (
                <Link href={`/super-admin/driver-requests/${row.approvalId}`}>
                  Open private documents & review history
                </Link>
              ) : null}
              {section === "vehicles" && (
                <Link href={`/super-admin/vehicles/${row.id}`}>
                  Vehicle details & authorized actions
                </Link>
              )}
              {section === "drivers" && (
                <Link href={`/super-admin/drivers/${row.id}`}>
                  Driver details & documents
                </Link>
              )}
              {section === "activity" && (
                <Link href={`/super-admin/driver-requests/${row.id}`}>
                  Review decision and history
                </Link>
              )}
            </article>
          ))}
          {section !== "profile" && data.items.length === 0 && (
            <p>No matching records.</p>
          )}
          <div className="pagination">
            <button
              disabled={offset === 0 || busy}
              onClick={() => setOffset((n) => Math.max(0, n - 25))}
            >
              Previous
            </button>
            <span>Page {Math.floor(offset / 25) + 1}</span>
            <button
              disabled={!data.hasNext || busy}
              onClick={() => setOffset((n) => n + 25)}
            >
              Next
            </button>
          </div>
        </>
      )}
      <button onClick={refresh} disabled={busy}>
        Refresh management records
      </button>
    </article>
  );
}
