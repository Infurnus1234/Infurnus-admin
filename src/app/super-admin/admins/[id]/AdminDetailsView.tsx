"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminUserRecord, ALL_AVAILABLE_PERMISSIONS } from "@/lib/adminData";
import {
  PageHeader,
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Tabs,
  Modal,
  Input,
} from "@/components";
import {
  ArrowLeft,
  UserCheck,
  Ban,
  Key,
  Layers,
  SlidersHorizontal,
  ShieldAlert,
  Activity,
  Check,
  Clock,
  Lock,
} from "lucide-react";

export interface AdminDetailsViewProps {
  admin: AdminUserRecord;
}

export const AdminDetailsView: React.FC<AdminDetailsViewProps> = ({ admin: initialAdmin }) => {
  const [admin, setAdmin] = useState<AdminUserRecord>(initialAdmin);
  const [activeTab, setActiveTab] = useState("overview");

  // Modals
  const [activeModal, setActiveModal] = useState<
    "status" | "permissions" | "resources" | "scope" | null
  >(null);
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);
  const [tempResourcesText, setTempResourcesText] = useState("");
  const [tempScopeText, setTempScopeText] = useState("");

  const toggleStatus = () => {
    setAdmin((prev) => ({
      ...prev,
      status: prev.status === "Active" ? "Suspended" : "Active",
    }));
    setActiveModal(null);
  };

  const handleOpenPermissions = () => {
    setTempPermissions([...admin.permissions]);
    setActiveModal("permissions");
  };

  const handleSavePermissions = () => {
    setAdmin((prev) => ({ ...prev, permissions: tempPermissions }));
    setActiveModal(null);
  };

  const handleOpenResources = () => {
    setTempResourcesText(admin.assignedResources.join(", "));
    setActiveModal("resources");
  };

  const handleSaveResources = () => {
    const newResources = tempResourcesText
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    setAdmin((prev) => ({ ...prev, assignedResources: newResources }));
    setActiveModal(null);
  };

  const handleOpenScope = () => {
    setTempScopeText(admin.scope);
    setActiveModal("scope");
  };

  const handleSaveScope = () => {
    setAdmin((prev) => ({ ...prev, scope: tempScopeText }));
    setActiveModal(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Page Header */}
      <PageHeader
        title={admin.name}
        description={`Role: ${admin.role} • ID: ${admin.id} • Created ${admin.createdDate}`}
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Admins", href: "/super-admin/admins" },
          { label: admin.name },
        ]}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Badge variant={admin.status === "Active" ? "moss" : "destructive"} dot>
              {admin.status}
            </Badge>

            {admin.status === "Active" ? (
              <Button
                variant="destructive"
                size="sm"
                icon={<Ban className="w-4 h-4" />}
                onClick={() => setActiveModal("status")}
              >
                Suspend
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                icon={<UserCheck className="w-4 h-4" />}
                onClick={() => setActiveModal("status")}
              >
                Activate
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              icon={<Key className="w-4 h-4 text-[#C18C5D]" />}
              onClick={handleOpenPermissions}
            >
              Edit Permissions
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<Layers className="w-4 h-4 text-[#5D7052]" />}
              onClick={handleOpenResources}
            >
              Assign Resources
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<SlidersHorizontal className="w-4 h-4 text-[#78786C]" />}
              onClick={handleOpenScope}
            >
              Change Scope
            </Button>

            <Link href="/super-admin/admins">
              <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to List
              </Button>
            </Link>
          </div>
        }
      />

      {/* 8 Tab Navigation */}
      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "permissions", label: `Permissions (${admin.permissions.length})` },
          { id: "resources", label: `Resources (${admin.assignedResources.length})` },
          { id: "scope", label: "Scope" },
          { id: "activity", label: `Activity (${admin.activityLogs.length})` },
          { id: "requests", label: `Requests (${admin.requestsSubmitted.length})` },
          { id: "approvalHistory", label: "Approval History" },
          { id: "securityEvents", label: `Security Events (${admin.securityEvents.length})` },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-[#78786C] block">Full Name</span>
                <span className="font-bold text-sm text-[#2C2C24]">{admin.name}</span>
              </div>
              <div>
                <span className="text-[#78786C] block">Email</span>
                <span className="font-mono text-[#5D7052]">{admin.email}</span>
              </div>
              <div>
                <span className="text-[#78786C] block">Assigned Role</span>
                <span className="font-semibold text-[#2C2C24]">{admin.role}</span>
              </div>
              <div>
                <span className="text-[#78786C] block">Department</span>
                <span className="font-semibold text-[#2C2C24]">{admin.overview.department}</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-[#78786C] block">MFA Status</span>
                <Badge variant={admin.overview.mfaEnabled ? "moss" : "destructive"}>
                  {admin.overview.mfaEnabled ? "Enforced & Active" : "Disabled"}
                </Badge>
              </div>
              <div>
                <span className="text-[#78786C] block">IP Access Restriction</span>
                <span className="font-mono text-[#5D7052]">{admin.overview.ipRestriction}</span>
              </div>
              <div>
                <span className="text-[#78786C] block">Last Active</span>
                <span className="font-semibold text-[#2C2C24]">{admin.lastActive}</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle>Scope Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-[#78786C] block">Current Scope</span>
                <span className="font-bold text-sm text-[#C18C5D]">{admin.scope}</span>
              </div>
              <div>
                <span className="text-[#78786C] block">Total Permissions</span>
                <span className="font-mono font-bold text-[#5D7052]">{admin.permissions.length} Active Scopes</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Permissions */}
      {activeTab === "permissions" && (
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assigned Permissions</CardTitle>
              <Button variant="outline" size="sm" onClick={handleOpenPermissions}>
                Modify Permissions
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {admin.permissions.map((p) => (
              <div key={p} className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF] flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#2C2C24]">{p}</span>
                <Badge variant="moss" size="sm">Granted</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Resources */}
      {activeTab === "resources" && (
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assigned Resources</CardTitle>
              <Button variant="outline" size="sm" onClick={handleOpenResources}>
                Assign Resources
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {admin.assignedResources.map((res, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-[#DED8CF] flex items-center justify-between text-xs">
                <span className="font-bold text-[#2C2C24]">{res}</span>
                <Badge variant="sand" size="sm">Active Resource</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Scope */}
      {activeTab === "scope" && (
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Administrative Scope Isolation</CardTitle>
              <Button variant="outline" size="sm" onClick={handleOpenScope}>
                Change Scope
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#E6DCCD]/40 border border-[#DED8CF]">
              <p className="text-[#78786C] font-bold uppercase">Current Scope</p>
              <p className="font-heading text-xl font-bold text-[#2C2C24] mt-1">{admin.scope}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: Activity */}
      {activeTab === "activity" && (
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle>Admin Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {admin.activityLogs.map((log, i) => (
              <div key={i} className="p-3.5 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C2C24]">{log.action}</p>
                  <p className="text-[10px] text-[#78786C] font-mono">Resource: {log.targetResource} • {log.timestamp}</p>
                </div>
                <Badge variant="moss" size="sm">{log.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 6: Requests */}
      {activeTab === "requests" && (
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle>Submitted Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {admin.requestsSubmitted.length === 0 ? (
              <p className="text-[#78786C]">No submitted requests found.</p>
            ) : (
              admin.requestsSubmitted.map((req) => (
                <div key={req.id} className="p-3.5 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#2C2C24]">{req.type}</p>
                    <p className="text-[10px] text-[#78786C] font-mono">{req.id} • {req.date}</p>
                  </div>
                  <Badge variant="moss" size="sm">{req.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 7: Approval History */}
      {activeTab === "approvalHistory" && (
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle>Approval Decision History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {admin.approvalHistory.length === 0 ? (
              <p className="text-[#78786C]">No approval decisions recorded.</p>
            ) : (
              admin.approvalHistory.map((app) => (
                <div key={app.id} className="p-3.5 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#2C2C24]">{app.action}</p>
                    <p className="text-[10px] text-[#78786C] font-mono">{app.id} • Decided on {app.decidedDate}</p>
                  </div>
                  <Badge variant="moss" size="sm">{app.decision}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 8: Security Events */}
      {activeTab === "securityEvents" && (
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle>Security Events & MFA Audits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {admin.securityEvents.length === 0 ? (
              <p className="text-[#78786C]">No security incidents logged.</p>
            ) : (
              admin.securityEvents.map((sec) => (
                <div key={sec.id} className="p-3.5 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#2C2C24]">{sec.event}</p>
                    <p className="text-[10px] text-[#78786C] font-mono">{sec.id} • {sec.timestamp}</p>
                  </div>
                  <Badge variant={sec.severity === "High" ? "destructive" : "moss"} size="sm">
                    {sec.severity} Severity
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Modal */}
      <Modal
        isOpen={activeModal === "status"}
        onClose={() => setActiveModal(null)}
        title={`Confirm Status Toggle`}
        description={`Are you sure you want to toggle status for "${admin.name}"?`}
        footer={
          <>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={toggleStatus}>Confirm</Button>
          </>
        }
      >
        <p className="text-xs text-[#78786C] py-2">Toggles status in local mock state.</p>
      </Modal>

      {/* Edit Permissions Modal */}
      <Modal
        isOpen={activeModal === "permissions"}
        onClose={() => setActiveModal(null)}
        title={`Edit Permissions`}
        description="Select permissions to grant locally."
        footer={
          <>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSavePermissions}>Save</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2 max-h-72 overflow-y-auto text-xs">
          {ALL_AVAILABLE_PERMISSIONS.map((p) => {
            const isChecked = tempPermissions.includes(p);
            return (
              <button
                key={p}
                onClick={() =>
                  setTempPermissions((prev) =>
                    prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
                  )
                }
                className={`p-3 rounded-2xl border flex items-center justify-between font-mono ${
                  isChecked ? "bg-[#5D7052]/10 border-[#5D7052] text-[#2C2C24]" : "bg-[#F0EBE5]/40 border-[#DED8CF] text-[#78786C]"
                }`}
              >
                <span>{p}</span>
                {isChecked && <Check className="w-4 h-4 text-[#5D7052]" />}
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Assign Resources Modal */}
      <Modal
        isOpen={activeModal === "resources"}
        onClose={() => setActiveModal(null)}
        title="Assign Resources"
        description="Comma-separated list of resources."
        footer={
          <>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveResources}>Save</Button>
          </>
        }
      >
        <div className="py-2">
          <Input
            label="Resources"
            value={tempResourcesText}
            onChange={(e) => setTempResourcesText(e.target.value)}
          />
        </div>
      </Modal>

      {/* Change Scope Modal */}
      <Modal
        isOpen={activeModal === "scope"}
        onClose={() => setActiveModal(null)}
        title="Change Scope"
        description="Set scope string."
        footer={
          <>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveScope}>Save</Button>
          </>
        }
      >
        <div className="py-2">
          <Input
            label="Scope"
            value={tempScopeText}
            onChange={(e) => setTempScopeText(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
