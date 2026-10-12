import Link from "next/link";
import { ShieldAlert } from "lucide-react";
export function PermissionDenied() {
  return (
    <main className="permission-state">
      <ShieldAlert size={36} />
      <h1>Access restricted</h1>
      <p>
        This page requires Super Admin access. Your current account permissions
        do not allow this view. No protected records have been loaded.
      </p>
      <Link className="action-link" href="/admin">
        Return to your dashboard
      </Link>
    </main>
  );
}
