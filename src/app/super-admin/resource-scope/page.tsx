"use client";

import React, { useState } from "react";
import {
  MOCK_RESOURCE_HIERARCHY,
  ResourceTreeNode,
} from "@/lib/resourceScopeData";
import { MOCK_ADMIN_SELECT_OPTIONS } from "@/lib/rolesPermissionsData";
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
} from "@/components";
import {
  ChevronRight,
  ChevronDown,
  Layers,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building,
  Car,
  User,
  MapPin,
  Check,
} from "lucide-react";

export default function ResourceScopePage() {
  const [selectedAdminId, setSelectedAdminId] = useState("ADM-101");
  const [scopeTypeFilter, setScopeTypeFilter] = useState("ALL");
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([
    "flt_ber_express",
    "veh_bin_4022",
    "drv_hans_gruber",
  ]);

  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>([
    "st_berlin",
    "dist_mitte",
    "city_berlin_c",
    "ptr_ecomove",
    "flt_ber_express",
    "veh_bin_4022",
  ]);

  const [savedFeedback, setSavedFeedback] = useState(false);

  const selectedAdmin =
    MOCK_ADMIN_SELECT_OPTIONS.find((a) => a.id === selectedAdminId) ||
    MOCK_ADMIN_SELECT_OPTIONS[0];

  const toggleExpand = (nodeId: string) => {
    setExpandedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const toggleSelect = (nodeId: string) => {
    setSelectedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleReset = () => {
    setSelectedNodeIds(["flt_ber_express", "veh_bin_4022", "drv_hans_gruber"]);
  };

  // Helper to render tree nodes recursively
  const renderTreeNode = (node: ResourceTreeNode, depth: number = 0) => {
    const isExpanded = expandedNodeIds.includes(node.id);
    const isSelected = selectedNodeIds.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;

    // Filter by Scope Type if selected
    if (scopeTypeFilter !== "ALL" && node.type !== scopeTypeFilter && !hasChildren) {
      // return null if not matching
    }

    const badgeColor =
      node.type === "State" || node.type === "District" || node.type === "City"
        ? "sand"
        : node.type === "Partner" || node.type === "Fleet"
        ? "terracotta"
        : "moss";

    return (
      <div key={node.id} className="space-y-1">
        <div
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs transition-all duration-200 ${
            isSelected
              ? "bg-[#5D7052]/10 border-[#5D7052] shadow-organic-sm font-semibold"
              : "bg-white border-[#DED8CF] hover:bg-[#F0EBE5]/50"
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(node.id)}
                className="p-1 rounded-lg hover:bg-[#DED8CF]/40 text-[#78786C]"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <span className="w-6" />
            )}

            <button
              onClick={() => toggleSelect(node.id)}
              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[#5D7052] border-[#5D7052] text-white"
                  : "border-[#DED8CF] bg-white"
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </button>

            <span className="font-bold text-[#2C2C24] truncate">{node.name}</span>
          </div>

          <Badge variant={badgeColor} size="sm">
            {node.type}
          </Badge>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <PageHeader
        title="Resource & Scope Management"
        description="Hierarchical resource assignment engine mapping State → District → City → Partner → Fleet → Vehicle → Driver → User → Ride."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Resource & Scope" },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            {savedFeedback && (
              <span className="text-xs font-bold text-[#5D7052] flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Scope Saved!
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleReset}
            >
              Reset UI
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
              onClick={handleSave}
            >
              Save Scope Assignment
            </Button>
          </div>
        }
      />

      {/* Admin & Scope Controls */}
      <Card variant="elevated" rounded="3xl">
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Target Administrator"
            value={selectedAdminId}
            onChange={(e) => setSelectedAdminId(e.target.value)}
            options={MOCK_ADMIN_SELECT_OPTIONS.map((a) => ({
              label: `${a.name} (${a.role})`,
              value: a.id,
            }))}
          />

          <Select
            label="Filter Hierarchy Level"
            value={scopeTypeFilter}
            onChange={(e) => setScopeTypeFilter(e.target.value)}
            options={[
              { label: "All Hierarchy Levels", value: "ALL" },
              { label: "State Level", value: "State" },
              { label: "District Level", value: "District" },
              { label: "City Level", value: "City" },
              { label: "Partner Level", value: "Partner" },
              { label: "Fleet Level", value: "Fleet" },
              { label: "Vehicle Level", value: "Vehicle" },
              { label: "Driver Level", value: "Driver" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Main Dual Grid: Resource Tree vs Selected Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Interactive Resource Tree */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#5D7052]" /> Resource Hierarchy Tree
                  </CardTitle>
                  <CardDescription>
                    Expand nodes and check boxes to assign resource scopes to {selectedAdmin.name}.
                  </CardDescription>
                </div>
                <Badge variant="moss" size="sm">
                  Interactive Tree
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {MOCK_RESOURCE_HIERARCHY.map((rootNode) => renderTreeNode(rootNode, 0))}
            </CardContent>
          </Card>
        </div>

        {/* Right 5 Columns: Selected Resources & Assignment Summary Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Assignment Summary Box */}
          <Card variant="sand" rounded="3xl" padding="lg">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#5D7052]" />
                <h3 className="font-heading text-lg font-bold text-[#2C2C24]">
                  Assignment Summary
                </h3>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#DED8CF] text-xs space-y-1.5">
                <p>
                  <span className="text-[#78786C]">Target Admin:</span>{" "}
                  <span className="font-bold text-[#2C2C24]">{selectedAdmin.name}</span>
                </p>
                <p>
                  <span className="text-[#78786C]">Directly Selected Nodes:</span>{" "}
                  <span className="font-bold text-[#5D7052]">{selectedNodeIds.length} Nodes</span>
                </p>
              </div>

              <p className="text-xs font-medium text-[#2C2C24] leading-relaxed bg-[#F0EBE5]/60 p-3.5 rounded-2xl border border-[#DED8CF]">
                {selectedAdmin.name} is granted scoped administration over {selectedNodeIds.length} resource items across the State → Partner → Fleet hierarchy, inheriting sub-resource controls for assigned vehicles and drivers.
              </p>
            </div>
          </Card>

          {/* Selected Resources Panel */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle>Selected Resources Panel ({selectedNodeIds.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs max-h-96 overflow-y-auto">
              {selectedNodeIds.length === 0 ? (
                <p className="text-[#78786C]">No resources currently selected.</p>
              ) : (
                selectedNodeIds.map((id) => (
                  <div
                    key={id}
                    className="p-3 rounded-2xl bg-white border border-[#DED8CF] flex items-center justify-between"
                  >
                    <span className="font-bold text-[#2C2C24] font-mono">{id}</span>
                    <button
                      onClick={() => toggleSelect(id)}
                      className="text-[10px] text-[#A85448] font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
