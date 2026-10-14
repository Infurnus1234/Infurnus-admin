"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminApi } from "@/lib/admin-api";
import { useAdminAccess } from "./AdminAccessContext";
import {
  emptyVehicleForm,
  vehicleForm,
  vehiclePayload,
} from "@/lib/vehicle-form";
import { Modal } from "./ui/Modal";
export function VehicleActions({
  vehicleId,
  onSaved,
}: {
  vehicleId?: string;
  onSaved: () => void;
}) {
  const can = useAdminAccess();
  const role = usePathname().startsWith("/super-admin")
    ? "super-admin"
    : "admin";
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [form, setForm] = useState(emptyVehicleForm),
    [confirm, setConfirm] = useState(false),
    [inactive, setInactive] = useState(false),
    [retire, setRetire] = useState(false);
  async function start() {
    if (busy) return;
    setError("");
    setNotice("");
    setConfirm(false);
    setRetire(false);
    if (vehicleId) {
      setBusy(true);
      try {
        const record = await adminApi<Record<string, unknown>>(
          `/vehicles/${vehicleId}`,
        );
        if (record.retiredAt)
          throw new Error("Retired vehicle history is read-only.");
        setForm(vehicleForm(record));
        setInactive(record.isActive === false);
        setOpen(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Vehicle unavailable.");
      } finally {
        setBusy(false);
      }
    } else {
      setForm(emptyVehicleForm);
      setOpen(true);
    }
  }
  async function save() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await adminApi(
        vehicleId
          ? `/vehicles/${vehicleId}${retire ? "/deactivate" : ""}`
          : "/vehicles",
        retire || !vehicleId ? "POST" : "PATCH",
        retire ? {} : vehiclePayload(form, !!vehicleId),
      );
      setOpen(false);
      setNotice(
        retire
          ? "Vehicle deactivated by the backend."
          : "Vehicle saved by the backend.",
      );
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
      setConfirm(false);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button
        type="button"
        disabled={
          busy ||
          (vehicleId
            ? !can("vehicles.update") && !can("vehicles.deactivate")
            : !can("vehicles.create"))
        }
        onClick={() => void start()}
      >
        {busy ? "Loading…" : vehicleId ? "Edit vehicle" : "Add vehicle"}
      </button>
      {error && !open && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      <Modal
        isOpen={open}
        onClose={() => {
          if (!busy) setOpen(false);
        }}
        title={vehicleId ? "Edit vehicle" : "Add vehicle"}
        size="lg"
      >
        {confirm ? (
          <>
            <p>
              {retire
                ? "Deactivate this vehicle? The backend retains its history and enforces retirement rules."
                : "Save this vehicle inventory record? Category pricing is managed separately."}
            </p>
            <div className="operations-toolbar">
              <button disabled={busy} onClick={() => setConfirm(false)}>
                Cancel
              </button>
              <button
                className="workspace-primary"
                disabled={busy}
                onClick={() => void save()}
              >
                {busy ? "Saving…" : "Confirm"}
              </button>
            </div>
          </>
        ) : (
          <form
            className="configuration-form"
            onSubmit={(event) => {
              event.preventDefault();
              setError("");
              try {
                vehiclePayload(form, !!vehicleId);
                setRetire(false);
                setConfirm(true);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Invalid vehicle.");
              }
            }}
          >
            <Link className="action-link" href={`/${role}/pricing`}>
              Manage category base fare, per-km rates and ranges
            </Link>
            {(
              [
                "make",
                "model",
                "plateNumber",
                "color",
                "category",
                "fuelType",
                "permitDetails",
                ...(!vehicleId ? ["ownerId", "driverProfileId"] : []),
              ] as (keyof typeof emptyVehicleForm)[]
            ).map((key) => (
              <label key={key}>
                {
                  (
                    {
                      make: "Make",
                      model: "Model",
                      plateNumber: "Registration number",
                      color: "Colour",
                      category: "Vehicle category code",
                      fuelType: "Fuel type",
                      permitDetails: "Permit details",
                      ownerId: "Owner account UUID (optional)",
                      driverProfileId: "Driver profile UUID (optional)",
                    } as Record<string, string>
                  )[key]
                }
                <input
                  value={String(form[key])}
                  required={[
                    "make",
                    "model",
                    "plateNumber",
                    "category",
                  ].includes(key)}
                  maxLength={
                    key === "plateNumber"
                      ? 20
                      : key === "permitDetails"
                        ? 5000
                        : key === "color" || key === "fuelType"
                          ? 30
                          : key.endsWith("Id")
                            ? 36
                            : 50
                  }
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}
            <label>
              Sector
              <select
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
              >
                {["passenger", "logistics", "service", "premium", "rental"].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </label>
            {(
              [
                "fuelRatePerKm",
                "loadCapacityKg",
                "manufacturingYear",
                "seatingCapacity",
              ] as const
            ).map((key) => (
              <label key={key}>
                {
                  {
                    fuelRatePerKm: "Fuel cost per km (INR; not the rider fare)",
                    loadCapacityKg: "Load capacity (kg)",
                    manufacturingYear: "Manufacturing year",
                    seatingCapacity: "Seating capacity",
                  }[key]
                }
                <input
                  type="number"
                  min={
                    key === "manufacturingYear"
                      ? 1900
                      : key === "seatingCapacity"
                        ? 1
                        : 0
                  }
                  max={
                    key === "manufacturingYear"
                      ? 2100
                      : key === "seatingCapacity"
                        ? 100
                        : undefined
                  }
                  step={
                    key === "manufacturingYear" || key === "seatingCapacity"
                      ? 1
                      : "any"
                  }
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}
            {(["registrationDate", "registrationExpiry"] as const).map(
              (key) => (
                <label key={key}>
                  {key === "registrationDate"
                    ? "Registration date"
                    : "Registration expiry"}
                  <input
                    type="date"
                    value={form[key]}
                    min={
                      key === "registrationExpiry"
                        ? form.registrationDate
                        : undefined
                    }
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </label>
              ),
            )}
            <label>
              <input
                type="checkbox"
                checked={form.isCommercial}
                onChange={(e) =>
                  setForm({ ...form, isCommercial: e.target.checked })
                }
              />{" "}
              Commercial vehicle
            </label>
            <div className="operations-toolbar">
              <button
                type="submit"
                className="workspace-primary"
                disabled={
                  busy ||
                  !can(vehicleId ? "vehicles.update" : "vehicles.create")
                }
              >
                Review change
              </button>
              {vehicleId && can("vehicles.deactivate") && (
                <button
                  type="button"
                  disabled={busy || inactive}
                  onClick={() => {
                    setError("");
                    setRetire(true);
                    setConfirm(true);
                  }}
                >
                  Deactivate vehicle
                </button>
              )}
            </div>
          </form>
        )}
        {error && <p role="alert">{error}</p>}
      </Modal>
    </>
  );
}
