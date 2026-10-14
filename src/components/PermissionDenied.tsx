"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-api";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
export function PermissionDenied() {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function logout() {
    setBusy(true);
    setError("");
    try {
      await adminApi("/auth/logout", "POST");
      router.replace("/login");
      router.refresh();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Sign out failed");
      setBusy(false);
    }
  }
  return (
    <main className="permission-state">
      <ShieldAlert size={36} />
      <h1>Access restricted</h1>
      <p>
        Your current account permissions do not allow this view. No protected
        records have been loaded.
      </p>
      <Link className="action-link" href="/admin">
        Return to your dashboard
      </Link>
      <button className="action-link" disabled={busy} onClick={logout}>
        {busy ? "Signing out…" : "Sign out"}
      </button>
      {error && <p role="alert">{error}</p>}
    </main>
  );
}
