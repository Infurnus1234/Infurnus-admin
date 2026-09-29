"use client";

import React, { useState, useMemo } from "react";
import {
  DriverApprovalRequest,
  MOCK_DRIVER_REQUESTS,
  DriverRequestStatus,
  DriverRequestType,
} from "@/lib/driverRequestData";
import {
  PageHeader,
  Button,
  Tabs,
  Badge,
  Card,
  DataTable,
  EmptyState,
  LoadingState,
  Modal,
} from "@/components";
import { Column } from "@/types";
import { RequestReviewDrawer } from "@/components/requests/RequestReviewDrawer";
import {
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function SuperAdminDriverRequestsPage() {
  const [requests, setRequests] = useState<DriverApprovalRequest[]>(MOCK_DRIVER_REQUESTS);
  const [activeTabStatus, setActiveTabStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Review Drawer State
  const [selectedRequest, setSelectedRequest] = useState<DriverApprovalRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Logic
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Tab filter
      if (activeTabStatus !== "All" && req.status !== activeTabStatus) {
        return false;
      }

      // Search query
      const matchesSearch =
        req.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.driverEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requestType.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [requests, activeTabStatus, searchQuery]);

  // Paginated Requests
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage]);

  // Open Detailed Review
  const handleOpenReview = (req: DriverApprovalRequest) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  // State Machine Handlers (Frontend local state updates)
  const handleApprove = (targetReq: DriverApprovalRequest, notes: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === targetReq.id ? { ...r, status: "Approved", reasonNotes: notes || r.reasonNotes } : r
      )
    );
    setIsDrawerOpen(false);
  };

  const handleReject = (targetReq: DriverApprovalRequest, notes: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === targetReq.id ? { ...r, status: "Rejected", reasonNotes: notes || r.reasonNotes } : r
      )
    );
    setIsDrawerOpen(false);
  };

  const handleRequestChanges = (targetReq: DriverApprovalRequest, notes: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === targetReq.id ? { ...r, status: "Changes Requested", reasonNotes: notes || r.reasonNotes } : r
      )
    );
    setIsDrawerOpen(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Table Columns
  const columns: Column<DriverApprovalRequest>[] = [
    {
      key: "id",
      header: "Request ID",
      render: (r) => (
        <span className="font-mono text-xs font-bold text-[#C18C5D]">{r.id}</span>
      ),
    },
    {
      key: "driver",
      header: "Driver",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-xs">
            {r.driverAvatar || r.driverName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-xs text-[#2C2C24]">{r.driverName}</p>
            <p className="text-[10px] text-[#78786C] font-mono">{r.driverEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: "requestType",
      header: "Request Type",
      render: (r) => (
        <Badge variant="sand" size="sm">
          {r.requestType.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "submittedBy",
      header: "Submitted By",
      render: (r) => (
        <div className="text-xs">
          <p className="font-semibold text-[#2C2C24]">{r.submittedBy.name}</p>
          <p className="text-[10px] text-[#78786C]">{r.submittedBy.role}</p>
        </div>
      ),
    },
    {
      key: "submittedDate",
      header: "Submitted Date",
      render: (r) => (
        <span className="text-xs text-[#78786C] font-medium">{r.submittedDate}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge
          variant={
            r.status === "Approved"
              ? "moss"
              : r.status === "Pending" || r.status === "Under Review"
              ? "terracotta"
              : r.status === "Changes Requested"
              ? "sand"
              : "destructive"
          }
          dot
          size="sm"
        >
          {r.status}
        </Badge>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (r) => (
        <Badge
          variant={
            r.priority === "High"
              ? "destructive"
              : r.priority === "Medium"
              ? "terracotta"
              : "muted"
          }
          size="sm"
        >
          {r.priority}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="primary"
            size="sm"
            className="px-3 py-1 text-xs"
            icon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => handleOpenReview(r)}
          >
            Review
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 rounded-full text-[#5D7052] hover:bg-[#5D7052]/10"
            onClick={() => handleApprove(r, "Approved via quick action.")}
            title="Quick Approve"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 rounded-full text-[#A85448] hover:bg-[#A85448]/10"
            onClick={() => handleReject(r, "Rejected via quick action.")}
            title="Quick Reject"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Driver Request & Approval Center"
        description="Unified approval workflow queue for driver additions, deletions, vehicle assignments, and partner modifications."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Approval Center", href: "/super-admin/driver-requests" },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
            onClick={handleRefresh}
          >
            Refresh Queue
          </Button>
        }
      />

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "All", label: "All Requests", badge: requests.length },
          { id: "Pending", label: "Pending", badge: requests.filter((r) => r.status === "Pending").length },
          { id: "Under Review", label: "Under Review" },
          { id: "Approved", label: "Approved" },
          { id: "Rejected", label: "Rejected" },
          { id: "Changes Requested", label: "Changes Requested" },
          { id: "Cancelled", label: "Cancelled" },
          { id: "Expired", label: "Expired" },
        ]}
        activeTab={activeTabStatus}
        onChange={setActiveTabStatus}
      />

      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Request ID, driver name, email..."
          className="w-full bg-white border border-[#DED8CF] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052] transition-all"
        />
      </div>

      {/* Table & Empty/Loading States */}
      {isLoading ? (
        <LoadingState label="Synchronizing driver approval queue..." />
      ) : paginatedRequests.length === 0 ? (
        <EmptyState
          title="No Requests in Queue"
          description="There are currently no driver approval requests matching this tab filter."
          icon={<Sparkles className="w-10 h-10 text-[#5D7052]" />}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <DataTable
              columns={columns}
              data={paginatedRequests}
              keyExtractor={(r) => r.id}
            />
          </div>

          {/* Mobile Responsive Cards */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {paginatedRequests.map((r) => (
              <Card key={r.id} variant="elevated" rounded="2xl" padding="md" className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#C18C5D]">{r.id}</span>
                    <h3 className="font-bold text-sm text-[#2C2C24]">{r.driverName}</h3>
                    <p className="text-xs text-[#78786C]">{r.requestType.replace(/_/g, " ")}</p>
                  </div>
                  <Badge variant={r.status === "Approved" ? "moss" : "terracotta"} dot size="sm">
                    {r.status}
                  </Badge>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#DED8CF]/60">
                  <Button variant="primary" size="sm" onClick={() => handleOpenReview(r)}>
                    Review Request
                  </Button>
                  <span className="text-[10px] text-[#78786C] font-mono">{r.submittedDate}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DED8CF]/60">
            <p className="text-xs text-[#78786C] font-semibold">
              Showing <span className="text-[#2C2C24]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="text-[#2C2C24]">
                {Math.min(currentPage * itemsPerPage, filteredRequests.length)}
              </span>{" "}
              of <span className="text-[#2C2C24]">{filteredRequests.length}</span> request items
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

      {/* Detailed Review Screen Drawer */}
      <RequestReviewDrawer
        request={selectedRequest}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestChanges={handleRequestChanges}
      />
    </div>
  );
}
