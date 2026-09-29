"use me";
"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { Column } from "@/types";
import {
  MOCK_SUPPORT_TICKETS,
  SupportTicket
} from "@/lib/supportReportsData";
import {
  LifeBuoy,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  ShieldAlert,
  Send,
  Paperclip,
  Search,
  Filter,
  Check,
  X,
  FileText,
  Car,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [drawerTab, setDrawerTab] = useState("convo");
  
  // New reply message state inside drawer
  const [replyMessage, setReplyMessage] = useState("");
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);

  // Categories
  const categories = [
    "All",
    "User Complaints",
    "Driver Complaints",
    "Partner Complaints",
    "Ride Disputes",
    "Support Tickets",
    "Escalations"
  ];

  // Filtering
  const filteredTickets = tickets.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.relatedRideId && t.relatedRideId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;

    return matchesCategory && matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "High":
        return <Badge variant="terracotta">High</Badge>;
      case "Medium":
        return <Badge variant="sand">Medium</Badge>;
      case "Low":
        return <Badge variant="muted">Low</Badge>;
    }
  };

  const getStatusBadge = (status: SupportTicket["status"]) => {
    switch (status) {
      case "Open":
        return <Badge variant="terracotta">Open</Badge>;
      case "In Progress":
        return <Badge variant="sand">In Progress</Badge>;
      case "Pending Action":
        return <Badge variant="sand">Pending Action</Badge>;
      case "Resolved":
        return <Badge variant="moss">Resolved</Badge>;
      case "Closed":
        return <Badge variant="muted">Closed</Badge>;
      case "Escalated":
        return <Badge variant="destructive">Escalated</Badge>;
    }
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "Super Admin Agent",
      senderRole: "Super Admin" as const,
      timestamp: new Date().toLocaleString("en-US", { hour12: false }),
      message: replyMessage.trim()
    };

    const updatedTicket: SupportTicket = {
      ...selectedTicket,
      updatedAt: "Just now",
      status: selectedTicket.status === "Open" ? "In Progress" : selectedTicket.status,
      conversation: [...selectedTicket.conversation, newMsg],
      activityLog: [
        ...selectedTicket.activityLog,
        {
          id: `a-${Date.now()}`,
          action: "Response Sent",
          performer: "Super Admin",
          timestamp: new Date().toLocaleString("en-US", { hour12: false }),
          notes: replyMessage.trim().substring(0, 40) + "..."
        }
      ]
    };

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
    setSelectedTicket(updatedTicket);
    setReplyMessage("");
  };

  const handleResolveTicket = () => {
    if (!selectedTicket) return;

    const updatedTicket: SupportTicket = {
      ...selectedTicket,
      status: "Resolved",
      updatedAt: "Just now",
      resolution: {
        resolvedBy: "Super Admin",
        resolvedAt: new Date().toLocaleString("en-US", { hour12: false }),
        summary: resolutionSummary || "Resolved after administrative review.",
        satisfactionScore: 5
      },
      activityLog: [
        ...selectedTicket.activityLog,
        {
          id: `a-${Date.now()}`,
          action: "Ticket Resolved",
          performer: "Super Admin",
          timestamp: new Date().toLocaleString("en-US", { hour12: false }),
          notes: resolutionSummary
        }
      ]
    };

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
    setSelectedTicket(updatedTicket);
    setShowResolveModal(false);
    setResolutionSummary("");
  };

  const columns: Column<SupportTicket>[] = [
    {
      key: "id",
      header: "Ticket ID & Subject",
      render: (t: SupportTicket) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-moss-700 bg-moss-50 px-2 py-0.5 rounded border border-moss-200">
              {t.id}
            </span>
            {t.relatedRideId && (
              <span className="text-[11px] font-medium text-terracotta-600 bg-terracotta-50 px-1.5 py-0.5 rounded">
                Ride #{t.relatedRideId}
              </span>
            )}
          </div>
          <div className="text-sm font-semibold text-sand-900 line-clamp-1 max-w-xs hover:text-moss-700 transition-colors cursor-pointer" onClick={() => setSelectedTicket(t)}>
            {t.subject}
          </div>
        </div>
      )
    },
    {
      key: "requester",
      header: "Requester",
      render: (t: SupportTicket) => (
        <div className="flex items-center gap-2.5">
          <img
            src={t.requester.avatar}
            alt={t.requester.name}
            className="w-8 h-8 rounded-full object-cover border border-sand-300"
          />
          <div>
            <div className="text-xs font-bold text-sand-900">{t.requester.name}</div>
            <div className="text-[11px] text-sand-600">{t.requester.role} • {t.requester.phone}</div>
          </div>
        </div>
      )
    },
    {
      key: "category",
      header: "Category",
      render: (t: SupportTicket) => (
        <span className="text-xs font-medium text-sand-700 bg-sand-100 px-2.5 py-1 rounded-full border border-sand-200">
          {t.category}
        </span>
      )
    },
    {
      key: "priority",
      header: "Priority",
      render: (t: SupportTicket) => getPriorityBadge(t.priority)
    },
    {
      key: "status",
      header: "Status",
      render: (t: SupportTicket) => getStatusBadge(t.status)
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      render: (t: SupportTicket) => (
        <div className="text-xs font-medium text-sand-700 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-sand-500" />
          {t.assignedTo}
        </div>
      )
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (t: SupportTicket) => (
        <div className="text-xs text-sand-600 flex items-center gap-1">
          <Clock className="w-3 h-3 text-sand-400" />
          {t.updatedAt}
        </div>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (t: SupportTicket) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedTicket(t)}
          icon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          View Ticket
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title="Support & Dispute Operations"
        description="Manage multi-channel user, driver, and partner tickets, ride disputes, and escalations"
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Support" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" icon={<FileText className="w-4 h-4" />}>
              Export Ticket Audit
            </Button>
          </div>
        }
      />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Active Tickets"
            value={String(tickets.filter((t) => t.status !== "Closed" && t.status !== "Resolved").length)}
            icon={<LifeBuoy className="w-5 h-5 text-moss-600" />}
            trend={{ value: "12%", isPositive: false }}
          />
          <StatCard
            title="Critical Escalations"
            value={String(tickets.filter((t) => t.priority === "Critical" || t.category === "Escalations").length)}
            icon={<ShieldAlert className="w-5 h-5 text-terracotta-600" />}
            subtitle="Requires immediate review"
          />
          <StatCard
            title="Avg Resolution Time"
            value="1h 42m"
            icon={<Clock className="w-5 h-5 text-moss-600" />}
            trend={{ value: "18%", isPositive: true }}
          />
          <StatCard
            title="SLA Compliance"
            value="98.2%"
            icon={<CheckCircle2 className="w-5 h-5 text-moss-600" />}
            subtitle="Target: 95%"
          />
        </div>

        {/* Category Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-b border-sand-200/80">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? tickets.length
                : tickets.filter((t) => t.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#5D7052] text-white shadow-organic-sm"
                    : "bg-[#F0EBE5]/80 text-[#2C2C24] hover:bg-[#E6DCCD] hover:text-[#5D7052]"
                }`}
              >
                {cat}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-[#DED8CF] text-[#2C2C24]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search ID, requester, subject, ride..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4 text-sand-400" />}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sand-600">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-sand-50 border border-sand-300 text-xs font-medium rounded-xl px-3 py-2 text-sand-800 focus:outline-none focus:ring-2 focus:ring-moss-500"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sand-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-sand-50 border border-sand-300 text-xs font-medium rounded-xl px-3 py-2 text-sand-800 focus:outline-none focus:ring-2 focus:ring-moss-500"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Action">Pending Action</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <DataTable
          data={filteredTickets}
          columns={columns}
          keyExtractor={(item) => item.id}
          emptyMessage="No tickets match your category or search filter criteria."
        />

        {/* Ticket Detail Drawer / Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-sand-900/60 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-3xl bg-sand-50 h-full overflow-y-auto border-l border-sand-300 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-6 bg-white border-b border-sand-200 flex items-start justify-between sticky top-0 z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-moss-700 bg-moss-50 px-2 py-0.5 rounded border border-moss-200">
                      {selectedTicket.id}
                    </span>
                    <span className="text-xs font-semibold text-sand-600 bg-sand-100 px-2 py-0.5 rounded">
                      {selectedTicket.category}
                    </span>
                    {getPriorityBadge(selectedTicket.priority)}
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <h2 className="text-xl font-bold font-serif text-sand-900">
                    {selectedTicket.subject}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-xl text-sand-500 hover:text-sand-900 hover:bg-sand-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 flex-1">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-sand-200">
                  <div>
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider">Requester</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <img
                        src={selectedTicket.requester.avatar}
                        alt={selectedTicket.requester.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-sand-900">{selectedTicket.requester.name}</div>
                        <div className="text-[10px] text-sand-600">{selectedTicket.requester.role}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider">Assigned Agent</div>
                    <div className="text-xs font-bold text-sand-900 mt-2 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-moss-600" />
                      {selectedTicket.assignedTo}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider">Created / Updated</div>
                    <div className="text-xs text-sand-800 mt-2 font-medium">
                      {selectedTicket.createdAt}
                    </div>
                  </div>
                </div>

                {/* Related Entities Bar */}
                {(selectedTicket.relatedRideId || selectedTicket.relatedEntity) && (
                  <div className="bg-moss-50/60 border border-moss-200 p-3.5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-moss-700" />
                      <div>
                        <div className="text-xs font-bold text-moss-900">
                          {selectedTicket.relatedRideId ? `Linked Ride #${selectedTicket.relatedRideId}` : `Linked Entity: ${selectedTicket.relatedEntity?.name}`}
                        </div>
                        <div className="text-[11px] text-moss-700">
                          {selectedTicket.relatedEntity ? `${selectedTicket.relatedEntity.type} ID: ${selectedTicket.relatedEntity.id}` : "Tap to inspect route telemetry & fare breakdown"}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white" icon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                      Inspect Telemetry
                    </Button>
                  </div>
                )}

                {/* Issue Summary */}
                <div className="bg-white p-4 rounded-2xl border border-sand-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sand-500">Issue Summary</h4>
                  <p className="text-sm text-sand-800 leading-relaxed font-medium">
                    {selectedTicket.issueDescription}
                  </p>
                </div>

                {/* Tabs Header */}
                <Tabs
                  activeTab={drawerTab}
                  onChange={(id) => setDrawerTab(id)}
                  tabs={[
                    {
                      id: "convo",
                      label: "Live Conversation",
                      badge: selectedTicket.conversation.length
                    },
                    {
                      id: "activity",
                      label: "Activity Log",
                      badge: selectedTicket.activityLog.length
                    },
                    {
                      id: "resolution",
                      label: "Resolution & Refund"
                    }
                  ]}
                />

                {/* Tab 1: Live Conversation */}
                {drawerTab === "convo" && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-3">
                      {selectedTicket.conversation.map((msg) => {
                        const isSelf = msg.senderRole === "Super Admin" || msg.senderRole === "Support Agent";
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-bold text-sand-700">{msg.sender}</span>
                              <span className="text-[10px] text-sand-500">({msg.senderRole}) • {msg.timestamp}</span>
                            </div>
                            <div
                              className={`p-3.5 rounded-2xl max-w-lg text-sm font-medium ${
                                isSelf
                                  ? "bg-moss-700 text-white shadow-moss rounded-tr-none"
                                  : "bg-white text-sand-900 border border-sand-200 rounded-tl-none"
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reply Box */}
                    {selectedTicket.status !== "Closed" && (
                      <div className="bg-white p-4 rounded-2xl border border-sand-200 space-y-3">
                        <textarea
                          rows={3}
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type support response or internal note..."
                          className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3 text-sm text-sand-900 focus:outline-none focus:ring-2 focus:ring-moss-500 resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <button className="p-2 rounded-xl text-sand-500 hover:bg-sand-100 transition-colors flex items-center gap-1 text-xs font-semibold">
                            <Paperclip className="w-4 h-4" /> Attach File
                          </button>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowResolveModal(true)}
                              icon={<Check className="w-4 h-4 text-moss-600" />}
                            >
                              Mark Resolved
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={handleSendReply}
                              icon={<Send className="w-4 h-4" />}
                            >
                              Send Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Activity Log */}
                {drawerTab === "activity" && (
                  <div className="bg-white p-4 rounded-2xl border border-sand-200 space-y-3 pt-2">
                    {selectedTicket.activityLog.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-sand-100 last:border-none">
                        <div className="p-2 bg-sand-100 rounded-xl text-sand-600 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-sand-900">{log.action}</span>
                            <span className="text-[11px] text-sand-500">by {log.performer}</span>
                          </div>
                          <div className="text-[11px] text-sand-600">{log.timestamp}</div>
                          {log.notes && <div className="text-xs text-sand-700 italic mt-1">"{log.notes}"</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: Resolution & Refund */}
                {drawerTab === "resolution" && (
                  <div className="bg-white p-4 rounded-2xl border border-sand-200 space-y-4 pt-2">
                    {selectedTicket.resolution ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-moss-700 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" /> Ticket Resolved
                        </div>
                        <div className="text-xs text-sand-700">
                          <strong>Resolved By:</strong> {selectedTicket.resolution.resolvedBy} on {selectedTicket.resolution.resolvedAt}
                        </div>
                        <div className="p-3 bg-moss-50 border border-moss-200 rounded-xl text-xs text-moss-900">
                          <strong>Summary:</strong> {selectedTicket.resolution.summary}
                        </div>
                        {selectedTicket.resolution.refundAmount && (
                          <div className="text-xs font-semibold text-terracotta-700 bg-terracotta-50 p-2.5 rounded-xl border border-terracotta-200">
                            Wallet Credit Issued: {selectedTicket.resolution.refundAmount}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-3">
                        <p className="text-xs text-sand-600">No resolution record attached yet.</p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setShowResolveModal(true)}
                          icon={<Check className="w-4 h-4" />}
                        >
                          Resolve & Process Refund
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resolution Modal */}
        <Modal
          isOpen={showResolveModal}
          onClose={() => setShowResolveModal(false)}
          title="Resolve Ticket & Complete Case"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-sand-600">
              Provide a closing summary for ticket #{selectedTicket?.id}
            </p>
            <div>
              <label className="text-xs font-bold text-sand-700 block mb-1.5">
                Resolution Note & Rider Summary
              </label>
              <textarea
                rows={3}
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                placeholder="Explain the outcome, e.g. Telemetry verified, issued full refund for detour..."
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3 text-sm text-sand-900 focus:outline-none focus:ring-2 focus:ring-moss-500"
              />
            </div>

            <div className="bg-sand-100 p-3 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-sand-800">Issue Goodwill Wallet Refund?</span>
              <Button variant="outline" size="sm">₹150 Credit</Button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-sand-200">
              <Button variant="outline" size="sm" onClick={() => setShowResolveModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleResolveTicket}>
                Confirm Resolution
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  );
}
