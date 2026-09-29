"use client";

import React, { useState, useMemo } from "react";
import { DetailedUser, MOCK_DETAILED_USERS } from "@/lib/userData";
import {
  PageHeader,
  Button,
  Input,
  Select,
  Badge,
  Card,
  CardContent,
  DataTable,
  EmptyState,
  LoadingState,
  Modal,
} from "@/components";
import { Column } from "@/types";
import { UserDetailsDrawer } from "@/components/users/UserDetailsDrawer";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Ban,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<DetailedUser[]>(MOCK_DETAILED_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Filter States
  const [statusFilter, setStatusFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [regDateFilter, setRegDateFilter] = useState("All");
  const [activityFilter, setActivityFilter] = useState("All");
  const [rideCountFilter, setRideCountFilter] = useState("All");

  // Selected User for Drawer & Confirmation Modals
  const [selectedUser, setSelectedUser] = useState<DetailedUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Confirmation Modal States
  const [confirmModalAction, setConfirmModalAction] = useState<"suspend" | "reactivate" | "deactivate" | null>(null);
  const [targetUser, setTargetUser] = useState<DetailedUser | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status
      if (statusFilter !== "All" && u.accountStatus !== statusFilter) return false;

      // City
      if (cityFilter !== "All" && u.city !== cityFilter) return false;

      // State
      if (stateFilter !== "All" && u.state !== stateFilter) return false;

      // Ride Count
      if (rideCountFilter === "0") {
        if (u.totalRides !== 0) return false;
      } else if (rideCountFilter === "1-10") {
        if (u.totalRides < 1 || u.totalRides > 10) return false;
      } else if (rideCountFilter === "10-50") {
        if (u.totalRides < 10 || u.totalRides > 50) return false;
      } else if (rideCountFilter === "50+") {
        if (u.totalRides < 50) return false;
      }

      return true;
    });
  }, [users, searchQuery, statusFilter, cityFilter, stateFilter, rideCountFilter]);

  // Paginated Output
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Open User Drawer
  const handleViewUser = (user: DetailedUser) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  // Trigger Confirmation Flow
  const triggerAction = (user: DetailedUser, action: "suspend" | "reactivate" | "deactivate") => {
    setTargetUser(user);
    setConfirmModalAction(action);
  };

  // Confirm Action Handler (Local State Mutation)
  const handleExecuteAction = () => {
    if (!targetUser || !confirmModalAction) return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetUser.id) {
          const updatedStatus =
            confirmModalAction === "suspend"
              ? "Suspended"
              : confirmModalAction === "reactivate"
              ? "Active"
              : "Deactivated";
          return { ...u, accountStatus: updatedStatus };
        }
        return u;
      })
    );

    // If selectedUser is currently open in drawer, update state
    if (selectedUser && selectedUser.id === targetUser.id) {
      setSelectedUser((prev) => (prev ? { ...prev, accountStatus: confirmModalAction === "suspend" ? "Suspended" : confirmModalAction === "reactivate" ? "Active" : "Deactivated" } : null));
    }

    setConfirmModalAction(null);
    setTargetUser(null);
  };

  // Refresh Trigger
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Export Trigger
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Email,City,State,TotalRides,Status"]
        .concat(
          filteredUsers.map(
            (u) => `${u.id},"${u.name}",${u.email},${u.city},${u.state},${u.totalRides},${u.accountStatus}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `infurnus_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table Columns Definition
  const columns: Column<DetailedUser>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {u.avatar || u.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-xs text-[#2C2C24]">{u.name}</p>
            <p className="text-[11px] text-[#78786C] font-mono">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (u) => (
        <div className="text-xs">
          <p className="font-semibold text-[#2C2C24]">{u.phone}</p>
          <p className="text-[10px] text-[#78786C]">Emg: {u.emergencyContact}</p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (u) => (
        <span className="text-xs font-semibold text-[#2C2C24]">
          {u.city}, {u.state}
        </span>
      ),
    },
    {
      key: "totalRides",
      header: "Total Rides",
      render: (u) => (
        <span className="text-xs font-bold text-[#5D7052] font-mono">
          {u.totalRides} rides
        </span>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment Status",
      render: (u) => (
        <Badge
          variant={
            u.paymentStatus === "Good Standing"
              ? "moss"
              : u.paymentStatus === "Pending Verification"
              ? "terracotta"
              : "destructive"
          }
          size="sm"
        >
          {u.paymentStatus}
        </Badge>
      ),
    },
    {
      key: "accountStatus",
      header: "Account Status",
      render: (u) => (
        <Badge
          variant={
            u.accountStatus === "Active"
              ? "moss"
              : u.accountStatus === "Suspended"
              ? "terracotta"
              : "destructive"
          }
          dot
          size="sm"
        >
          {u.accountStatus}
        </Badge>
      ),
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (u) => (
        <span className="text-xs text-[#78786C] font-medium">{u.lastActive}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (u) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-full hover:bg-[#E6DCCD]"
            onClick={() => handleViewUser(u)}
            title="View Details"
          >
            <Eye className="w-4 h-4 text-[#5D7052]" />
          </Button>

          {u.accountStatus === "Active" ? (
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 rounded-full hover:bg-[#F0EBE5]"
              onClick={() => triggerAction(u, "suspend")}
              title="Suspend User"
            >
              <Ban className="w-4 h-4 text-[#C18C5D]" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 rounded-full hover:bg-[#F0EBE5]"
              onClick={() => triggerAction(u, "reactivate")}
              title="Reactivate Account"
            >
              <UserCheck className="w-4 h-4 text-[#5D7052]" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-full hover:bg-[#A85448]/10"
            onClick={() => triggerAction(u, "deactivate")}
            title="Deactivate Account"
          >
            <UserX className="w-4 h-4 text-[#A85448]" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title="User Management"
        description="Comprehensive user directory, account status controls, ride history, and security audits."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "User Management" },
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
              onClick={handleExport}
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

      {/* Search & Filter Drawer Panel */}
      <div className="space-y-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, or ID..."
            className="w-full bg-white border border-[#DED8CF] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052] transition-all"
          />
        </div>

        {/* Expandable Filter Grid */}
        {isFilterVisible && (
          <Card variant="sand" rounded="2xl" padding="md" className="animate-in fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Select
                label="Account Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: "All Statuses", value: "All" },
                  { label: "Active", value: "Active" },
                  { label: "Suspended", value: "Suspended" },
                  { label: "Deactivated", value: "Deactivated" },
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
                  { label: "Frankfurt", value: "Frankfurt" },
                  { label: "Cologne", value: "Cologne" },
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
                  { label: "Hesse", value: "Hesse" },
                  { label: "NRW", value: "NRW" },
                ]}
              />

              <Select
                label="Registration"
                value={regDateFilter}
                onChange={(e) => setRegDateFilter(e.target.value)}
                options={[
                  { label: "All Time", value: "All" },
                  { label: "Last 30 Days", value: "30d" },
                  { label: "Last 90 Days", value: "90d" },
                  { label: "This Year", value: "year" },
                ]}
              />

              <Select
                label="Activity"
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                options={[
                  { label: "All Activity", value: "All" },
                  { label: "Active Today", value: "today" },
                  { label: "Active This Week", value: "week" },
                  { label: "Inactive > 30 Days", value: "inactive" },
                ]}
              />

              <Select
                label="Ride Count"
                value={rideCountFilter}
                onChange={(e) => setRideCountFilter(e.target.value)}
                options={[
                  { label: "All Ride Counts", value: "All" },
                  { label: "0 Rides", value: "0" },
                  { label: "1 - 10 Rides", value: "1-10" },
                  { label: "10 - 50 Rides", value: "10-50" },
                  { label: "50+ Rides", value: "50+" },
                ]}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("All");
                  setCityFilter("All");
                  setStateFilter("All");
                  setRegDateFilter("All");
                  setActivityFilter("All");
                  setRideCountFilter("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* 2. User DataTable & 6. Loading/Empty States */}
      {isLoading ? (
        <LoadingState label="Loading user accounts directory..." />
      ) : paginatedUsers.length === 0 ? (
        <EmptyState
          title="No Users Match Query"
          description="Try adjusting your search keywords or resetting your active filter selections."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setCityFilter("All");
                setStateFilter("All");
                setRideCountFilter("All");
              }}
            >
              Clear All Filters
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={paginatedUsers}
              keyExtractor={(u) => u.id}
            />
          </div>

          {/* Responsive Mobile Card Transformation View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedUsers.map((u) => (
              <Card key={u.id} variant="elevated" rounded="2xl" padding="md" className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-xs">
                      {u.avatar || u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#2C2C24]">{u.name}</p>
                      <p className="text-xs text-[#78786C] font-mono">{u.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      u.accountStatus === "Active"
                        ? "moss"
                        : u.accountStatus === "Suspended"
                        ? "terracotta"
                        : "destructive"
                    }
                    dot
                    size="sm"
                  >
                    {u.accountStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#DED8CF]/60">
                  <div>
                    <span className="text-[#78786C] block">Location</span>
                    <span className="font-semibold text-[#2C2C24]">{u.city}, {u.state}</span>
                  </div>
                  <div>
                    <span className="text-[#78786C] block">Dispatches</span>
                    <span className="font-bold text-[#5D7052]">{u.totalRides} rides</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleViewUser(u)}>
                    View Details
                  </Button>
                  <div className="flex items-center gap-1">
                    {u.accountStatus === "Active" ? (
                      <Button variant="ghost" size="sm" onClick={() => triggerAction(u, "suspend")}>
                        Suspend
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => triggerAction(u, "reactivate")}>
                        Reactivate
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Controls UI */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DED8CF]/60">
            <p className="text-xs text-[#78786C] font-semibold">
              Showing <span className="text-[#2C2C24]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="text-[#2C2C24]">
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
              </span>{" "}
              of <span className="text-[#2C2C24]">{filteredUsers.length}</span> user accounts
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

      {/* 4. User Details Drawer */}
      <UserDetailsDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuspend={(u) => triggerAction(u, "suspend")}
        onReactivate={(u) => triggerAction(u, "reactivate")}
        onDeactivate={(u) => triggerAction(u, "deactivate")}
      />

      {/* 5. Frontend-Only Action Confirmation Modals */}
      <Modal
        isOpen={confirmModalAction !== null}
        onClose={() => setConfirmModalAction(null)}
        title={`Confirm ${
          confirmModalAction === "suspend"
            ? "User Suspension"
            : confirmModalAction === "reactivate"
            ? "Account Reactivation"
            : "Account Deactivation"
        }`}
        description={`Are you sure you want to ${confirmModalAction} user account "${targetUser?.name}" (${targetUser?.email})?`}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmModalAction(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmModalAction === "deactivate" ? "destructive" : "primary"}
              onClick={handleExecuteAction}
            >
              Confirm {confirmModalAction}
            </Button>
          </>
        }
      >
        <div className="py-2 text-xs text-[#78786C]">
          <p>
            {confirmModalAction === "suspend" &&
              "Suspending this user will prevent active ride dispatches and app authentication until reactivated by a Super Admin."}
            {confirmModalAction === "reactivate" &&
              "Reactivating this user will restore full account privileges and login access."}
            {confirmModalAction === "deactivate" &&
              "Deactivating this account marks the user as terminated according to GDPR right-to-be-forgotten compliance protocols."}
          </p>
        </div>
      </Modal>
    </div>
  );
}
