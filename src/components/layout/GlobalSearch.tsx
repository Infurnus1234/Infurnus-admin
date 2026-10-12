"use client";
import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Modal } from "../ui/Modal";
import { adminApi } from "@/lib/admin-api";
import { roleLabel } from "@/lib/request-models";
export function GlobalSearch({ role }: { role: "admin" | "super-admin" }) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [results, setResults] = useState<
    { id: string; name: string; type: string; href: string }[] | null
  >(null);
  async function search() {
    const term = query.trim();
    if (!term) return;
    setBusy(true);
    setError("");
    setResults(null);
    try {
      const accounts = await adminApi<{
        items: {
          id: string;
          firstName: string;
          lastName: string;
          role: string;
        }[];
      }>(`/admin/users?pageSize=10&search=${encodeURIComponent(term)}`);
      const vehicles =
        term.length <= 20
          ? await adminApi<{
              items: {
                id: string;
                plateNumber: string;
                make: string;
                model: string;
              }[];
            }>(`/admin/vehicles?pageSize=10&plate=${encodeURIComponent(term)}`)
          : { items: [] };
      const records = [
        ...accounts.items.map((row) => ({
          id: row.id,
          name:
            [row.firstName, row.lastName].filter(Boolean).join(" ") ||
            "Name unavailable",
          type: roleLabel(row.role),
          href: `/${role}/users/${row.id}`,
        })),
        ...vehicles.items.map((row) => ({
          id: row.id,
          name: row.plateNumber,
          type: [row.make, row.model].filter(Boolean).join(" "),
          href: `/${role}/vehicles/${row.id}`,
        })),
      ];
      if (/^[\da-f-]{36}$/i.test(term))
        for (const source of [
          "rides",
          "logistics",
          "rentals",
          ...(role === "super-admin" ? ["payments"] : []),
        ]) {
          const page = await adminApi<{
            items: {
              id: string;
              account_display_name?: string;
              status: string;
            }[];
          }>(
            `/admin/operations/${source}?pageSize=5&search=${encodeURIComponent(term)}`,
          );
          for (const row of page.items)
            records.push({
              id: row.id,
              name: row.account_display_name || "Name unavailable",
              type: `${source} · ${row.status}`,
              href: `/${role}/${source === "payments" ? "finance" : source}/${row.id}`,
            });
        }
      setResults(records);
    } catch {
      setError("Search could not be completed. Check your session and retry.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="topbar-search">
        <button
          onClick={() => setOpen(true)}
          aria-label="Search accounts, vehicles and booking IDs"
        >
          <Search size={17} />
          <span>Search people, vehicles or record IDs…</span>
        </button>
      </div>
      <Modal
        isOpen={open}
        onClose={() => {
          if (!busy) setOpen(false);
        }}
        title="Search the workspace"
        size="lg"
      >
        <form
          className="operations-toolbar"
          onSubmit={(e) => {
            e.preventDefault();
            void search();
          }}
        >
          <label>
            Search name, email, phone, registration or record ID
            <input
              value={query}
              maxLength={100}
              required
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <button
            className="workspace-primary"
            disabled={busy || !query.trim()}
          >
            {busy ? "Searching…" : "Search"}
          </button>
        </form>
        {error && (
          <p role="alert" className="workspace-error">
            {error}
          </p>
        )}
        {results && (
          <div className="global-search-results">
            {results.length ? (
              results.map((row, index) => (
                <Link
                  key={row.id + index}
                  href={row.href}
                  onClick={() => setOpen(false)}
                >
                  <strong>{row.name}</strong>
                  <span>{row.type}</span>
                </Link>
              ))
            ) : (
              <p>No matching authorized records.</p>
            )}
          </div>
        )}
        <p className="admin-muted">
          Only existing authorized account, vehicle and exact booking/payment ID
          searches are supported. No audit shortcuts or private credentials are
          searched.
        </p>
      </Modal>
    </>
  );
}
