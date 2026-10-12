"use client";
import { useState } from "react";
import { useBackendQuery } from "@/lib/use-backend-query";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "./layout/PageHeader";
import { Modal } from "./ui/Modal";
interface VehicleType {
  id: string;
  name: string;
  code: string;
  sector: string;
  baseFare: number;
  perKmRate: number;
  currency: string;
  active: boolean;
  version: number;
}
const empty = {
  name: "",
  code: "",
  sector: "passenger",
  baseFare: "",
  perKmRate: "",
  active: false,
};
export function PricingConfiguration() {
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<VehicleType | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const {
    data,
    busy,
    error: readError,
    refresh: load,
  } = useBackendQuery<VehicleType[]>(
    `/admin/vehicle-types?limit=25&offset=${offset}`,
  );
  const types = data ?? [];
  function start(type: VehicleType | null) {
    setEditing(type);
    setForm(
      type
        ? {
            name: type.name,
            code: type.code,
            sector: type.sector,
            baseFare: String(type.baseFare),
            perKmRate: String(type.perKmRate),
            active: type.active,
          }
        : empty,
    );
    setConfirm(false);
    setError("");
    setNotice("");
    setOpen(true);
  }
  async function save() {
    setSaving(true);
    setError("");
    try {
      const common = {
        name: form.name.trim(),
        baseFare: Number(form.baseFare),
        perKmRate: Number(form.perKmRate),
        active: form.active,
      };
      await adminApi(
        editing ? `/admin/vehicle-types/${editing.id}` : "/admin/vehicle-types",
        editing ? "PATCH" : "POST",
        editing
          ? { ...common, expectedVersion: editing.version }
          : {
              ...common,
              code: form.code,
              sector: form.sector,
              currency: "INR",
            },
      );
      setOpen(false);
      setNotice("Configuration saved by the backend.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setConfirm(false);
    } finally {
      setSaving(false);
    }
  }
  return (
    <section className="workspace-section">
      <PageHeader
        title="Vehicle categories & distance pricing"
        description="Versioned INR rates maintained by the existing fare catalog."
      />
      <div className="operations-toolbar">
        <button onClick={() => start(null)}>Add category</button>
        <button disabled={busy} onClick={() => void load()}>
          Refresh
        </button>
      </div>
      {(error || readError) && (
        <p role="alert" className="workspace-error">
          {error || readError}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Vehicle pricing"
      >
        <table className="operations-table">
          <thead>
            <tr>
              {[
                "Name",
                "Code",
                "Sector",
                "Base fare (INR)",
                "Per km (INR)",
                "Active",
                "Version",
                "Action",
              ].map((label) => (
                <th key={label} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {busy ? (
              <tr>
                <td colSpan={8}>Loading…</td>
              </tr>
            ) : types.length ? (
              types.map((type) => (
                <tr key={type.id}>
                  <td>{type.name}</td>
                  <td>{type.code}</td>
                  <td>{type.sector}</td>
                  <td>{type.baseFare.toFixed(2)}</td>
                  <td>{type.perKmRate.toFixed(2)}</td>
                  <td>{type.active ? "Yes" : "No"}</td>
                  <td>{type.version}</td>
                  <td>
                    <button onClick={() => start(type)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>
                  No configured categories. Rates are not invented
                  automatically.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <nav className="operations-pagination" aria-label="Pricing pages">
        <span>Page {offset / 25 + 1}</span>
        <button
          disabled={busy || offset === 0}
          onClick={() => setOffset(offset - 25)}
        >
          Previous
        </button>
        <button
          disabled={busy || types.length < 25}
          onClick={() => setOffset(offset + 25)}
        >
          Next
        </button>
      </nav>
      <p className="workspace-note">
        Commission and surge configuration are not yet configured. The frontend
        uses only rates and calculations returned by the backend. Historical
        bookings keep their existing fare snapshots.
      </p>
      <Modal
        isOpen={open}
        onClose={() => {
          if (!saving) setOpen(false);
        }}
        title={
          confirm
            ? "Confirm pricing change"
            : editing
              ? "Edit category"
              : "Add category"
        }
      >
        {confirm ? (
          <>
            <p>
              This change is persisted to the fare catalog and may affect future
              bookings. Existing bookings are preserved. Base INR{" "}
              {form.baseFare}; per km INR {form.perKmRate}; active{" "}
              {form.active ? "Yes" : "No"}.
            </p>
            <div className="operations-toolbar">
              <button disabled={saving} onClick={() => void save()}>
                {saving ? "Saving…" : "Confirm and save"}
              </button>
              <button disabled={saving} onClick={() => setConfirm(false)}>
                Back
              </button>
            </div>
          </>
        ) : (
          <form
            className="pricing-form"
            onSubmit={(e) => {
              e.preventDefault();
              setConfirm(true);
            }}
          >
            <label>
              Name
              <input
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            {!editing && (
              <>
                <label>
                  Code
                  <input
                    required
                    pattern="[a-z][a-z0-9_]{0,49}"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                  />
                </label>
                <label>
                  Sector
                  <select
                    value={form.sector}
                    onChange={(e) =>
                      setForm({ ...form, sector: e.target.value })
                    }
                  >
                    {["passenger", "logistics", "service", "premium"].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      ),
                    )}
                  </select>
                </label>
              </>
            )}
            {(["baseFare", "perKmRate"] as const).map((key) => (
              <label key={key}>
                {key === "baseFare"
                  ? "Base fare (INR)"
                  : "Rate per kilometre (INR)"}
                <input
                  required
                  type="number"
                  min="0"
                  max="99999999.99"
                  step="0.01"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}
            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />{" "}
              Active for future estimates
            </label>
            <button className="workspace-primary" type="submit">
              Review change
            </button>
          </form>
        )}
        {error && <p role="alert">{error}</p>}
      </Modal>
    </section>
  );
}
