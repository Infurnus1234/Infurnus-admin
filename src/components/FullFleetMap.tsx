"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useBackendQuery } from "@/lib/use-backend-query";
import { FleetMap } from "./FleetMap";
import type { FleetMapVehicle } from "@/lib/fleet-map";
export function FullFleetMap({ role }: { role: "admin" | "super-admin" }) {
  const [page, setPage] = useState(1);
  const { data, busy, error, refresh } = useBackendQuery<{
    items: FleetMapVehicle[];
    total: number;
  }>(`/admin/fleet/vehicles?pageSize=100&page=${page}`);
  useEffect(() => {
    const timer = setInterval(refresh, 15000);
    return () => clearInterval(timer);
  }, [refresh]);
  return (
    <section className="full-fleet-map space-y-4">
      <div className="flex flex-wrap justify-between gap-4">
        <h1 className="text-2xl font-semibold">Fleet map</h1>
        <Link href={`/${role}`} className="action-link">
          Return to dashboard
        </Link>
        <button onClick={refresh} disabled={busy}>
          Refresh locations
        </button>
      </div>
      <p>
        Up to 100 authorized fleet records on page {page}. Locations are polled every 15
        seconds; only coordinates marked fresh by the backend are shown.{" "}
        {data?.total ?? "Loading"} fleet records match.
      </p>
      <nav aria-label="Map vehicle pages"><button disabled={busy || page<=1} onClick={()=>setPage(page-1)}>Previous vehicles</button><button disabled={busy || !data || page*100>=data.total} onClick={()=>setPage(page+1)}>Next vehicles</button></nav>
      <FleetMap
        fullPage
        role={role}
        vehicles={data?.items || []}
        busy={busy}
        error={error}
      />
    </section>
  );
}
