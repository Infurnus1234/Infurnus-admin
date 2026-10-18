"use client";
import { useRef, useState } from "react";
import { permanentlyDeleteRecord } from "@/lib/admin-api";
import { useAdminAccess } from "./AdminAccessContext";
import { Modal } from "./ui/Modal";

export type DeletionModule =
  | "users"
  | "drivers"
  | "admins"
  | "partners"
  | "vehicles"
  | "vehicle-types"
  | "coupons";
export function DeleteRecord({
  module,
  id,
  label,
  onDeleted,
}: {
  module: DeletionModule;
  id: string;
  label: string;
  onDeleted: (message: string) => void;
}) {
  const can = useAdminAccess();
  const pending = useRef(false);
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const permission =
    (module === "vehicle-types" ? "pricing" : module) + ".delete";
  if (!can(permission)) return null;
  async function remove() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const message = await permanentlyDeleteRecord(module, id);
      setOpen(false);
      onDeleted(message);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Deletion failed. Please retry.",
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <button
        type="button"
        className="admin-button admin-button-secondary"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        Delete
      </button>
      <Modal
        isOpen={open}
        onClose={() => {
          if (!busy) setOpen(false);
        }}
        title="Confirm permanent deletion"
      >
        <p>Permanently delete {label}?</p>
        <p>Record ID: {id}</p>
        {["users", "drivers", "admins", "partners"].includes(module) && (
          <p>
            This removes the account, its eligible profiles and login
            credentials. The deleted account will lose access.
          </p>
        )}
        <p>
          This cannot be undone. Records with protected documents, financial or
          operational history cannot be deleted here. Active/Inactive is a
          separate action.
        </p>
        {error && <p role="alert">{error}</p>}
        <button type="button" disabled={busy} onClick={() => void remove()}>
          {busy ? "Deleting…" : "Permanently delete"}
        </button>
        <button type="button" disabled={busy} onClick={() => setOpen(false)}>
          Cancel
        </button>
      </Modal>
    </>
  );
}
