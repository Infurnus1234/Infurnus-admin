"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  OrganicAreaChart,
  OrganicBarChart,
  Modal,
  Input,
  Select,
  EmptyState,
  LoadingState,
  Tabs,
} from "@/components";
import {
  SUPER_ADMIN_METRICS,
  ADMINISTRATIVE_OVERVIEW_ITEMS,
  RECENT_ADMIN_ACTIVITIES,
  RECENT_SUPER_ADMIN_ACTIVITIES,
  DASHBOARD_CHARTS_DATA,
} from "@/lib/dashboardData";
import {
  UserPlus,
  CheckSquare,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Clock,
  UserCheck,
  Building2,
  Car,
  Activity,
  Filter,
} from "lucide-react";

export default function SuperAdminDashboardPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Quick Action Handlers
  const handleAddAdmin = () => setIsAddAdminModalOpen(true);

  // Filtered metrics for Platform Overview
  const allMetricItems = Object.values(SUPER_ADMIN_METRICS);
  const filteredMetrics =
    activeCategory === "all"
      ? allMetricItems
      : allMetricItems.filter((m) => m.category === activeCategory);

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-12">
      {/* 5. Quick Actions & Page Header */}
      <PageHeader
        title="Super Admin Dashboard"
        description="Global system governance, multi-tenant metric stream, administrative queues, and platform analytics."
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin" }, { label: "Overview" }]}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="primary"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={handleAddAdmin}
            >
              Add Admin
            </Button>
            <Link href="/super-admin/driver-requests">
              <Button variant="secondary" icon={<UserCheck className="w-4 h-4" />}>
                Review Driver Requests
              </Button>
            </Link>
            <Link href="/super-admin/approvals">
              <Button variant="outline" icon={<CheckSquare className="w-4 h-4" />}>
                Review Approvals
              </Button>
            </Link>
            <Link href="/super-admin/security">
              <Button variant="destructive" icon={<ShieldAlert className="w-4 h-4" />}>
                View Security Events
              </Button>
            </Link>
          </div>
        }
      />

      {/* 1. Platform Overview Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#2C2C24]">
              Platform Overview
            </h2>
            <p className="text-xs text-[#78786C] font-medium mt-0.5">
              Real-time monitoring across 20 global system indicators
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 600);
              }}
            >
              Sync Metrics
            </Button>

            {/* Category Filter Pill Bar */}
            <Tabs
              tabs={[
                { id: "all", label: "All (20)" },
                { id: "users", label: "Users" },
                { id: "drivers", label: "Drivers" },
                { id: "vehicles", label: "Vehicles" },
                { id: "rides", label: "Rides" },
                { id: "business", label: "Business" },
              ]}
              activeTab={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingState label="Refreshing 20 platform overview metrics..." />
        ) : filteredMetrics.length === 0 ? (
          <EmptyState
            title="No Metrics Found"
            description="No metrics match the selected filter category."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMetrics.map((metric) => (
              <StatCard
                key={metric.id}
                title={metric.label}
                value={metric.value}
                trend={
                  metric.change
                    ? { value: metric.change, isPositive: metric.isPositive !== false }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Administrative Overview Section */}
      <section className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#2C2C24]">
            Administrative Overview
          </h2>
          <p className="text-xs text-[#78786C] font-medium mt-0.5">
            Dedicated queue monitoring for approvals, requests, and governance events
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ADMINISTRATIVE_OVERVIEW_ITEMS.map((item) => (
            <Link key={item.id} href={item.href} className="group">
              <Card
                variant="elevated"
                rounded="2xl"
                padding="md"
                className="h-full hover:border-[#5D7052] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-heading text-3xl font-extrabold text-[#2C2C24] group-hover:text-[#5D7052] transition-colors">
                    {item.count}
                  </span>
                  <Badge variant={item.badgeVariant} size="sm">
                    {item.badgeText}
                  </Badge>
                </div>
                <h3 className="font-bold text-sm text-[#2C2C24] mt-3">{item.title}</h3>
                <p className="text-xs text-[#78786C] mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-4 pt-3 border-t border-[#DED8CF]/60 flex items-center justify-between text-xs font-bold text-[#5D7052]">
                  <span>Review Queue</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Charts Section */}
      <section className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#2C2C24]">
            Platform Analytics & Growth
          </h2>
          <p className="text-xs text-[#78786C] font-medium mt-0.5">
            Ride volume, revenue performance, and acquisition curves
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="elevated" rounded="3xl">
            <CardContent>
              <OrganicAreaChart
                title="Ride Volume Trends"
                subtitle="Weekly ride dispatches across all fleets"
                data={DASHBOARD_CHARTS_DATA.rideVolume}
                color="moss"
              />
            </CardContent>
          </Card>

          <Card variant="elevated" rounded="3xl">
            <CardContent>
              <OrganicAreaChart
                title="Revenue Trajectory (MTD)"
                subtitle="Monthly platform revenue in USD"
                data={DASHBOARD_CHARTS_DATA.revenue}
                color="terracotta"
              />
            </CardContent>
          </Card>

          <Card variant="elevated" rounded="3xl">
            <CardContent>
              <OrganicBarChart
                title="Driver Growth"
                subtitle="Active verified driver acquisition per quarter"
                data={DASHBOARD_CHARTS_DATA.driverGrowth}
                color="moss"
              />
            </CardContent>
          </Card>

          <Card variant="elevated" rounded="3xl">
            <CardContent>
              <OrganicBarChart
                title="User Growth"
                subtitle="Total registered user baseline growth"
                data={DASHBOARD_CHARTS_DATA.userGrowth}
                color="terracotta"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Recent Activity Feeds */}
      <section className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-[#2C2C24]">
            Recent System Activity
          </h2>
          <p className="text-xs text-[#78786C] font-medium mt-0.5">
            Audit feeds for Admin and Super Admin operations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Admin Activity Feed */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Admin Activity</CardTitle>
                  <CardDescription>Regional admin operational logs</CardDescription>
                </div>
                <Badge variant="moss" size="sm">
                  Live Feed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {RECENT_ADMIN_ACTIVITIES.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]/60 hover:bg-[#F0EBE5] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#2C2C24]">
                        {act.actor.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E6DCCD] text-[#78786C]">
                        {act.actor.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#2C2C24] font-medium">{act.action}</p>
                    <p className="text-[11px] text-[#78786C] font-mono">{act.resource}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <Badge
                      variant={
                        act.status === "Completed"
                          ? "moss"
                          : act.status === "Pending"
                          ? "terracotta"
                          : "destructive"
                      }
                      size="sm"
                    >
                      {act.status}
                    </Badge>
                    <p className="text-[10px] text-[#78786C] flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" /> {act.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Super Admin Activity Feed */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Super Admin Activity</CardTitle>
                  <CardDescription>Global policy & security audit trail</CardDescription>
                </div>
                <Badge variant="terracotta" size="sm">
                  Root Governance
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {RECENT_SUPER_ADMIN_ACTIVITIES.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#E6DCCD]/30 border border-[#DED8CF]/60 hover:bg-[#E6DCCD]/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#2C2C24]">
                        {act.actor.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5D7052] text-white">
                        {act.actor.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#2C2C24] font-medium">{act.action}</p>
                    <p className="text-[11px] text-[#78786C] font-mono">{act.resource}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <Badge
                      variant={
                        act.status === "Completed"
                          ? "moss"
                          : act.status === "Flagged"
                          ? "destructive"
                          : "sand"
                      }
                      size="sm"
                    >
                      {act.status}
                    </Badge>
                    <p className="text-[10px] text-[#78786C] flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" /> {act.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Add Admin Quick Action Modal */}
      <Modal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        title="Provision Super Admin"
        description="Grant root administrative credentials and system scope to a new user."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddAdminModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsAddAdminModalOpen(false)}>
              Create Super Admin
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Input label="Full Name" placeholder="e.g. Eleanor Vance" />
          <Input label="Official Email" placeholder="vance@infurnus.org" />
          <Select
            label="Assigned Governance Scope"
            options={[
              { label: "Global Platform Scope (Full)", value: "global" },
              { label: "Security & Compliance Only", value: "sec" },
              { label: "Finance & Audit Only", value: "fin" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
