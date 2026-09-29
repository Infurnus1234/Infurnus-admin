"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DetailedPartner, MOCK_PARTNERS } from "@/lib/fleetVehiclePartnerData";
import { PageHeader, Button, Badge, Card, DataTable } from "@/components";
import { Column } from "@/types";
import { Search, Eye, Building2, RefreshCw } from "lucide-react";

export default function PartnersListPage() {
  const [partners, setPartners] = useState<DetailedPartner[]>(MOCK_PARTNERS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<DetailedPartner>[] = [
    {
      key: "partner",
      header: "Partner Organization",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#C18C5D] text-white flex items-center justify-center font-bold text-xs shadow-terracotta">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <Link href={`/super-admin/partners/${p.id}`} className="font-bold text-xs text-[#2C2C24] hover:text-[#5D7052]">
              {p.name}
            </Link>
            <p className="text-[11px] text-[#78786C] font-mono">{p.code} • {p.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "fleetCount",
      header: "Fleet Count",
      render: (p) => <span className="text-xs font-bold text-[#5D7052] font-mono">{p.fleetCount} Fleets</span>,
    },
    {
      key: "vehicleCount",
      header: "Vehicle Count",
      render: (p) => <span className="text-xs font-bold text-[#2C2C24] font-mono">{p.vehicleCount} Vehicles</span>,
    },
    {
      key: "driverCount",
      header: "Driver Count",
      render: (p) => <span className="text-xs font-bold text-[#C18C5D] font-mono">{p.driverCount} Drivers</span>,
    },
    {
      key: "location",
      header: "Location",
      render: (p) => <span className="text-xs text-[#78786C] font-semibold">{p.city}, {p.country}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (p) => <Badge variant={p.status === "Active" ? "moss" : "destructive"} dot size="sm">{p.status}</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (p) => (
        <Link href={`/super-admin/partners/${p.id}`}>
          <Button variant="ghost" size="sm" className="p-1.5 rounded-full hover:bg-[#E6DCCD]" title="View Partner Detail">
            <Eye className="w-4 h-4 text-[#5D7052]" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title="Partner Management"
        description="Global transport partner organizations, fleet allotments, vehicle registrations, and agreement statuses."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Partners" },
        ]}
      />

      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search partners by name, code, or city..."
          className="w-full bg-white border border-[#DED8CF] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052] transition-all"
        />
      </div>

      <DataTable columns={columns} data={filteredPartners} keyExtractor={(p) => p.id} />
    </div>
  );
}
