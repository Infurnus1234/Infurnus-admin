"use client";

import React, { useState, useMemo } from "react";
import {
  CentralizedApprovalTicket,
  MOCK_APPROVAL_TICKETS,
  ApprovalStatus,
  ApprovalCategory,
} from "@/lib/centralizedApprovalsData";
import {
  PageHeader,
  Button,
  Tabs,
  Badge,
  Card,
  DataTable,
  EmptyState,
  LoadingState,
  Select,
} from "@/components";
import { Column } from "@/types";
import { ApprovalTicketDetailDrawer } from "@/components/approvals/ApprovalTicketDetailDrawer";
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function CentralizedApprovalCenterPage() {
  const [tickets, setTickets] = useState<CentralizedApprovalTicket[]>(MOCK_APPROVAL_TICKETS);
  const [activeTabStatus, setActiveTabStatus] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Detail View State
  const [selectedTicket, setSelectedTicket] = useState<CentralizedApprovalTicket | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Tab status filter
      if (activeTabStatus !== "All" && t.status !== activeTabStatus) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "All" && t.category !== categoryFilter) {
        return false;
      }

      // Search query
      const matchesSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.resource.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [tickets, activeTabStatus, categoryFilter, searchQuery]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  const handleOpenReview = (t: CentralizedApprovalTicket) => {
    setSelectedTicket(t);
    setIsDrawerOpen(true);
  };

  // Local State Machine Handlers
  const handleApprove = (targetTicket: CentralizedApprovalTicket, notes: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === targetTicket.id
          ? {
              ...t,
              status: "Approved",
              approvalHistory: [
                ...t.approvalHistory,
                { date: new Date().toISOString().slice(0, 16).replace("T", " "), actor: "Super Admin", action: "Approved Ticket", notes: notes || "Approved" },
              ],
            }
          : t
      )
    );
    setIsDrawerOpen(false);
  };

  const handleReject = (targetTicket: CentralizedApprovalTicket, notes: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === targetTicket.id
          ? {
              ...t,
              status: "Rejected",
              approvalHistory: [
                ...t.approvalHistory,
                { date: new Date().toISOString().slice(0, 16).replace("T", " "), actor: "Super Admin", action: "Rejected Ticket", notes: notes || "Rejected" },
              ],
            }
          : t
      )
    );
    setIsDrawerOpen(false);
  };

  const handleRequestChanges = (targetTicket: CentralizedApprovalTicket, notes: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === targetTicket.id
          ? {
              ...t,
              status: "Changes Requested",
              approvalHistory: [
                ...t.approvalHistory,
                { date: new Date().toISOString().slice(0, 16).replace("T", " "), actor: "Super Admin", action: "Requested Changes", notes: notes || "Changes Requested" },
              ],
            }
          : t
      )
    );
    setIsDrawerOpen(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const columns: Column<CentralizedApprovalTicket>[] = [
    {
      key: "id",
      header: "Request ID",
      render: (t) => <span className="font-mono text-xs font-bold text-[#C18C5D]">{t.id}</span>,
    },
    {
      key: "type",
      header: "Type & Category",
      render: (t) => (
        <div>
          <span className="font-bold text-xs text-[#2C2C24]">{t.type}</span>
          <Badge variant="sand" size="sm" className="ml-2">{t.category}</Badge>
        </div>
      ),
    },
    {
      key: "requester",
      header: "Requester",
      render: (t) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-[10px]">
            {t.requester.avatar || t.requester.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-xs text-[#2C2C24]">{t.requester.name}</p>
            <p className="text-[10px] text-[#78786C]">{t.requester.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: "resource",
      header: "Resource",
      render: (t) => <span className="text-xs font-mono font-medium text-[#5D7052]">{t.resource}</span>,
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (t) => <span className="text-xs text-[#78786C]">{t.createdAt}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (t) => (
        <Badge
          variant={
            t.status === "Approved"
              ? "moss"
              : t.status === "Pending"
              ? "terracotta"
              : t.status === "Changes Requested"
              ? "sand"
              : "destructive"
          }
          dot
          size="sm"
        >
          {t.status}
        </Badge>
      ),
    },
    {
      key: "riskLevel",
      header: "Risk Level",
      render: (t) => (
        <Badge
          variant={
            t.riskLevel === "Critical" || t.riskLevel === "High"
              ? "destructive"
              : t.riskLevel === "Medium"
              ? "terracotta"
              : "moss"
          }
          size="sm"
        >
          {t.riskLevel}
        </Badge>
      ),
    },
    {
      key: "requiredApproval",
      header: "Required Approval",
      render: (t) => <span className="text-xs font-semibold text-[#2C2C24]">{t.requiredApproval}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (t) => (
        <div className="flex items-center gap-1">
          <Button
            variant="primary"
            size="sm"
            className="px-3 py-1 text-xs"
            icon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => handleOpenReview(t)}
          >
            Review
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 rounded-full text-[#5D7052] hover:bg-[#5D7052]/10"
            onClick={() => handleApprove(t, "Quick Approved")}
            title="Quick Approve"
          >
            <CheckCircle2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 rounded-full text-[#A85448] hover:bg-[#A85448]/10"
            onClick={() => handleReject(t, "Quick Rejected")}
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
      {/* Header */}
      <PageHeader
        title="Centralized Approval Center"
        description="Root approval engine for driver deletions, admin role elevations, financial refunds, coupons, and system configuration modifications."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Approval Center" },
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
          { id: "All", label: "All Tickets", badge: tickets.length },
          { id: "Pending", label: "Pending", badge: tickets.filter((t) => t.status === "Pending").length },
          { id: "Approved", label: "Approved" },
          { id: "Rejected", label: "Rejected" },
          { id: "Changes Requested", label: "Changes Requested" },
          { id: "Expired", label: "Expired" },
        ]}
        activeTab={activeTabStatus}
        onChange={setActiveTabStatus}
      />

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket ID, type, requester, or resource..."
            className="w-full bg-white border border-[#DED8CF] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052] transition-all"
          />
        </div>

        <div className="w-full sm:w-64">
          <Select
            label="Request Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { label: "All Categories", value: "All" },
              { label: "Driver", value: "Driver" },
              { label: "Admin", value: "Admin" },
              { label: "Permission", value: "Permission" },
              { label: "Vehicle", value: "Vehicle" },
              { label: "Coupon", value: "Coupon" },
              { label: "Financial", value: "Financial" },
              { label: "Refund", value: "Refund" },
              { label: "System Configuration", value: "System Configuration" },
            ]}
          />
        </div>
      </div>

      {/* DataTable & Loading/Empty States */}
      {isLoading ? (
        <LoadingState label="Fetching approval ticket queue..." />
      ) : paginatedTickets.length === 0 ? (
        <EmptyState
          title="No Approval Tickets Match"
          description="There are currently no tickets matching your active tab status or category filter."
        />
      ) : (
        <>
          <div className="hidden lg:block">
            <DataTable columns={columns} data={paginatedTickets} keyExtractor={(t) => t.id} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {paginatedTickets.map((t) => (
              <Card key={t.id} variant="elevated" rounded="2xl" padding="md" className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#C18C5D]">{t.id}</span>
                    <p className="font-bold text-sm text-[#2C2C24]">{t.type}</p>
                    <p className="text-xs text-[#78786C]">{t.requester.name} ({t.category})</p>
                  </div>
                  <Badge variant={t.riskLevel === "High" ? "destructive" : "moss"} size="sm">
                    {t.riskLevel} Risk
                  </Badge>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-[#DED8CF]/60">
                  <Button variant="primary" size="sm" onClick={() => handleOpenReview(t)}>
                    Review Ticket
                  </Button>
                  <span className="text-[10px] text-[#78786C] font-mono">{t.createdAt}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DED8CF]/60">
            <p className="text-xs text-[#78786C] font-semibold">
              Showing <span className="text-[#2C2C24]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="text-[#2C2C24]">{Math.min(currentPage * itemsPerPage, filteredTickets.length)}</span> of{" "}
              <span className="text-[#2C2C24]">{filteredTickets.length}</span> tickets
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

      {/* Ticket Detail Drawer */}
      <ApprovalTicketDetailDrawer
        ticket={selectedTicket}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestChanges={handleRequestChanges}
      />
    </div>
  );
}
