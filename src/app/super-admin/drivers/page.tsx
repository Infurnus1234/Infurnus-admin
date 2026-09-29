"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DetailedDriver, MOCK_DETAILED_DRIVERS } from "@/lib/driverData";
import {
  PageHeader,
  Button,
  Select,
  Badge,
  Card,
  DataTable,
  EmptyState,
  LoadingState,
  Modal,
} from "@/components";
import { Column } from "@/types";
import {
  Search,
  Download,
  RefreshCw,
  Eye,
  Ban,
  UserCheck,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
  Car,
  MapPin,
  Building,
} from "lucide-react";

export default function SuperAdminDriversPage() {
  const [drivers, setDrivers] = useState<DetailedDriver[]>(MOCK_DETAILED_DRIVERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Filter States
  const [statusFilter, setStatusFilter] = useState("All");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [fleetFilter, setFleetFilter] = useState("All");
  const [partnerFilter, setPartnerFilter] = useState("All");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [performanceFilter, setPerformanceFilter] = useState("All");

  // Modal / Action States
  const [selectedDriverForDocs, setSelectedDriverForDocs] = useState<DetailedDriver | null>(null);
  const [selectedDriverForHistory, setSelectedDriverForHistory] = useState<DetailedDriver | null>(null);
  const [confirmModalAction, setConfirmModalAction] = useState<"suspend" | "reactivate" | null>(null);
  const [targetDriver, setTargetDriver] = useState<DetailedDriver | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Logic
  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      // Search
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status
      if (statusFilter !== "All" && d.status !== statusFilter) return false;

      // Verification
      if (verificationFilter !== "All" && d.verificationStatus !== verificationFilter) return false;

      // City & District & State
      if (cityFilter !== "All" && d.location.city !== cityFilter) return false;
      if (districtFilter !== "All" && d.location.district !== districtFilter) return false;
      if (stateFilter !== "All" && d.location.state !== stateFilter) return false;

      // Fleet & Partner & Vehicle Type
      if (fleetFilter !== "All" && d.fleet.name !== fleetFilter) return false;
      if (partnerFilter !== "All" && d.partner.name !== partnerFilter) return false;
      if (vehicleFilter !== "All" && d.vehicle.type !== vehicleFilter) return false;

      // Performance
      if (performanceFilter === "top") {
        if (d.rating < 4.8) return false;
      } else if (performanceFilter === "avg") {
        if (d.rating < 4.0 || d.rating >= 4.8) return false;
      } else if (performanceFilter === "below") {
        if (d.rating >= 4.0) return false;
      }

      return true;
    });
  }, [
    drivers,
    searchQuery,
    statusFilter,
    verificationFilter,
    cityFilter,
    districtFilter,
    stateFilter,
    fleetFilter,
    partnerFilter,
    vehicleFilter,
    performanceFilter,
  ]);

  // Paginated Data
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage) || 1;
  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDrivers.slice(start, start + itemsPerPage);
  }, [filteredDrivers, currentPage]);

  // Handle Action Trigger
  const triggerAction = (driver: DetailedDriver, action: "suspend" | "reactivate") => {
    setTargetDriver(driver);
    setConfirmModalAction(action);
  };

  const handleExecuteAction = () => {
    if (!targetDriver || !confirmModalAction) return;

    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === targetDriver.id) {
          return {
            ...d,
            status: confirmModalAction === "suspend" ? "Suspended" : "Active",
          };
        }
        return d;
      })
    );

    setConfirmModalAction(null);
    setTargetDriver(null);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Email,Status,Verification,Rating,City,Vehicle,Plate"]
        .concat(
          filteredDrivers.map(
            (d) => `${d.id},"${d.name}",${d.email},${d.status},${d.verificationStatus},${d.rating},${d.location.city},"${d.vehicle.model}",${d.vehicle.plateNumber}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `infurnus_drivers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table Columns Setup
  const columns: Column<DetailedDriver>[] = [
    {
      key: "driver",
      header: "Driver",
      render: (d) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {d.avatar || d.name.charAt(0)}
          </div>
          <div>
            <Link href={`/super-admin/drivers/${d.id}`} className="font-bold text-xs text-[#2C2C24] hover:text-[#5D7052]">
              {d.name}
            </Link>
            <p className="text-[11px] text-[#78786C] font-mono">{d.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "verification",
      header: "Verification",
      render: (d) => (
        <Badge
          variant={
            d.verificationStatus === "Verified"
              ? "moss"
              : d.verificationStatus === "Pending Verification"
              ? "terracotta"
              : "destructive"
          }
          size="sm"
        >
          {d.verificationStatus}
        </Badge>
      ),
    },
    {
      key: "vehicle",
      header: "Vehicle",
      render: (d) => (
        <div className="text-xs">
          <p className="font-semibold text-[#2C2C24]">{d.vehicle.model}</p>
          <p className="text-[10px] text-[#78786C] font-mono">{d.vehicle.plateNumber}</p>
        </div>
      ),
    },
    {
      key: "fleet",
      header: "Fleet",
      render: (d) => <span className="text-xs font-medium text-[#2C2C24]">{d.fleet.name}</span>,
    },
    {
      key: "partner",
      header: "Partner",
      render: (d) => <span className="text-xs font-medium text-[#78786C]">{d.partner.name}</span>,
    },
    {
      key: "location",
      header: "Location",
      render: (d) => (
        <span className="text-xs font-semibold text-[#2C2C24]">
          {d.location.city}, {d.location.district}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (d) => (
        <Badge
          variant={
            d.status === "Active"
              ? "moss"
              : d.status === "On Trip"
              ? "terracotta"
              : d.status === "Suspended"
              ? "destructive"
              : "muted"
          }
          dot
          size="sm"
        >
          {d.status}
        </Badge>
      ),
    },
    {
      key: "performance",
      header: "Performance",
      render: (d) => (
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C2C24]">
          <Star className="w-3.5 h-3.5 fill-[#C18C5D] text-[#C18C5D]" />
          <span>{d.rating}</span>
          <span className="text-[10px] text-[#78786C] font-normal">({d.completionRate}%)</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (d) => (
        <div className="flex items-center gap-1">
          <Link href={`/super-admin/drivers/${d.id}`}>
            <Button variant="ghost" size="sm" className="p-1.5 rounded-full hover:bg-[#E6DCCD]" title="View Full Profile">
              <Eye className="w-4 h-4 text-[#5D7052]" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-full hover:bg-[#F0EBE5]"
            onClick={() => setSelectedDriverForDocs(d)}
            title="View Documents"
          >
            <FileText className="w-4 h-4 text-[#C18C5D]" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-full hover:bg-[#F0EBE5]"
            onClick={() => setSelectedDriverForHistory(d)}
            title="View Audit History"
          >
            <Clock className="w-4 h-4 text-[#78786C]" />
          </Button>

          {d.status === "Suspended" ? (
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 rounded-full hover:bg-[#5D7052]/10"
              onClick={() => triggerAction(d, "reactivate")}
              title="Reactivate Driver"
            >
              <UserCheck className="w-4 h-4 text-[#5D7052]" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 rounded-full hover:bg-[#A85448]/10"
              onClick={() => triggerAction(d, "suspend")}
              title="Suspend Driver"
            >
              <Ban className="w-4 h-4 text-[#A85448]" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <PageHeader
        title="Driver Management"
        description="Global driver directory, safety verification, vehicle assignment, and performance monitoring."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Driver Management" },
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

      {/* Search & Comprehensive Multi-Parameter Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by driver name, email, plate number..."
            className="w-full bg-white border border-[#DED8CF] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052] transition-all"
          />
        </div>

        {/* Expandable Filter Grid */}
        {isFilterVisible && (
          <Card variant="sand" rounded="2xl" padding="md" className="animate-in fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: "All Statuses", value: "All" },
                  { label: "Active", value: "Active" },
                  { label: "On Trip", value: "On Trip" },
                  { label: "Offline", value: "Offline" },
                  { label: "Suspended", value: "Suspended" },
                ]}
              />

              <Select
                label="Verification"
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                options={[
                  { label: "All Verifications", value: "All" },
                  { label: "Verified", value: "Verified" },
                  { label: "Pending Verification", value: "Pending Verification" },
                  { label: "Rejected", value: "Rejected" },
                ]}
              />

              <Select
                label="City"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                options={[
                  { label: "All Cities", value: "All" },
                  { label: "Berlin", value: "Berlin" },
                  { label: "Munich", value: "Munich" },
                  { label: "Hamburg", value: "Hamburg" },
                ]}
              />

              <Select
                label="District"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                options={[
                  { label: "All Districts", value: "All" },
                  { label: "Mitte", value: "Mitte" },
                  { label: "Schwabing", value: "Schwabing" },
                  { label: "Altona", value: "Altona" },
                ]}
              />

              <Select
                label="State"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                options={[
                  { label: "All States", value: "All" },
                  { label: "Berlin", value: "Berlin" },
                  { label: "Bavaria", value: "Bavaria" },
                  { label: "Hamburg", value: "Hamburg" },
                ]}
              />

              <Select
                label="Fleet"
                value={fleetFilter}
                onChange={(e) => setFleetFilter(e.target.value)}
                options={[
                  { label: "All Fleets", value: "All" },
                  { label: "Berlin Express", value: "Berlin Express" },
                  { label: "Munich Fleet Alpha", value: "Munich Fleet Alpha" },
                  { label: "Nordic Trans", value: "Nordic Trans" },
                ]}
              />

              <Select
                label="Partner"
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                options={[
                  { label: "All Partners", value: "All" },
                  { label: "EcoMove Mobility", value: "EcoMove Mobility" },
                  { label: "TransCity GmbH", value: "TransCity GmbH" },
                  { label: "UrbanFleet Systems", value: "UrbanFleet Systems" },
                ]}
              />

              <Select
                label="Vehicle Type"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                options={[
                  { label: "All Vehicles", value: "All" },
                  { label: "EV Sedan", value: "EV Sedan" },
                  { label: "Hybrid SUV", value: "Hybrid SUV" },
                  { label: "Standard Sedan", value: "Standard Sedan" },
                ]}
              />

              <Select
                label="Performance"
                value={performanceFilter}
                onChange={(e) => setPerformanceFilter(e.target.value)}
                options={[
                  { label: "All Ratings", value: "All" },
                  { label: "Top Rated (4.8+)", value: "top" },
                  { label: "Average (4.0 - 4.7)", value: "avg" },
                  { label: "Below Average (<4.0)", value: "below" },
                ]}
              />
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("All");
                  setVerificationFilter("All");
                  setCityFilter("All");
                  setDistrictFilter("All");
                  setStateFilter("All");
                  setFleetFilter("All");
                  setPartnerFilter("All");
                  setVehicleFilter("All");
                  setPerformanceFilter("All");
                }}
              >
                Reset All Filters
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Driver DataTable & Responsive Mobile View */}
      {isLoading ? (
        <LoadingState label="Loading driver accounts & vehicle assignments..." />
      ) : paginatedDrivers.length === 0 ? (
        <EmptyState
          title="No Drivers Found"
          description="No drivers match the current filter matrix or search query."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setVerificationFilter("All");
              }}
            >
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <DataTable
              columns={columns}
              data={paginatedDrivers}
              keyExtractor={(d) => d.id}
            />
          </div>

          {/* Responsive Mobile Card View Transformation */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {paginatedDrivers.map((d) => (
              <Card key={d.id} variant="elevated" rounded="2xl" padding="md" className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-xs">
                      {d.avatar || d.name.charAt(0)}
                    </div>
                    <div>
                      <Link href={`/super-admin/drivers/${d.id}`} className="font-bold text-sm text-[#2C2C24]">
                        {d.name}
                      </Link>
                      <p className="text-xs text-[#78786C] font-mono">{d.email}</p>
                    </div>
                  </div>
                  <Badge variant={d.status === "Active" ? "moss" : "destructive"} dot size="sm">
                    {d.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#DED8CF]/60">
                  <div>
                    <span className="text-[#78786C] block">Vehicle</span>
                    <span className="font-semibold text-[#2C2C24]">{d.vehicle.model} ({d.vehicle.plateNumber})</span>
                  </div>
                  <div>
                    <span className="text-[#78786C] block">Performance</span>
                    <span className="font-bold text-[#5D7052]">★ {d.rating} ({d.completionRate}%)</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link href={`/super-admin/drivers/${d.id}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDriverForDocs(d)}>
                    Docs
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DED8CF]/60">
            <p className="text-xs text-[#78786C] font-semibold">
              Showing <span className="text-[#2C2C24]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="text-[#2C2C24]">
                {Math.min(currentPage * itemsPerPage, filteredDrivers.length)}
              </span>{" "}
              of <span className="text-[#2C2C24]">{filteredDrivers.length}</span> driver records
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <span className="text-xs font-bold px-3 text-[#2C2C24]">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                icon={<ChevronRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Action: Documents Modal */}
      <Modal
        isOpen={selectedDriverForDocs !== null}
        onClose={() => setSelectedDriverForDocs(null)}
        title={`Verification Documents (${selectedDriverForDocs?.name})`}
        description="Safety, licensing, and compliance documents on file."
        footer={
          <Button variant="primary" onClick={() => setSelectedDriverForDocs(null)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 py-2">
          {selectedDriverForDocs?.documents.map((doc) => (
            <div key={doc.id} className="p-3.5 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-[#2C2C24]">{doc.type}</p>
                <p className="text-[#78786C] font-mono mt-0.5">{doc.number} • Expires {doc.expiryDate}</p>
              </div>
              <Badge variant={doc.status === "Verified" ? "moss" : "terracotta"} size="sm">
                {doc.status}
              </Badge>
            </div>
          ))}
        </div>
      </Modal>

      {/* Action: Audit History Modal */}
      <Modal
        isOpen={selectedDriverForHistory !== null}
        onClose={() => setSelectedDriverForHistory(null)}
        title={`Driver Audit Trail (${selectedDriverForHistory?.name})`}
        description="Lifecycle events and administrative modifications."
        footer={
          <Button variant="primary" onClick={() => setSelectedDriverForHistory(null)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 py-2 max-h-80 overflow-y-auto">
          {selectedDriverForHistory?.lifecycleHistory.map((hist, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2C2C24]">{hist.event}</span>
                <span className="text-[#78786C] text-[10px]">{hist.date}</span>
              </div>
              <p className="text-[#78786C]">{hist.notes}</p>
              <p className="text-[10px] text-[#5D7052] font-semibold">Actor: {hist.actor}</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* Action: Suspend / Reactivate Confirmation Modal */}
      <Modal
        isOpen={confirmModalAction !== null}
        onClose={() => setConfirmModalAction(null)}
        title={`Confirm Driver ${confirmModalAction === "suspend" ? "Suspension" : "Reactivation"}`}
        description={`Are you sure you want to ${confirmModalAction} driver "${targetDriver?.name}" (${targetDriver?.vehicle.plateNumber})?`}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmModalAction(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmModalAction === "suspend" ? "destructive" : "primary"}
              onClick={handleExecuteAction}
            >
              Confirm {confirmModalAction}
            </Button>
          </>
        }
      >
        <p className="text-xs text-[#78786C] py-2">
          {confirmModalAction === "suspend"
            ? "Suspending this driver will instantly halt dispatch requests and lock active vehicle keyless access."
            : "Reactivating this driver will restore ride dispatch requests and fleet authorization."}
        </p>
      </Modal>
    </div>
  );
}
