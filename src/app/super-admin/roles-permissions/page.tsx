"use client";

import React, { useState, useMemo } from "react";
import {
  AssignedPermissionRule,
  MOCK_PERMISSION_RULES,
  MOCK_ADMIN_SELECT_OPTIONS,
  RESOURCES_LIST,
  ACTIONS_LIST,
  SCOPES_LIST,
  ResourceType,
  ActionType,
  ScopeType,
  PermissionLifetime,
  getEffectiveSummary,
} from "@/lib/rolesPermissionsData";
import {
  PageHeader,
  Button,
  Select,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  DataTable,
  Modal,
  Input,
  EmptyState,
} from "@/components";
import { Column } from "@/types";
import {
  Search,
  Plus,
  ShieldCheck,
  Key,
  Layers,
  Clock,
  Trash2,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";

export default function RolesPermissionsPage() {
  const [rules, setRules] = useState<AssignedPermissionRule[]>(MOCK_PERMISSION_RULES);
  const [selectedAdminId, setSelectedAdminId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [resourceFilter, setResourceFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [scopeFilter, setScopeFilter] = useState<string>("ALL");
  const [lifetimeFilter, setLifetimeFilter] = useState<string>("ALL");

  // Selected Rule for Effective Summary Focus
  const [focusedRuleId, setFocusedRuleId] = useState<string>(MOCK_PERMISSION_RULES[0].id);

  // New Permission Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [newAdminId, setNewAdminId] = useState("ADM-100");
  const [newResource, setNewResource] = useState<ResourceType>("Vehicle");
  const [newAction, setNewAction] = useState<ActionType>("View");
  const [newScope, setNewScope] = useState<ScopeType>("Fleet");
  const [newScopeValue, setNewScopeValue] = useState("Fleet A (Berlin Express)");
  const [newLifetime, setNewLifetime] = useState<PermissionLifetime>("Permanent");
  const [newExpiresAt, setNewExpiresAt] = useState("2026-10-31 (30 days)");

  // Filter Logic
  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      if (selectedAdminId !== "ALL" && r.adminId !== selectedAdminId) return false;
      if (resourceFilter !== "ALL" && r.resource !== resourceFilter) return false;
      if (actionFilter !== "ALL" && r.action !== actionFilter) return false;
      if (scopeFilter !== "ALL" && r.scope !== scopeFilter) return false;
      if (lifetimeFilter !== "ALL" && r.lifetime !== lifetimeFilter) return false;

      const permCode = `${r.action.toUpperCase()}_${r.resource.toUpperCase()}`;
      const matchesSearch =
        permCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.scopeValue.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [rules, selectedAdminId, resourceFilter, actionFilter, scopeFilter, lifetimeFilter, searchQuery]);

  // Focused Rule Object
  const focusedRule = useMemo(() => {
    return rules.find((r) => r.id === focusedRuleId) || filteredRules[0] || rules[0];
  }, [rules, focusedRuleId, filteredRules]);

  // Revoke Rule Handler
  const handleRevokeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  // Grant New Permission Rule
  const handleGrantPermission = () => {
    const adminObj = MOCK_ADMIN_SELECT_OPTIONS.find((a) => a.id === newAdminId) || MOCK_ADMIN_SELECT_OPTIONS[0];

    const newRule: AssignedPermissionRule = {
      id: `RULE-${Date.now().toString().slice(-3)}`,
      adminId: adminObj.id,
      adminName: adminObj.name,
      resource: newResource,
      action: newAction,
      scope: newScope,
      scopeValue: newScopeValue || `${newScope} Scope`,
      lifetime: newLifetime,
      expiresAt: newLifetime === "Temporary" ? newExpiresAt : newLifetime === "One-time" ? "Single Execution Allowance" : undefined,
      grantedDate: new Date().toISOString().slice(0, 10),
    };

    setRules((prev) => [newRule, ...prev]);
    setFocusedRuleId(newRule.id);
    setIsAssignModalOpen(false);
  };

  const columns: Column<AssignedPermissionRule>[] = [
    {
      key: "code",
      header: "Permission Code",
      render: (r) => (
        <div>
          <button
            onClick={() => setFocusedRuleId(r.id)}
            className="font-mono text-xs font-bold text-[#5D7052] hover:underline text-left cursor-pointer"
          >
            {r.action.toUpperCase()}_{r.resource.toUpperCase()}
          </button>
          <p className="text-[10px] text-[#78786C] font-mono">{r.id}</p>
        </div>
      ),
    },
    {
      key: "adminName",
      header: "Assigned Admin",
      render: (r) => (
        <div>
          <p className="font-bold text-xs text-[#2C2C24]">{r.adminName}</p>
          <p className="text-[10px] text-[#78786C] font-mono">{r.adminId}</p>
        </div>
      ),
    },
    {
      key: "scope",
      header: "Scope & Target",
      render: (r) => (
        <div>
          <span className="font-bold text-xs text-[#C18C5D]">{r.scopeValue}</span>
          <span className="text-[10px] text-[#78786C] block">({r.scope})</span>
        </div>
      ),
    },
    {
      key: "lifetime",
      header: "Lifetime State",
      render: (r) => (
        <div>
          <Badge
            variant={
              r.lifetime === "Permanent"
                ? "moss"
                : r.lifetime === "Temporary"
                ? "terracotta"
                : "sand"
            }
            size="sm"
          >
            {r.lifetime}
          </Badge>
          {r.expiresAt && <p className="text-[10px] text-[#78786C] mt-0.5">{r.expiresAt}</p>}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="px-2.5 py-1 text-xs text-[#5D7052]"
            onClick={() => setFocusedRuleId(r.id)}
          >
            Focus
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 rounded-full text-[#A85448] hover:bg-[#A85448]/10"
            onClick={() => handleRevokeRule(r.id)}
            title="Revoke Permission"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <PageHeader
        title="Roles & Permissions Matrix"
        description="Fine-grained Resource x Action x Scope permission management engine with temporary and one-time permission states."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Roles & Permissions" },
        ]}
        actions={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAssignModalOpen(true)}
          >
            Assign New Permission
          </Button>
        }
      />

      {/* Readable Effective Permission Summary Card */}
      {focusedRule && (
        <Card variant="sand" rounded="3xl" padding="lg" className="border-2 border-[#5D7052]/30 shadow-organic">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#5D7052] text-white shrink-0 shadow-moss">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#78786C]">
                    Effective Permission Summary
                  </span>
                  <Badge variant="moss" size="sm">Active Engine State</Badge>
                </div>
                <span className="text-xs font-mono text-[#78786C]">Rule: {focusedRule.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white border border-[#DED8CF] text-xs">
                <div>
                  <span className="text-[#78786C] block font-semibold">Admin User</span>
                  <span className="font-bold text-[#2C2C24]">{focusedRule.adminName}</span>
                </div>
                <div>
                  <span className="text-[#78786C] block font-semibold">Permission Code</span>
                  <span className="font-mono font-bold text-[#5D7052]">
                    {focusedRule.action.toUpperCase()}_{focusedRule.resource.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-[#78786C] block font-semibold">Scoped Target</span>
                  <span className="font-bold text-[#C18C5D]">{focusedRule.scopeValue}</span>
                </div>
              </div>

              <p className="text-xs font-medium text-[#2C2C24] leading-relaxed bg-[#F0EBE5]/60 p-3 rounded-2xl border border-[#DED8CF]/60">
                <Info className="w-4 h-4 inline mr-1 text-[#5D7052]" />
                {getEffectiveSummary(focusedRule)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Admin Selector & Filter Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Admin Selector */}
          <div className="w-full sm:w-72">
            <Select
              label="Selected Administrator"
              value={selectedAdminId}
              onChange={(e) => setSelectedAdminId(e.target.value)}
              options={[
                { label: "All Administrators", value: "ALL" },
                ...MOCK_ADMIN_SELECT_OPTIONS.map((a) => ({
                  label: `${a.name} (${a.role})`,
                  value: a.id,
                })),
              ]}
            />
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code e.g. VIEW_VEHICLE or scope..."
              className="w-full bg-white border border-[#DED8CF] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052] transition-all"
            />
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <Card variant="elevated" rounded="2xl" padding="md">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Select
              label="Resource Filter"
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              options={[
                { label: "All Resources", value: "ALL" },
                ...RESOURCES_LIST.map((r) => ({ label: r, value: r })),
              ]}
            />

            <Select
              label="Action Filter"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              options={[
                { label: "All Actions", value: "ALL" },
                ...ACTIONS_LIST.map((a) => ({ label: a, value: a })),
              ]}
            />

            <Select
              label="Scope Filter"
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              options={[
                { label: "All Scopes", value: "ALL" },
                ...SCOPES_LIST.map((s) => ({ label: s, value: s })),
              ]}
            />

            <Select
              label="Lifetime State"
              value={lifetimeFilter}
              onChange={(e) => setLifetimeFilter(e.target.value)}
              options={[
                { label: "All Lifetimes", value: "ALL" },
                { label: "Permanent", value: "Permanent" },
                { label: "Temporary", value: "Temporary" },
                { label: "One-time", value: "One-time" },
              ]}
            />
          </div>
        </Card>
      </div>

      {/* Permission Matrix DataTable */}
      {filteredRules.length === 0 ? (
        <EmptyState
          title="No Permission Rules Matched"
          description="Try resetting your active resource, action, or scope filters."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAdminId("ALL");
                setResourceFilter("ALL");
                setActionFilter("ALL");
                setScopeFilter("ALL");
                setLifetimeFilter("ALL");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <DataTable columns={columns} data={filteredRules} keyExtractor={(r) => r.id} />
      )}

      {/* Permission Assignment Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Resource-Action-Scope Permission"
        description="Configure a new permission rule for an administrator account."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleGrantPermission}>
              Grant Permission
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Select
            label="Target Administrator"
            value={newAdminId}
            onChange={(e) => setNewAdminId(e.target.value)}
            options={MOCK_ADMIN_SELECT_OPTIONS.map((a) => ({
              label: `${a.name} (${a.role})`,
              value: a.id,
            }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Resource"
              value={newResource}
              onChange={(e) => setNewResource(e.target.value as ResourceType)}
              options={RESOURCES_LIST.map((r) => ({ label: r, value: r }))}
            />

            <Select
              label="Action"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value as ActionType)}
              options={ACTIONS_LIST.map((a) => ({ label: a, value: a }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Scope Level"
              value={newScope}
              onChange={(e) => setNewScope(e.target.value as ScopeType)}
              options={SCOPES_LIST.map((s) => ({ label: s, value: s }))}
            />

            <Input
              label="Scope Target / Value"
              value={newScopeValue}
              onChange={(e) => setNewScopeValue(e.target.value)}
              placeholder="e.g. Fleet A (Berlin Express)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Permission Lifetime"
              value={newLifetime}
              onChange={(e) => setNewLifetime(e.target.value as PermissionLifetime)}
              options={[
                { label: "Permanent", value: "Permanent" },
                { label: "Temporary (Time-bounded)", value: "Temporary" },
                { label: "One-time (Single Execution)", value: "One-time" },
              ]}
            />

            {newLifetime === "Temporary" && (
              <Input
                label="Expiration Duration"
                value={newExpiresAt}
                onChange={(e) => setNewExpiresAt(e.target.value)}
                placeholder="e.g. 2026-10-31 (30 days)"
              />
            )}
          </div>

          <div className="p-3 rounded-2xl bg-[#F0EBE5] text-xs font-semibold text-[#5D7052]">
            Effective Code Preview: <span className="font-mono font-bold">{newAction.toUpperCase()}_{newResource.toUpperCase()}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
