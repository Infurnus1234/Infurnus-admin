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
  MOCK_SECURITY_DATA,
  SecurityEvent,
  ActiveSession
} from "@/lib/securityCenterData";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Search,
  Clock,
  User,
  Filter,
  Eye,
  Key,
  Globe,
  AlertTriangle,
  CheckCircle2,
  X,
  Smartphone,
  Laptop,
  Radio,
  FileCode,
  Shield,
  Activity,
  LogOut,
  UserX,
  Terminal
} from "lucide-react";

export default function SecurityPage() {
  const [stats, setStats] = useState(MOCK_SECURITY_DATA.stats);
  const [events, setEvents] = useState<SecurityEvent[]>(MOCK_SECURITY_DATA.securityEvents);
  const [sessions, setSessions] = useState<ActiveSession[]>(MOCK_SECURITY_DATA.activeSessions);

  const [activeTab, setActiveTab] = useState("overview");
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

  // Terminate active session mock action
  const handleTerminateSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    setStats((prev) => ({ ...prev, activeSessions: Math.max(0, prev.activeSessions - 1) }));
  };

  const getSeverityBadge = (severity: SecurityEvent["severity"]) => {
    switch (severity) {
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

  const getStatusBadge = (status: SecurityEvent["status"]) => {
    switch (status) {
      case "Open":
        return <Badge variant="terracotta">Open</Badge>;
      case "Investigating":
        return <Badge variant="sand">Investigating</Badge>;
      case "Mitigated":
        return <Badge variant="moss">Mitigated</Badge>;
      case "Resolved":
        return <Badge variant="moss">Resolved</Badge>;
      case "False Positive":
        return <Badge variant="muted">False Positive</Badge>;
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.ipAddress.includes(searchQuery) ||
      e.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = eventTypeFilter === "All" || e.eventType === eventTypeFilter;
    const matchesSeverity = severityFilter === "All" || e.severity === severityFilter;
    const matchesStatus = statusFilter === "All" || e.status === statusFilter;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const eventColumns: Column<SecurityEvent>[] = [
    {
      key: "event",
      header: "Security Event & ID",
      render: (e) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-moss-800 bg-moss-50 px-2 py-0.5 rounded border border-moss-200">
              {e.id}
            </span>
            <span className="text-[10px] font-semibold text-sand-600 bg-sand-100 px-1.5 py-0.5 rounded">
              {e.eventType}
            </span>
          </div>
          <div className="text-sm font-semibold text-sand-900 line-clamp-1 max-w-sm hover:text-moss-700 transition-colors cursor-pointer" onClick={() => setSelectedEvent(e)}>
            {e.event}
          </div>
        </div>
      )
    },
    {
      key: "actor",
      header: "Actor",
      render: (e) => (
        <div className="flex items-center gap-2">
          <img
            src={e.actor.avatar}
            alt={e.actor.name}
            className="w-7 h-7 rounded-full object-cover border border-sand-300 shrink-0"
          />
          <div>
            <div className="text-xs font-bold text-sand-900">{e.actor.name}</div>
            <div className="text-[10px] text-sand-600">{e.actor.role}</div>
          </div>
        </div>
      )
    },
    {
      key: "severity",
      header: "Severity",
      render: (e) => getSeverityBadge(e.severity)
    },
    {
      key: "ipAddress",
      header: "IP & Location",
      render: (e) => (
        <div className="text-xs font-mono text-sand-800 space-y-0.5">
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-sand-400" />
            {e.ipAddress}
          </div>
          <div className="text-[10px] text-sand-500 font-sans">{e.location}</div>
        </div>
      )
    },
    {
      key: "timestamp",
      header: "Timestamp",
      render: (e) => (
        <div className="text-xs font-mono text-sand-600 flex items-center gap-1">
          <Clock className="w-3 h-3 text-sand-400" />
          {e.timestamp}
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (e) => getStatusBadge(e.status)
    },
    {
      key: "actions",
      header: "Inspect",
      render: (e) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedEvent(e)}
          icon={<Eye className="w-3.5 h-3.5" />}
        >
          View Event
        </Button>
      )
    }
  ];

  const sessionColumns: Column<ActiveSession>[] = [
    {
      key: "adminName",
      header: "Admin Account",
      render: (s) => (
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-sand-900">{s.adminName}</div>
          <div className="text-[11px] text-sand-600">{s.adminEmail} • {s.role}</div>
        </div>
      )
    },
    {
      key: "ipAddress",
      header: "IP & Location",
      render: (s) => (
        <div className="text-xs font-mono text-sand-800">
          <div>{s.ipAddress}</div>
          <div className="text-[10px] text-sand-500">{s.location}</div>
        </div>
      )
    },
    {
      key: "device",
      header: "Device / Browser",
      render: (s) => (
        <div className="text-xs text-sand-700 flex items-center gap-1.5">
          <Laptop className="w-3.5 h-3.5 text-sand-400" />
          {s.device}
        </div>
      )
    },
    {
      key: "loginTime",
      header: "Login / Active",
      render: (s) => (
        <div className="text-xs text-sand-700 space-y-0.5">
          <div>Logged in: {s.loginTime}</div>
          <div className="text-[10px] text-moss-700 font-semibold">Active: {s.lastActive}</div>
        </div>
      )
    },
    {
      key: "mfaVerified",
      header: "MFA Status",
      render: (s) => (
        <Badge variant={s.mfaVerified ? "moss" : "destructive"}>
          {s.mfaVerified ? "MFA Active" : "Unverified"}
        </Badge>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (s) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTerminateSession(s.id)}
          icon={<LogOut className="w-3.5 h-3.5 text-terracotta-600" />}
        >
          Revoke Session
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title="Security Center & Threat Monitoring"
        description="Frontend prototype visualizing authentication attempts, permission updates, active admin sessions, and threat telemetry."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Security Center" },
        ]}
        actions={
          <div className="flex items-center gap-2 bg-sand-100 border border-sand-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-sand-800">
            <Shield className="w-4 h-4 text-moss-600" />
            Mock Simulation Mode Active
          </div>
        }
      />

        {/* Overview Cards (Required: Failed Logins, Suspicious Events, Active Sessions, Permission Changes, Role Changes, Critical Events) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Failed Logins"
            value={String(stats.failedLogins)}
            icon={<UserX className="w-5 h-5 text-terracotta-600" />}
            trend={{ value: "18 in last hour", isPositive: false }}
          />
          <StatCard
            title="Suspicious Events"
            value={String(stats.suspiciousEvents)}
            icon={<AlertTriangle className="w-5 h-5 text-terracotta-600" />}
            subtitle="Anomaly detection alerts"
          />
          <StatCard
            title="Active Sessions"
            value={String(stats.activeSessions)}
            icon={<Radio className="w-5 h-5 text-moss-600" />}
            subtitle="Concurrent admin logins"
          />
          <StatCard
            title="Permission Changes"
            value={String(stats.permissionChanges)}
            icon={<Key className="w-5 h-5 text-sand-700" />}
            subtitle="RBAC modifications this week"
          />
          <StatCard
            title="Role Changes"
            value={String(stats.roleChanges)}
            icon={<ShieldCheck className="w-5 h-5 text-moss-600" />}
            subtitle="Admin role escalations"
          />
          <StatCard
            title="Critical Events"
            value={String(stats.criticalEvents)}
            icon={<ShieldAlert className="w-5 h-5 text-terracotta-600" />}
            subtitle="Requires immediate review"
          />
        </div>

        {/* Primary Tabs: Security Overview / Security Events / Active Sessions */}
        <Tabs
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id)}
          tabs={[
            { id: "overview", label: "Security Overview", icon: <Shield className="w-4 h-4" /> },
            { id: "events", label: "Security Events Log", badge: filteredEvents.length, icon: <Activity className="w-4 h-4" /> },
            { id: "sessions", label: "Active Admin Sessions", badge: sessions.length, icon: <Laptop className="w-4 h-4" /> }
          ]}
        />

        {/* TAB 1: OVERVIEW & THREAT STREAM */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Stream */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-sand-200 space-y-4">
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Live Threat & Event Stream</h3>
                    <p className="text-xs text-sand-600">Recent security-relevant triggers and anomalies</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("events")}>
                    View All Events
                  </Button>
                </div>

                <div className="space-y-3">
                  {events.slice(0, 4).map((e) => (
                    <div
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      className="p-4 rounded-xl border border-sand-200 hover:border-sand-300 bg-sand-50/50 hover:bg-sand-100/50 transition-colors cursor-pointer flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-moss-800 bg-moss-50 px-2 py-0.5 rounded border border-moss-200">
                            {e.id}
                          </span>
                          {getSeverityBadge(e.severity)}
                          <span className="text-[10px] text-sand-500 font-mono">{e.timestamp}</span>
                        </div>
                        <div className="text-xs font-bold text-sand-900">{e.event}</div>
                        <p className="text-xs text-sand-600 line-clamp-1">{e.summary}</p>
                      </div>

                      <div className="text-right shrink-0">
                        {getStatusBadge(e.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Admin Sessions Preview Card */}
              <div className="bg-white p-6 rounded-2xl border border-sand-200 space-y-4">
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Active Admin Logins</h3>
                    <p className="text-xs text-sand-600">{sessions.length} sessions active</p>
                  </div>
                  <Radio className="w-4 h-4 text-moss-600 animate-pulse" />
                </div>

                <div className="space-y-3">
                  {sessions.map((s) => (
                    <div key={s.id} className="p-3 bg-sand-50 rounded-xl border border-sand-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sand-900">{s.adminName}</span>
                        <span className="text-[10px] font-semibold text-moss-700 bg-moss-50 px-1.5 py-0.5 rounded">
                          {s.role}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-sand-600">{s.ipAddress} • {s.location}</div>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-sand-500">
                        <span>{s.device}</span>
                        <button
                          onClick={() => handleTerminateSession(s.id)}
                          className="text-terracotta-600 font-semibold hover:underline"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED SECURITY EVENTS TABLE */}
        {activeTab === "events" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Filters bar */}
            <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-80">
                <Input
                  placeholder="Search event ID, description, actor, IP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4 text-sand-400" />}
                />
              </div>

              <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto">
                <select
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                  className="bg-sand-50 border border-sand-300 text-xs font-medium rounded-xl px-3 py-2 text-sand-800 focus:outline-none"
                >
                  <option value="All">All Event Categories</option>
                  <option value="Login Activity">Login Activity</option>
                  <option value="Permission Changes">Permission Changes</option>
                  <option value="Role Changes">Role Changes</option>
                  <option value="Admin Events">Admin Events</option>
                  <option value="Critical Configuration Changes">Critical Config Changes</option>
                  <option value="Suspicious Events">Suspicious Events</option>
                </select>

                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-sand-50 border border-sand-300 text-xs font-medium rounded-xl px-3 py-2 text-sand-800 focus:outline-none"
                >
                  <option value="All">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-sand-50 border border-sand-300 text-xs font-medium rounded-xl px-3 py-2 text-sand-800 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Mitigated">Mitigated</option>
                  <option value="Resolved">Resolved</option>
                  <option value="False Positive">False Positive</option>
                </select>
              </div>
            </div>

            {/* Event Table */}
            <DataTable
              data={filteredEvents}
              columns={eventColumns}
              keyExtractor={(item) => item.id}
              emptyMessage="No security events match the current filter criteria."
            />
          </div>
        )}

        {/* TAB 3: ACTIVE SESSIONS */}
        {activeTab === "sessions" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <DataTable
              data={sessions}
              columns={sessionColumns}
              keyExtractor={(item) => item.id}
              emptyMessage="No active admin sessions logged."
            />
          </div>
        )}

        {/* Event Detail Drawer */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-sand-900/60 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-3xl bg-sand-50 h-full overflow-y-auto border-l border-sand-300 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-6 bg-white border-b border-sand-200 flex items-start justify-between sticky top-0 z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-moss-800 bg-moss-50 px-2 py-0.5 rounded border border-moss-200">
                      {selectedEvent.id}
                    </span>
                    <span className="text-xs font-semibold text-sand-600 bg-sand-100 px-2 py-0.5 rounded">
                      {selectedEvent.eventType}
                    </span>
                    {getSeverityBadge(selectedEvent.severity)}
                    {getStatusBadge(selectedEvent.status)}
                  </div>
                  <h2 className="text-xl font-bold font-serif text-sand-900">
                    {selectedEvent.event}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
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
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider">Actor / Principal</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <img
                        src={selectedEvent.actor.avatar}
                        alt={selectedEvent.actor.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-sand-900">{selectedEvent.actor.name}</div>
                        <div className="text-[10px] text-sand-600">{selectedEvent.actor.role}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider">IP & Geolocation</div>
                    <div className="text-xs font-mono font-bold text-sand-900 mt-2">
                      {selectedEvent.ipAddress}
                    </div>
                    <div className="text-[10px] text-sand-600">{selectedEvent.location}</div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider">MFA / Auth Context</div>
                    <div className="text-xs font-bold text-sand-900 mt-2">
                      {selectedEvent.mfaMethod}
                    </div>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-white p-4 rounded-2xl border border-sand-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sand-500">Security Incident Summary</h4>
                  <p className="text-sm text-sand-900 leading-relaxed font-medium">
                    {selectedEvent.summary}
                  </p>
                </div>

                {/* Raw Payload View */}
                {selectedEvent.rawPayload && (
                  <div className="bg-white p-4 rounded-2xl border border-sand-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-sand-500 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-moss-600" />
                        Raw Threat Payload & Rule Trigger
                      </h4>
                      <span className="text-[10px] font-mono text-sand-500">JSON Telemetry</span>
                    </div>
                    <pre className="text-xs font-mono text-sand-900 bg-sand-50 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-sand-200">
                      {JSON.stringify(selectedEvent.rawPayload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
