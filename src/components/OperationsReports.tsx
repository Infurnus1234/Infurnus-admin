"use client";
import { useState } from "react";
import { OperationsRecords } from "./OperationsRecords";
import type { ModuleKey } from "@/lib/operations";
import { PageHeader } from "./layout/PageHeader";
export function OperationsReports() {
  const [source, setSource] = useState<ModuleKey>("users");
  return (
    <section className="workspace-section">
      <PageHeader
        title="Reports & Analytics"
        description="Explore current authorized records by source. Export and advanced analytics are not connected."
      />
      <div className="operations-toolbar">
        <label>
          Report source
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as ModuleKey)}
          >
            <option value="users">Customer records</option>
            <option value="partners">Partner records</option>
            <option value="vehicles">Vehicle inventory</option>
            <option value="rides">Ride bookings</option>
            <option value="logistics">Logistics orders</option>
          </select>
        </label>
        <p>
          Current authorized backend records. Filters and pagination apply to
          the selected source.
        </p>
      </div>
      <OperationsRecords
        key={source}
        module={source}
        readOnly
        headingLevel={2}
      />
    </section>
  );
}
