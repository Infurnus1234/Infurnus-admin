"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PanelLeftOpen, UserRound } from "lucide-react";
import { UserProfile } from "@/types";
import { Modal } from "../ui/Modal";
import { GlobalSearch } from "./GlobalSearch";
export interface TopbarProps {
  user: UserProfile;
  onSidebarToggle: () => void;
  sidebarExpanded: boolean;
  className?: string;
}
export function Topbar({
  user,
  onSidebarToggle,
  sidebarExpanded,
  className = "",
}: TopbarProps) {
  const router = useRouter();
  const [account, setAccount] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/backend/auth/logout", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Unable to sign out. Please retry.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign out");
      setBusy(false);
    }
  }
  return (
    <>
      <header className={"workspace-topbar " + className}>
        <div className="topbar-context">
          {!sidebarExpanded && (
            <button
              id="show-sidebar"
              type="button"
              className="admin-sidebar-toggle"
              onClick={onSidebarToggle}
              aria-label="Show Sidebar"
              title="Show Sidebar"
              aria-controls="admin-sidebar"
              aria-expanded={false}
            >
              <PanelLeftOpen size={22} aria-hidden="true" />
            </button>
          )}
        </div>
        <GlobalSearch
          role={user.role === "super-admin" ? "super-admin" : "admin"}
        />
        <button
          className="account-trigger"
          onClick={() => setAccount(true)}
          aria-label="Open account"
        >
          <span className="account-avatar">
            {user.name.trim().slice(0, 1).toUpperCase() || (
              <UserRound size={18} />
            )}
          </span>
          <span className="account-label">
            <span>{user.name || "Administrator"}</span>
            <small>
              {user.role === "super-admin" ? "Super Admin" : "Admin"}
            </small>
          </span>
        </button>
      </header>
      <Modal
        isOpen={account}
        onClose={() => {
          if (!busy) setAccount(false);
        }}
        title="Your account"
        description="Signed in with your existing account permissions."
        footer={
          <>
            <button disabled={busy} onClick={() => setAccount(false)}>
              Close
            </button>
            <button className="primary-action" disabled={busy} onClick={logout}>
              {busy ? "Signing out…" : "Sign out"}
            </button>
          </>
        }
      >
        <dl className="detail-list">
          <dt>Name</dt>
          <dd>{user.name}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Role</dt>
          <dd>{user.role === "super-admin" ? "Super Admin" : "Admin"}</dd>
        </dl>
        {error && <p role="alert">{error}</p>}
      </Modal>
    </>
  );
}
