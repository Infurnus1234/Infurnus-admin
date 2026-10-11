import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
export default function Page() {
  return (
    <main className="portal-landing">
      <div className="portal-brand">
        <ShieldCheck size={28} aria-hidden="true" /> INFURNUS
      </div>
      <h1>One workspace for your operations.</h1>
      <p>Access your authorized tools for drivers, requests and approvals.</p>
      <div className="portal-grid">
        {[
          {
            name: "Admin",
            portal: "admin",
            description: "Manage the operations assigned to your account.",
          },
          {
            name: "Super Admin",
            portal: "super-admin",
            description:
              "Review operations with your existing elevated permissions.",
          },
        ].map((item) => (
          <Link
            className="overview-card"
            key={item.portal}
            href={"/login?portal=" + item.portal}
          >
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <span>
              Sign in <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
      <p className="workspace-caption">
        Accounts are provisioned by authorized administrators. Public signup is
        unavailable.
      </p>
    </main>
  );
}
