"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminUserRecord, MOCK_ADMIN_RECORDS, ALL_AVAILABLE_PERMISSIONS } from "@/lib/adminData";
import {
  PageHeader,
  Button,
  Badge,
  Card,
  DataTable,
  Modal,
  Input,
  Select,
} from "@/components";
import { Column } from "@/types";
import {
  Search,
  UserCheck,
  Ban,
  UserX,
  Key,
  Layers,
  SlidersHorizontal,
  Eye,
  Plus,
  ShieldAlert,
  Check,
} from "lucide-react";

export default function AdminsListPage() {
  const [admins, setAdmins] = useState<AdminUserRecord[]>(MOCK_ADMIN_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State Management
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUserRecord | null>(null);
  const [activeModal, setActiveModal] = useState<
    "status" | "permissions" | "resources" | "scope" | null
  >(null);
  const [statusTargetAction, setStatusTargetAction] = useState<"Activate" | "Suspend" | "Deactivate">("Suspend");

  // Temporary Edit States inside Modals
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);
  const [tempResourcesText, setTempResourcesText] = useState("");
  const [tempScopeText, setTempScopeText] = useState("");

  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.scope.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status Action Handler
  const handleOpenStatusModal = (admin: AdminUserRecord, action: "Activate" | "Suspend" | "Deactivate") => {
    setSelectedAdmin(admin);
    setStatusTargetAction(action);
    setActiveModal("status");
  };

  const handleConfirmStatusChange = () => {
    if (!selectedAdmin) return;
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === selectedAdmin.id
          ? {
              ...a,
              status:
                statusTargetAction === "Activate"
                  ? "Active"
                  : statusTargetAction === "Suspend"
                  ? "Suspended"
                  : "Deactivated",
            }
          : a
      )
    );
    setActiveModal(null);
  };

  // Edit Permissions Modal Handler
  const handleOpenPermissionsModal = (admin: AdminUserRecord) => {
    setSelectedAdmin(admin);
    setTempPermissions([...admin.permissions]);
    setActiveModal("permissions");
  };

  const handleSavePermissions = () => {
    if (!selectedAdmin) return;
    setAdmins((prev) =>
      prev.map((a) => (a.id === selectedAdmin.id ? { ...a, permissions: tempPermissions } : a))
    );
    setActiveModal(null);
  };

  // Assign Resources Modal Handler
  const handleOpenResourcesModal = (admin: AdminUserRecord) => {
    setSelectedAdmin(admin);
    setTempResourcesText(admin.assignedResources.join(", "));
    setActiveModal("resources");
  };

  const handleSaveResources = () => {
    if (!selectedAdmin) return;
    const newResources = tempResourcesText
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    setAdmins((prev) =>
      prev.map((a) => (a.id === selectedAdmin.id ? { ...a, assignedResources: newResources } : a))
    );
    setActiveModal(null);
  };

  // Change Scope Modal Handler
  const handleOpenScopeModal = (admin: AdminUserRecord) => {
    setSelectedAdmin(admin);
    setTempScopeText(admin.scope);
    setActiveModal("scope");
  };

  const handleSaveScope = () => {
    if (!selectedAdmin) return;
    setAdmins((prev) =>
      prev.map((a) => (a.id === selectedAdmin.id ? { ...a, scope: tempScopeText } : a))
    );
    setActiveModal(null);
  };

  const columns: Column<AdminUserRecord>[] = [
    {
      key: "admin",
      header: "Admin User",
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {a.avatar || a.name.charAt(0)}
          </div>
          <div>
            <Link href={`/super-admin/admins/${a.id}`} className="font-bold text-xs text-[#2C2C24] hover:text-[#5D7052]">
              {a.name}
            </Link>
            <p className="text-[11px] text-[#78786C] font-mono">{a.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (a) => <Badge variant="sand" size="sm">{a.role}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (a) => (
        <Badge variant={a.status === "Active" ? "moss" : "destructive"} dot size="sm">
          {a.status}
        </Badge>
      ),
    },
    {
      key: "scope",
      header: "Scope",
      render: (a) => <span className="text-xs font-semibold text-[#5D7052]">{a.scope}</span>,
    },
    {
      key: "permissions",
      header: "Permissions",
      render: (a) => (
        <span className="text-xs font-mono font-bold text-[#C18C5D]">
          {a.permissions.length} Scopes
        </span>
      ),
    },
    {
      key: "assignedResources",
      header: "Assigned Resources",
      render: (a) => (
        <div className="text-xs text-[#78786C] max-w-xs truncate">
          {a.assignedResources.join(" • ")}
        </div>
      ),
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (a) => <span className="text-xs text-[#78786C]">{a.lastActive}</span>,
    },
    {
      key: "created",
      header: "Created",
      render: (a) => <span className="text-xs font-mono text-[#78786C]">{a.createdDate}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (a) => (
        <div className="flex items-center gap-1">
          <Link href={`/super-admin/admins/${a.id}`}>
            <Button variant="ghost" size="sm" className="p-1.5 rounded-full hover:bg-[#E6DCCD]" title="View Detail">
              <Eye className="w-4 h-4 text-[#5D7052]" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-full hover:bg-[#F0EBE5]"
            onClick={() => handleOpenPermissionsModal(a)}
            title="Edit Permissions"
          >
            <Key className="w-4 h-4 text-[#C18C5D]" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-full hover:bg-[#F0EBE5]"
            onClick={() => handleOpenResourcesModal(a)}
            title="Assign Resources"
          >
            <Layers className="w-4 h-4 text-[#5D7052]" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-full hover:bg-[#F0EBE5]"
            onClick={() => handleOpenScopeModal(a)}
            title="Change Scope"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#78786C]" />
          </Button>

          {a.status === "Active" ? (
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 rounded-full hover:bg-[#A85448]/10"
              onClick={() => handleOpenStatusModal(a, "Suspend")}
              title="Suspend Admin"
            >
              <Ban className="w-4 h-4 text-[#A85448]" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 rounded-full hover:bg-[#5D7052]/10"
              onClick={() => handleOpenStatusModal(a, "Activate")}
              title="Activate Admin"
            >
              <UserCheck className="w-4 h-4 text-[#5D7052]" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title="Admin Management"
        description="Root administrator accounts, privilege matrix, resource assignment, and scope isolation controls."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Admins" },
        ]}
      />

      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search admins by name, email, role, or scope..."
          className="w-full bg-white border border-[#DED8CF] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052] transition-all"
        />
      </div>

      <DataTable columns={columns} data={filteredAdmins} keyExtractor={(a) => a.id} />

      {/* Modal 1: Status Confirmation */}
      <Modal
        isOpen={activeModal === "status"}
        onClose={() => setActiveModal(null)}
        title={`Confirm ${statusTargetAction}`}
        description={`Are you sure you want to ${statusTargetAction.toLowerCase()} admin account "${selectedAdmin?.name}"?`}
        footer={
          <>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button
              variant={statusTargetAction === "Activate" ? "primary" : "destructive"}
              onClick={handleConfirmStatusChange}
            >
              Confirm {statusTargetAction}
            </Button>
          </>
        }
      >
        <p className="text-xs text-[#78786C] py-2">
          Modifying status updates local mock state immediately for testing frontend user flows.
        </p>
      </Modal>

      {/* Modal 2: Edit Permissions */}
      <Modal
        isOpen={activeModal === "permissions"}
        onClose={() => setActiveModal(null)}
        title={`Edit Permissions (${selectedAdmin?.name})`}
        description="Toggle authorized permission scopes for this admin account."
        footer={
          <>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSavePermissions}>Save Permissions</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2 max-h-72 overflow-y-auto">
          {ALL_AVAILABLE_PERMISSIONS.map((perm) => {
            const isChecked = tempPermissions.includes(perm);
            return (
              <button
                key={perm}
                onClick={() =>
                  setTempPermissions((prev) =>
                    prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
                  )
                }
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold text-left cursor-pointer transition-colors ${
                  isChecked
                    ? "bg-[#5D7052]/10 border-[#5D7052] text-[#2C2C24]"
                    : "bg-[#F0EBE5]/40 border-[#DED8CF] text-[#78786C]"
                }`}
              >
                <span className="font-mono text-[11px]">{perm}</span>
                {isChecked && <Check className="w-4 h-4 text-[#5D7052]" />}
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Modal 3: Assign Resources */}
      <Modal
        isOpen={activeModal === "resources"}
        onClose={() => setActiveModal(null)}
        title={`Assign Resources (${selectedAdmin?.name})`}
        description="Comma-separated list of fleet, driver pool, or audit resources."
        footer={
          <>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveResources}>Save Resources</Button>
          </>
        }
      >
        <div className="py-2">
          <Input
            label="Resource Assignments"
            value={tempResourcesText}
            onChange={(e) => setTempResourcesText(e.target.value)}
            placeholder="e.g. Berlin Express Fleet, Mitte Driver Pool"
          />
        </div>
      </Modal>

      {/* Modal 4: Change Scope */}
      <Modal
        isOpen={activeModal === "scope"}
        onClose={() => setActiveModal(null)}
        title={`Change Scope (${selectedAdmin?.name})`}
        description="Define geographic or departmental isolation scope."
        footer={
          <>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveScope}>Save Scope</Button>
          </>
        }
      >
        <div className="py-2">
          <Input
            label="Administrative Scope"
            value={tempScopeText}
            onChange={(e) => setTempScopeText(e.target.value)}
            placeholder="e.g. Munich & Bavaria Scope"
          />
        </div>
      </Modal>
    </div>
  );
}
