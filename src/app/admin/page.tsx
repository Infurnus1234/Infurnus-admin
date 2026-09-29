"use client";

import React from "react";
import Link from "next/link";
import {
  MOCK_LOGGED_IN_ADMIN,
  can,
  hasResource,
  canAccessModule,
} from "@/lib/permissionUtil";
import {
  PageHeader,
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  DataTable,
  OrganicAreaChart,
} from "@/components";
import { Column } from "@/types";
import {
  Car,
  Users,
  Layers,
  MapPin,
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  Bell,
  BarChart3,
  FileText,
} from "lucide-react";

interface AdminVehicleMock {
  id: string;
  plate: string;
  model: string;
  type: string;
  driver: string;
  status: string;
}

interface AdminDriverMock {
  id: string;
  name: string;
  rating: number;
  tripsToday: number;
  status: string;
}

const MOCK_ASSIGNED_VEHICLES: AdminVehicleMock[] = [
  { id: "VEH-1", plate: "B-IN 4022", model: "Tesla Model 3", type: "EV Sedan", driver: "Hans Gruber", status: "Active" },
  { id: "VEH-2", plate: "B-IN 4023", model: "Tesla Model Y", type: "EV SUV", driver: "Viktor Petrov", status: "Active" },
  { id: "VEH-3", plate: "B-IN 4024", model: "Volkswagen Passat", type: "Standard Sedan", driver: "Astrid Lindgren", status: "Maintenance" },
  { id: "VEH-4", plate: "B-IN 4025", model: "BMW i4 EV", type: "EV Sedan", driver: "Unassigned", status: "Available" },
  { id: "VEH-5", plate: "B-IN 4026", model: "Toyota RAV4 Hybrid", type: "Hybrid SUV", driver: "Stefan Meyer", status: "Active" },
];

const MOCK_ASSIGNED_DRIVERS: AdminDriverMock[] = [
  { id: "DRV-1001", name: "Hans Gruber", rating: 4.9, tripsToday: 8, status: "On Trip" },
  { id: "DRV-1002", name: "Viktor Petrov", rating: 4.8, tripsToday: 6, status: "Active" },
  { id: "DRV-1003", name: "Stefan Meyer", rating: 4.7, tripsToday: 5, status: "Active" },
];

export default function AdminDashboardPage() {
  const adminUser = MOCK_LOGGED_IN_ADMIN;
  const userPerms = adminUser.permissions;
  const userRes = adminUser.resources;

  const vehicleColumns: Column<AdminVehicleMock>[] = [
    { key: "plate", header: "Plate Number", render: (v) => <span className="font-bold font-mono text-xs text-[#2C2C24]">{v.plate}</span> },
    { key: "model", header: "Vehicle Model", render: (v) => <span className="text-xs font-semibold text-[#5D7052]">{v.model} ({v.type})</span> },
    { key: "driver", header: "Assigned Driver", render: (v) => <span className="text-xs font-medium text-[#2C2C24]">{v.driver}</span> },
    { key: "status", header: "Status", render: (v) => <Badge variant={v.status === "Active" ? "moss" : v.status === "Available" ? "sand" : "terracotta"} size="sm">{v.status}</Badge> },
  ];

  const driverColumns: Column<AdminDriverMock>[] = [
    { key: "name", header: "Driver Name", render: (d) => <span className="font-bold text-xs text-[#2C2C24]">{d.name}</span> },
    { key: "rating", header: "Rating", render: (d) => <span className="font-bold text-xs text-[#5D7052]">★ {d.rating}</span> },
    { key: "tripsToday", header: "Trips Today", render: (d) => <span className="font-mono text-xs text-[#2C2C24]">{d.tripsToday} dispatches</span> },
    { key: "status", header: "Status", render: (d) => <Badge variant={d.status === "Active" || d.status === "On Trip" ? "moss" : "muted"} size="sm">{d.status}</Badge> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <PageHeader
        title="Admin Console (Fleet A Scope)"
        description={`Permission-scoped application shell for ${adminUser.name} (${adminUser.role}). Rendered structurally via can(), hasResource() and canAccessModule().`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Overview" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="moss" size="md">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
              {userPerms.length} Active Permissions
            </Badge>
          </div>
        }
      />

      {/* Permission Scope Banner */}
      <Card variant="sand" rounded="3xl" padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-[#2C2C24]">Assigned Permissions:</p>
            <div className="flex flex-wrap gap-1.5">
              {userPerms.map((p) => (
                <span key={p} className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5D7052] text-white">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="font-bold text-[#2C2C24]">Assigned Resources:</p>
            <p className="text-[#C18C5D] font-bold font-mono">Fleet A (Berlin Express) • Vehicles 1-5</p>
          </div>
        </div>
      </Card>

      {/* 1. Assigned Vehicles, 2. Assigned Drivers, 3. Assigned Fleet, 4. Active Rides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {can("VIEW_VEHICLES") && hasResource("Vehicle") && (
          <StatCard
            title="Assigned Vehicles"
            value="5 Vehicles"
            trend={{ value: "Vehicles 1-5", isPositive: true }}
            subtitle="Fleet A Scope"
            icon={<Car className="w-5 h-5" />}
          />
        )}

        {can("VIEW_DRIVERS") && hasResource("Driver") && (
          <StatCard
            title="Assigned Drivers"
            value="3 Drivers"
            trend={{ value: "100% Active", isPositive: true }}
            subtitle="Fleet A Scope"
            icon={<Users className="w-5 h-5" />}
          />
        )}

        {canAccessModule("vehicles") && hasResource("Fleet A") && (
          <StatCard
            title="Assigned Fleet"
            value="Fleet A"
            trend={{ value: "Berlin Express", isPositive: true }}
            subtitle="Regional Division"
            icon={<Layers className="w-5 h-5" />}
          />
        )}

        {can("VIEW_RIDES") && (
          <StatCard
            title="Active Rides"
            value="12 Dispatches"
            trend={{ value: "Live Dispatches", isPositive: true }}
            subtitle="Current active rides"
            icon={<MapPin className="w-5 h-5" />}
          />
        )}
      </div>

      {/* Main Grid: Data Tables for Assigned Vehicles & Assigned Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Assigned Vehicles */}
        {can("VIEW_VEHICLES") && (
          <Card variant="elevated" rounded="3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assigned Vehicles</CardTitle>
                <CardDescription>Vehicles 1-5 in Fleet A scope</CardDescription>
              </div>
              <Badge variant="moss" size="sm">VIEW_VEHICLES</Badge>
            </CardHeader>
            <CardContent>
              <DataTable columns={vehicleColumns} data={MOCK_ASSIGNED_VEHICLES} keyExtractor={(v) => v.id} />
            </CardContent>
          </Card>
        )}

        {/* Section 2: Assigned Drivers */}
        {can("VIEW_DRIVERS") && (
          <Card variant="elevated" rounded="3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assigned Drivers</CardTitle>
                <CardDescription>Drivers assigned to Fleet A</CardDescription>
              </div>
              <Badge variant="moss" size="sm">VIEW_DRIVERS</Badge>
            </CardHeader>
            <CardContent>
              <DataTable columns={driverColumns} data={MOCK_ASSIGNED_DRIVERS} keyExtractor={(d) => d.id} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* 5. Pending Requests & 11. Approval Requests */}
      {(can("VIEW_VEHICLES") || can("VIEW_DRIVERS")) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Regional driver & vehicle change requests pending review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#DED8CF] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C2C24]">Vehicle Swap Request (Hans Gruber)</p>
                  <p className="text-[10px] text-[#78786C]">REQ-V-901 • Submitted yesterday</p>
                </div>
                <Badge variant="terracotta" size="sm">Pending Review</Badge>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle>Approval Requests</CardTitle>
              <CardDescription>Approval tickets requiring action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#DED8CF] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C2C24]">Fleet A Shift Schedule Authorization</p>
                  <p className="text-[10px] text-[#78786C]">APP-FLT-12 • Regional Queue</p>
                </div>
                <Badge variant="moss" size="sm">Approved</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 6. Vehicle Operations, 7. Driver Operations, 8. Fleet Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {can("VIEW_VEHICLES") && (
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle>Vehicle Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                <p className="font-bold text-[#2C2C24]">Vehicle B-IN 4022 Keyless Lock Sync</p>
                <p className="text-[10px] text-[#78786C]">Operational • 15 mins ago</p>
              </div>
            </CardContent>
          </Card>
        )}

        {can("VIEW_DRIVERS") && (
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle>Driver Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                <p className="font-bold text-[#2C2C24]">Hans Gruber Shift Start Verified</p>
                <p className="text-[10px] text-[#78786C]">Active • 45 mins ago</p>
              </div>
            </CardContent>
          </Card>
        )}

        {canAccessModule("vehicles") && (
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle>Fleet Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded-2xl bg-[#E6DCCD]/40 border border-[#DED8CF]">
                <p className="font-bold text-[#2C2C24]">Fleet A Dispatch Rate 98.4%</p>
                <p className="text-[10px] text-[#78786C]">Optimal performance</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 9. Notifications & 10. Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {can("VIEW_RIDES") && (
          <Card variant="elevated" rounded="3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#C18C5D]" /> Notifications
              </CardTitle>
              <Badge variant="moss" size="sm">System Alerts</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-[#DED8CF]">
                <p className="font-bold text-[#2C2C24]">Peak Demand Alert in Berlin Mitte</p>
                <p className="text-[10px] text-[#78786C]">High dispatch density expected</p>
              </div>
            </CardContent>
          </Card>
        )}

        {can("VIEW_REPORTS") && (
          <Card variant="elevated" rounded="3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#5D7052]" /> Reports
              </CardTitle>
              <Badge variant="moss" size="sm">VIEW_REPORTS</Badge>
            </CardHeader>
            <CardContent>
              <OrganicAreaChart
                title="Fleet A Dispatches Report"
                subtitle="Dispatches for Vehicles 1-5"
                data={[
                  { label: "Mon", value: 120 },
                  { label: "Tue", value: 145 },
                  { label: "Wed", value: 132 },
                  { label: "Thu", value: 168 },
                  { label: "Fri", value: 195 },
                ]}
                color="moss"
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Omitted Modules Structural Enforcement Banner */}
      <Card variant="flat" rounded="3xl" padding="md">
        <div className="flex items-center gap-3 text-xs text-[#78786C]">
          <Lock className="w-4 h-4 text-[#A85448]" />
          <span>
            Payment Gateways, Platform Coupons, Security Settings, and Global User Control modules are structurally omitted because your profile lacks <span className="font-mono text-[#A85448]">VIEW_PAYMENTS</span>, <span className="font-mono text-[#A85448]">VIEW_COUPONS</span>, and <span className="font-mono text-[#A85448]">VIEW_SYSTEM_CONFIG</span> permissions.
          </span>
        </div>
      </Card>
    </div>
  );
}
