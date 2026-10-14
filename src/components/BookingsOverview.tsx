"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { bookingGroupStatus } from "@/lib/dashboard-navigation";
import { OperationsRecords } from "./OperationsRecords";
import { PageHeader } from "./layout/PageHeader";
function BookingsContent() {
  const query = useSearchParams(),
    group = query.get("group") || "all";
  return (
    <section className="workspace-section">
      <PageHeader
        title={
          group === "completed"
            ? "Completed bookings"
            : group === "cancelled"
              ? "Cancelled bookings"
              : "All bookings"
        }
        description="Actual ride, logistics and rental records; each source retains its backend status and pagination."
      />
      {(["rides", "logistics", "rentals"] as const).map((module) => (
        <OperationsRecords
          key={module + query.toString()}
          module={module}
          readOnly
          headingLevel={2}
          initialStatus={bookingGroupStatus(group, module)}
        />
      ))}
    </section>
  );
}
export function BookingsOverview() {
  return (
    <Suspense fallback={<p role="status">Loading booking filters…</p>}>
      <BookingsContent />
    </Suspense>
  );
}
