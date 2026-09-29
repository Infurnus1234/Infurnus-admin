"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DetailedVehicle, MOCK_VEHICLES } from "@/lib/fleetVehiclePartnerData";
import {
  PageHeader,
  Button,
  Select,
  Badge,
  Card,
  DataTable,
  EmptyState,
  LoadingState,
} from "@/components";
import { Column } from "@/types";
import { Search, Download, RefreshCw, Eye, SlidersHorizontal, ChevronLeft, ChevronRight, Car } from "lucide-react";

export default function VehiclesListPage() {
  const [vehicles, setVehicles] = useState<DetailedVehicle[]>(MOCK_VEHICLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Filters
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [maintenanceFilter, setMaintenanceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.registrationPlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.fleetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.assignedDriver.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (typeFilter !== "All" && v.type !== typeFilter) return false;
      if (categoryFilter !== "All" && v.category !== categoryFilter) return false;
      if (availabilityFilter !== "All" && v.availability !== availabilityFilter) return false;
      if (maintenanceFilter !== "All" && v.maintenanceStatus !== maintenanceFilter) return false;
      if (statusFilter !== "All" && v.operationalStatus !== statusFilter) return false;

      return true;
    });
  }, [vehicles, searchQuery, typeFilter, categoryFilter, availabilityFilter, maintenanceFilter, statusFilter]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Plate,Model,Type,Category,Owner,Partner,Fleet,Driver,City,Availability,Maintenance,Status"]
        .concat(
          filteredVehicles.map(
            (v) => `${v.id},"${v.registrationPlate}","${v.model}",${v.type},${v.category},"${v.owner}","${v.partnerName}","${v.fleetName}","${v.assignedDriver.name}",${v.location.city},${v.availability},${v.maintenanceStatus},${v.operationalStatus}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `infurnus_vehicles_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<DetailedVehicle>[] = [
    {
      key: "registration",
      header: "Registration",
      render: (v) => (
        <div>
          <Link href={`/super-admin/vehicles/${v.id}`} className="font-bold text-xs text-[#2C2C24] hover:text-[#5D7052]">
            {v.registrationPlate}
          </Link>
          <p className="text-[11px] text-[#78786C]">{v.make} {v.model} ({v.year})</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (v) => <Badge variant="sand" size="sm">{v.type}</Badge>,
    },
    {
      key: "category",
      header: "Category",
      render: (v) => <span className="text-xs font-semibold text-[#5D7052]">{v.category}</span>,
    },
    {
      key: "owner",
      header: "Owner",
      render: (v) => <span className="text-xs text-[#78786C] font-medium">{v.owner}</span>,
    },
    {
      key: "partner",
      header: "Partner",
      render: (v) => <span className="text-xs font-bold text-[#C18C5D]">{v.partnerName}</span>,
    },
    {
      key: "fleet",
      header: "Fleet",
      render: (v) => <span className="text-xs font-medium text-[#2C2C24]">{v.fleetName}</span>,
    },
    {
      key: "driver",
      header: "Assigned Driver",
      render: (v) => (
        <span className="text-xs font-bold text-[#5D7052]">{v.assignedDriver.name}</span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (v) => <span className="text-xs text-[#78786C]">{v.location.city}, {v.location.district}</span>,
    },
    {
      key: "availability",
      header: "Availability",
      render: (v) => (
        <Badge
          variant={
            v.availability === "Available"
              ? "moss"
              : v.availability === "On Ride"
              ? "terracotta"
              : "muted"
          }
          dot
          size="sm"
        >
          {v.availability}
        </Badge>
      ),
    },
    {
      key: "maintenance",
      header: "Maintenance",
      render: (v) => (
        <Badge
          variant={
            v.maintenanceStatus === "Good"
              ? "moss"
              : v.maintenanceStatus === "Due Soon"
              ? "terracotta"
              : "destructive"
          }
          size="sm"
        >
          {v.maintenanceStatus}
        </Badge>
      ),
    },
    {
      key: "operationalStatus",
      header: "Operational Status",
      render: (v) => (
        <Badge variant={v.operationalStatus === "Active" ? "moss" : "destructive"} size="sm">
          {v.operationalStatus}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (v) => (
        <Link href={`/super-admin/vehicles/${v.id}`}>
          <Button variant="ghost" size="sm" className="p-1.5 rounded-full hover:bg-[#E6DCCD]" title="View Vehicle Details">
            <Eye className="w-4 h-4 text-[#5D7052]" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title="Vehicle Fleet Registry"
        description="Global vehicle inventory, maintenance tracking, driver assignments, and operational compliance."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Vehicles" },
        ]}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant={isFilterVisible ? "primary" : "outline"}
              size="sm"
              icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
              onClick={() => setIsFilterVisible((prev) => !prev)}
            >
              Filters {isFilterVisible ? "(Active)" : ""}
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plate, model, partner, or fleet..."
            className="w-full bg-white border border-[#DED8CF] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052] transition-all"
          />
        </div>

        {isFilterVisible && (
          <Card variant="sand" rounded="2xl" padding="md" className="animate-in fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <Select
                label="Vehicle Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { label: "All Types", value: "All" },
                  { label: "EV Sedan", value: "EV Sedan" },
                  { label: "Hybrid SUV", value: "Hybrid SUV" },
                  { label: "Standard Sedan", value: "Standard Sedan" },
                ]}
              />
              <Select
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { label: "All Categories", value: "All" },
                  { label: "Eco", value: "Eco" },
                  { label: "Premium", value: "Premium" },
                ]}
              />
              <Select
                label="Availability"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                options={[
                  { label: "All Availability", value: "All" },
                  { label: "Available", value: "Available" },
                  { label: "On Ride", value: "On Ride" },
                ]}
              />
              <Select
                label="Maintenance"
                value={maintenanceFilter}
                onChange={(e) => setMaintenanceFilter(e.target.value)}
                options={[
                  { label: "All Maintenance", value: "All" },
                  { label: "Good", value: "Good" },
                  { label: "Due Soon", value: "Due Soon" },
                ]}
              />
              <Select
                label="Operational Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: "All Statuses", value: "All" },
                  { label: "Active", value: "Active" },
                  { label: "Suspended", value: "Suspended" },
                ]}
              />
            </div>
          </Card>
        )}
      </div>

      {isLoading ? (
        <LoadingState label="Fetching vehicle registry data..." />
      ) : paginatedVehicles.length === 0 ? (
        <EmptyState title="No Vehicles Found" description="Try clearing filters or search query." />
      ) : (
        <>
          <div className="hidden lg:block">
            <DataTable columns={columns} data={paginatedVehicles} keyExtractor={(v) => v.id} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {paginatedVehicles.map((v) => (
              <Card key={v.id} variant="elevated" rounded="2xl" padding="md" className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/super-admin/vehicles/${v.id}`} className="font-bold text-sm text-[#2C2C24]">
                      {v.registrationPlate}
                    </Link>
                    <p className="text-xs text-[#78786C]">{v.model} ({v.type})</p>
                  </div>
                  <Badge variant={v.availability === "Available" ? "moss" : "terracotta"} dot size="sm">
                    {v.availability}
                  </Badge>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-[#DED8CF]/60">
                  <Link href={`/super-admin/vehicles/${v.id}`}>
                    <Button variant="outline" size="sm">View Detail</Button>
                  </Link>
                  <span className="text-xs font-bold text-[#5D7052]">{v.assignedDriver.name}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DED8CF]/60">
            <p className="text-xs text-[#78786C] font-semibold">
              Showing <span className="text-[#2C2C24]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="text-[#2C2C24]">{Math.min(currentPage * itemsPerPage, filteredVehicles.length)}</span> of{" "}
              <span className="text-[#2C2C24]">{filteredVehicles.length}</span> vehicle records
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} icon={<ChevronLeft className="w-4 h-4" />}>
                Previous
              </Button>
              <span className="text-xs font-bold px-3 text-[#2C2C24]">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)} icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
