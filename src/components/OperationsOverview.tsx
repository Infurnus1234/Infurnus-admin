import Link from "next/link";
import { Car, ClipboardCheck, ArrowRight, Inbox } from "lucide-react";
import { PageHeader } from "./layout/PageHeader";
export function OperationsOverview({
  role,
}: {
  role: "admin" | "super-admin";
}) {
  const items = [
    {
      path: "drivers",
      title: "Drivers",
      description: "View verified account and document information.",
      icon: Car,
    },
    {
      path: "driver-requests",
      title: "Driver requests",
      description: "Review pending provider changes and their history.",
      icon: Inbox,
    },
    {
      path: "approvals",
      title: "Approval center",
      description: "Review provider requests and fleet applications.",
      icon: ClipboardCheck,
    },
  ];
  return (
    <section className="workspace-section">
      <PageHeader
        title="Operations overview"
        description="Manage the work that keeps your network moving."
      />
      <div className="overview-grid">
        {items.map((item) => (
          <Link
            key={item.path}
            href={`/${role}/${item.path}`}
            className="overview-card"
          >
            <item.icon size={24} aria-hidden="true" />
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <span>
              Open workspace <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
      <div className="workspace-note">
        Drivers, requests and approvals are connected to live operations. Other
        modules remain unavailable until their integrations are ready.
      </div>
    </section>
  );
}
