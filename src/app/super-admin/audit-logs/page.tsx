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
import { Column } from "@/types";
import {
  MOCK_AUDIT_LOGS,
  AuditRecord
} from "@/lib/auditLogsData";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Search,
  Clock,
  User,
  Filter,
  Eye,
  FileText,
  X,
  ArrowRight,
  CheckCircle2,
  AlertOctagon,
  Download,
  Key,
  Globe,
  Database
} from "lucide-react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditRecord[]>(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [resourceFilter, setResourceFilter] = useState("All");
  const [resultFilter, setResultFilter] = useState("All");
  const [approvalFilter, setApprovalFilter] = useState("All");

  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  // Filters
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.securityContext.ipAddress.includes(searchQuery);

    const matchesRole = roleFilter === "All" || log.role === roleFilter;
    const matchesAction = actionFilter === "All" || log.action === actionFilter;
    const matchesResource = resourceFilter === "All" || log.resource === resourceFilter;
    const matchesResult = resultFilter === "All" || log.result === resultFilter;
    const matchesApproval =
      approvalFilter === "All" ||
      (approvalFilter === "Yes" && log.approvalRequired) ||
      (approvalFilter === "No" && !log.approvalRequired);

    return matchesSearch && matchesRole && matchesAction && matchesResource && matchesResult && matchesApproval;
  });

  const getResultBadge = (result: AuditRecord["result"]) => {
    switch (result) {
      case "Success":
        return <Badge variant="moss">Success</Badge>;
      case "Failed":
        return <Badge variant="terracotta">Failed</Badge>;
      case "Blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      case "Pending Verification":
        return <Badge variant="sand">Pending</Badge>;
    }
  };

  const columns: Column<AuditRecord>[] = [
    {
      key: "timestamp",
      header: "Timestamp & Log ID",
      render: (log) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-sand-600 font-mono">
            <Clock className="w-3 h-3 text-sand-400" />
            {log.timestamp}
          </div>
          <div className="font-mono text-[11px] font-bold text-moss-800 bg-moss-50 px-2 py-0.5 rounded border border-moss-200 inline-block">
            {log.id}
          </div>
        </div>
      )
    },
    {
      key: "actor",
      header: "Actor & Role",
      render: (log) => (
        <div className="flex items-center gap-2.5">
          <img
            src={log.actor.avatar}
            alt={log.actor.name}
            className="w-7 h-7 rounded-full object-cover border border-sand-300 shrink-0"
          />
          <div>
            <div className="text-xs font-bold text-sand-900">{log.actor.name}</div>
            <div className="text-[10px] font-medium text-sand-600">{log.role}</div>
          </div>
        </div>
      )
    },
    {
      key: "action",
      header: "Action",
      render: (log) => (
        <span className="font-mono text-xs font-semibold text-sand-900 bg-sand-100 px-2 py-1 rounded border border-sand-200">
          {log.action}
        </span>
      )
    },
    {
      key: "resource",
      header: "Resource & Target ID",
      render: (log) => (
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-sand-800">{log.resource}</div>
          <div className="text-[11px] font-mono text-sand-600 truncate max-w-[140px]">{log.resourceId}</div>
        </div>
      )
    },
    {
      key: "approvalStatus",
      header: "Approval Required",
      render: (log) => (
        <div className="space-y-0.5">
          {log.approvalRequired ? (
            <Badge variant="terracotta">Required ({log.approvalStatus})</Badge>
          ) : (
            <Badge variant="muted">Direct Action</Badge>
          )}
        </div>
      )
    },
    {
      key: "result",
      header: "Result",
      render: (log) => getResultBadge(log.result)
    },
    {
      key: "securityContext",
      header: "Security Context (IP)",
      render: (log) => (
        <div className="text-xs font-mono text-sand-700 space-y-0.5">
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-sand-400" />
            {log.securityContext.ipAddress}
          </div>
          <div className="text-[10px] text-sand-500 font-sans">{log.securityContext.location}</div>
        </div>
      )
    },
    {
      key: "actions",
      header: "Inspect",
      render: (log) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedRecord(log)}
          icon={<Eye className="w-3.5 h-3.5" />}
        >
          View Audit
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title="Immutable Audit & Security Trail"
        description="Cryptographically signed, tamper-proof system event logs and administrative state mutations"
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Audit Logs" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-moss-700 bg-moss-50 px-3 py-1.5 rounded-xl border border-moss-200">
              <Lock className="w-3.5 h-3.5 text-moss-600" />
              Read-Only Vault Active
            </div>
            <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
              Export Signed Log (JSON/CSV)
            </Button>
          </div>
        }
      />

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Events Logged"
            value={String(logs.length)}
            icon={<ShieldCheck className="w-5 h-5 text-moss-600" />}
            subtitle="Immutable storage node #4"
          />
          <StatCard
            title="Approval-Gated Actions"
            value={String(logs.filter((l) => l.approvalRequired).length)}
            icon={<Key className="w-5 h-5 text-terracotta-600" />}
            subtitle="Multi-signature enforced"
          />
          <StatCard
            title="Blocked Security Threats"
            value={String(logs.filter((l) => l.result === "Blocked").length)}
            icon={<ShieldAlert className="w-5 h-5 text-terracotta-600" />}
            subtitle="Automated firewall triggers"
          />
          <StatCard
            title="Audit Chain Integrity"
            value="100% Valid"
            icon={<CheckCircle2 className="w-5 h-5 text-moss-600" />}
            subtitle="SHA-256 block hash verified"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-96">
              <Input
                placeholder="Search actor, action, IP, resource ID, reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4 text-sand-400" />}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <span className="text-xs font-semibold text-sand-600 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-sand-500" /> Filters:
              </span>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-sand-50 border border-sand-300 text-xs font-medium rounded-xl px-3 py-2 text-sand-800 focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Regional Admin">Regional Admin</option>
                <option value="Support Admin">Support Admin</option>
                <option value="System Worker">System Worker</option>
              </select>

              <select
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                className="bg-sand-50 border border-sand-300 text-xs font-medium rounded-xl px-3 py-2 text-sand-800 focus:outline-none"
              >
                <option value="All">All Resources</option>
                <option value="Admin Role">Admin Role</option>
                <option value="Driver">Driver</option>
                <option value="Coupon">Coupon</option>
                <option value="Payment">Payment</option>
                <option value="User">User</option>
              </select>

              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="bg-sand-50 border border-sand-300 text-xs font-medium rounded-xl px-3 py-2 text-sand-800 focus:outline-none"
              >
                <option value="All">All Results</option>
                <option value="Success">Success</option>
                <option value="Blocked">Blocked</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <DataTable
          data={filteredLogs}
          columns={columns}
          keyExtractor={(item) => item.id}
          emptyMessage="No audit logs match your specified filter parameters."
        />

        {/* Detailed State Comparison Drawer / Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-sand-900/60 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-4xl bg-sand-50 h-full overflow-y-auto border-l border-sand-300 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-6 bg-white border-b border-sand-200 flex items-start justify-between sticky top-0 z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-moss-700 bg-moss-50 px-2.5 py-0.5 rounded border border-moss-200">
                      {selectedRecord.id}
                    </span>
                    <span className="font-mono text-xs font-bold text-sand-900 bg-sand-100 px-2 py-0.5 rounded">
                      {selectedRecord.action}
                    </span>
                    {getResultBadge(selectedRecord.result)}
                  </div>
                  <h2 className="text-xl font-bold font-serif text-sand-900">
                    Audit Inspection: {selectedRecord.resource} ({selectedRecord.resourceId})
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 rounded-xl text-sand-500 hover:text-sand-900 hover:bg-sand-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 flex-1">
                {/* Immutability Banner */}
                <div className="bg-sand-200/60 border border-sand-300 p-3.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-sand-800 font-semibold">
                    <Lock className="w-4 h-4 text-sand-600" />
                    <span>This audit record is sealed, cryptographically signed, and read-only.</span>
                  </div>
                  <span className="text-[10px] font-mono text-sand-600 bg-white px-2 py-0.5 rounded border border-sand-300">
                    SHA-256 Verified
                  </span>
                </div>

                {/* Grid: Who, What, When */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-sand-200">
                  <div>
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider">Who (Actor)</div>
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={selectedRecord.actor.avatar}
                        alt={selectedRecord.actor.name}
                        className="w-8 h-8 rounded-full object-cover border border-sand-300"
                      />
                      <div>
                        <div className="text-xs font-bold text-sand-900">{selectedRecord.actor.name}</div>
                        <div className="text-[11px] text-sand-600">{selectedRecord.role}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider">When (Timestamp)</div>
                    <div className="text-xs font-mono font-bold text-sand-900 mt-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sand-500" />
                      {selectedRecord.timestamp}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider">Resource Target</div>
                    <div className="text-xs font-bold text-sand-900 mt-2">
                      {selectedRecord.resource}
                    </div>
                    <div className="text-[11px] font-mono text-sand-600">{selectedRecord.resourceId}</div>
                  </div>
                </div>

                {/* Approval & Security Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-sand-200 space-y-2">
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-moss-600" /> Approval Context
                    </div>
                    <div className="text-xs text-sand-800 space-y-1">
                      <div><strong>Required:</strong> {selectedRecord.approvalRequired ? "Yes (Multi-Sig Gate)" : "No (Direct Authority)"}</div>
                      {selectedRecord.approvalStatus && <div><strong>Status:</strong> {selectedRecord.approvalStatus}</div>}
                      {selectedRecord.approver && (
                        <div>
                          <strong>Approved By:</strong> {selectedRecord.approver.name} ({selectedRecord.approver.role}) at {selectedRecord.approver.approvedAt}
                        </div>
                      )}
                      {selectedRecord.requestId && <div><strong>Linked Request ID:</strong> <span className="font-mono text-moss-700 font-semibold">{selectedRecord.requestId}</span></div>}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-sand-200 space-y-2">
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-terracotta-600" /> Security Context
                    </div>
                    <div className="text-xs text-sand-800 font-mono space-y-1">
                      <div><strong>IP Address:</strong> {selectedRecord.securityContext.ipAddress}</div>
                      <div><strong>Location:</strong> {selectedRecord.securityContext.location}</div>
                      <div><strong>Device / User-Agent:</strong> {selectedRecord.securityContext.device}</div>
                      <div><strong>MFA Verified:</strong> {selectedRecord.securityContext.mfaVerified ? "Yes (FIDO2 WebAuthn)" : "No (Failed/Bypassed)"}</div>
                    </div>
                  </div>
                </div>

                {/* Reason Statement */}
                <div className="bg-white p-4 rounded-2xl border border-sand-200 space-y-1.5">
                  <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider">Stated Justification / Reason</div>
                  <p className="text-sm text-sand-900 font-medium italic">
                    "{selectedRecord.reason}"
                  </p>
                </div>

                {/* State Diff Comparison UI */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-serif text-sand-900 flex items-center gap-2">
                      <Database className="w-4 h-4 text-moss-600" />
                      State Diff Inspection (Before vs After)
                    </h3>
                    <span className="text-[11px] font-mono text-sand-500">Mutations strictly tracked</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Previous State */}
                    <div className="bg-red-50/50 border border-red-200/70 p-4 rounded-2xl space-y-2">
                      <div className="text-xs font-bold text-red-800 flex items-center justify-between border-b border-red-200/60 pb-2">
                        <span>Previous State (Before)</span>
                        <span className="text-[10px] font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded">ORIGINAL</span>
                      </div>
                      <pre className="text-xs font-mono text-sand-800 bg-white/70 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-red-100">
                        {JSON.stringify(selectedRecord.previousState, null, 2)}
                      </pre>
                    </div>

                    {/* New State */}
                    <div className="bg-moss-50/60 border border-moss-200 p-4 rounded-2xl space-y-2">
                      <div className="text-xs font-bold text-moss-900 flex items-center justify-between border-b border-moss-200 pb-2">
                        <span>New State (After)</span>
                        <span className="text-[10px] font-mono bg-moss-200 text-moss-900 px-2 py-0.5 rounded">MUTATED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
