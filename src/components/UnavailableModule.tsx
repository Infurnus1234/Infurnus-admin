import Link from "next/link";
import { PlugZap, ArrowRight, ShieldCheck } from "lucide-react";
import { PageHeader } from "./layout/PageHeader";

export function UnavailableModule({
  title,
  role = "super-admin",
}: {
  title: string;
  role?: "admin" | "super-admin";
}) {
  return (
    <section className="workspace-section">
      <PageHeader
        title={title}
        description="Your operations workspace"
        breadcrumbs={[
          {
            label: role === "admin" ? "Admin" : "Super Admin",
            href: `/${role}`,
          },
          { label: title },
        ]}
      />
      <div className="unavailable-panel">
        <div className="state-icon">
          <PlugZap size={28} aria-hidden="true" />
        </div>
        <span className="status-badge" data-status="unavailable">
          Not available yet
        </span>
        <h2>{title} is not connected yet</h2>
        <p>
          This feature is not available for live operations. No records or
          changes are presented here until its approved integration is ready.
        </p>
        <Link className="action-link" href={`/${role}/driver-requests`}>
          Open live driver requests <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <p className="state-footnote">
          <ShieldCheck size={16} aria-hidden="true" /> Your account permissions
          remain unchanged.
        </p>
      </div>
    </section>
  );
}
