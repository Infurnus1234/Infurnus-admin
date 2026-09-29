"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DetailedFleet, MOCK_FLEETS } from "@/lib/fleetVehiclePartnerData";
import { PageHeader, Button, Badge, Card, DataTable } from "@/components";
import { Column } from "@/types";
import { Search, Eye, Layers, TrendingUp } from "lucide-react";

export default function FleetsListPage() {
  const [fleets, setFleets] = useState<DetailedFleet[]>(MOCK_FLEETS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFleets = fleets.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<DetailedFleet>[] = [
    {
      key: "fleet",
      header: "Fleet Name",
      render: (f) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#5D7052] text-white flex items-center justify-center font-bold text-xs shadow-moss">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <Link href={`/super-admin/fleets/${f.id}`} className="font-bold text-xs text-[#2C2C24] hover:text-[#5D7052]">
              {f.name}
            </Link>
            <p className="text-[11px] text-[#78786C] font-mono">{f.code} • Manager: {f.managerName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "partner",
      header: "Parent Partner",
      render: (f) => <span className="text-xs font-bold text-[#C18C5D]">{f.partnerName}</span>,
    },
    {
      key: "vehicles",
      header: "Vehicles",
      render: (f) => <span className="text-xs font-bold text-[#2C2C24] font-mono">{f.vehicleCount} Vehicles</span>,
    },
    {
      key: "drivers",
      header: "Drivers",
      render: (f) => <span className="text-xs font-bold text-[#5D7052] font-mono">{f.driverCount} Drivers</span>,
    },
    {
      key: "location",
      header: "Location",
      render: (f) => <span className="text-xs text-[#78786C] font-semibold">{f.city}, {f.district}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (f) => <Badge variant={f.status === "Active" ? "moss" : "destructive"} dot size="sm">{f.status}</Badge>,
    },
    {
      key: "performance",
      header: "Performance",
      render: (f) => (
        <div className="text-xs font-bold text-[#2C2C24]">
          <p>Util: <span className="text-[#5D7052]">{f.utilizationRate}%</span></p>
          <p className="text-[10px] text-[#78786C]">On-Time: {f.onTimeRate}%</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (f) => (
        <Link href={`/super-admin/fleets/${f.id}`}>
          <Button variant="ghost" size="sm" className="p-1.5 rounded-full hover:bg-[#E6DCCD]" title="View Fleet Details">
            <Eye className="w-4 h-4 text-[#5D7052]" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title="Fleet Management"
        description="Regional fleet divisions, asset allocation, dispatch performance, and manager accountability."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Fleets" },
        ]}
      />

      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search fleets by name, code, partner, or city..."
          className="w-full bg-white border border-[#DED8CF] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052] transition-all"
        />
      </div>

      <DataTable columns={columns} data={filteredFleets} keyExtractor={(f) => f.id} />
    </div>
  );
}
