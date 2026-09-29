"use me";
"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  MOCK_REPORTS_DATA
} from "@/lib/supportReportsData";
import {
  Users,
  Car,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("This Month (Sep 2026)");
  const [selectedSection, setSelectedSection] = useState<
    "user" | "driver" | "vehicle" | "ride" | "business" | "admin"
  >("user");

  const data = MOCK_REPORTS_DATA;

  const renderBarChart = (
    items: { label: string; value: number }[],
    color: "moss" | "terracotta" | "sand" = "moss",
    formatSuffix: string = ""
  ) => {
    const maxValue = Math.max(...items.map((i) => i.value), 1);
    const colorClasses = {
      moss: "bg-moss-600 hover:bg-moss-700",
      terracotta: "bg-terracotta-600 hover:bg-terracotta-700",
      sand: "bg-sand-700 hover:bg-sand-800"
    };

    return (
      <div className="space-y-3 pt-2">
        <div className="flex items-end gap-3 h-44 border-b border-sand-200 pb-2 px-2">
          {items.map((item, idx) => {
            const heightPercent = Math.round((item.value / maxValue) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-bold text-sand-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1.5 py-0.5 rounded shadow-sm border border-sand-200">
                  {item.value.toLocaleString()}{formatSuffix}
                </div>
                <div
                  style={{ height: `${Math.max(heightPercent, 8)}%` }}
                  className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${colorClasses[color]}`}
                />
                <span className="text-[11px] font-semibold text-sand-600 truncate max-w-full">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProgressList = (
    items: { label: string; value: number }[],
    totalLabel: string = "%"
  ) => {
    return (
      <div className="space-y-3 pt-2">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-sand-800">
              <span>{item.label}</span>
              <span>{item.value}{totalLabel}</span>
            </div>
            <div className="w-full bg-sand-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-moss-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(item.value, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title="Executive Analytics & Custom Reports"
        description="Comprehensive platform telemetry across Users, Drivers, Fleets, Rides, Revenue & Admin Security"
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Reports & Analytics" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-sand-300 rounded-xl px-3 py-1.5 shadow-sm text-xs font-semibold text-sand-800">
              <Calendar className="w-4 h-4 text-sand-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="This Month (Sep 2026)">This Month (Sep 2026)</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Q3 2026">Q3 2026</option>
                <option value="Year to Date">Year to Date</option>
              </select>
            </div>

            <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />}>
              Export PDF/CSV
            </Button>
          </div>
        }
      />

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sand-200">
          {[
            { id: "user", label: "User Analytics", icon: <Users className="w-4 h-4" /> },
            { id: "driver", label: "Driver Analytics", icon: <Activity className="w-4 h-4" /> },
            { id: "vehicle", label: "Vehicle Analytics", icon: <Car className="w-4 h-4" /> },
            { id: "ride", label: "Ride Analytics", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "business", label: "Business Analytics", icon: <DollarSign className="w-4 h-4" /> },
            { id: "admin", label: "Administrative Analytics", icon: <ShieldCheck className="w-4 h-4" /> }
          ].map((tab) => {
            const isActive = selectedSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSection(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-moss-700 text-white shadow-moss"
                    : "bg-white text-sand-700 border border-sand-200 hover:bg-sand-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SECTION 1: USER ANALYTICS */}
        {selectedSection === "user" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Registered Users"
                value={data.userAnalytics.totalUsers}
                icon={<Users className="w-5 h-5 text-moss-600" />}
                trend={{ value: "14.2%", isPositive: true }}
              />
              <StatCard
                title="Monthly Active Users (MAU)"
                value={data.userAnalytics.activeUsersMonthly}
                icon={<Activity className="w-5 h-5 text-moss-600" />}
                subtitle="65.9% of total base active"
              />
              <StatCard
                title="User Retention Rate"
                value={data.userAnalytics.retentionRate}
                icon={<CheckCircle2 className="w-5 h-5 text-moss-600" />}
                trend={{ value: "3.1%", isPositive: true }}
              />
              <StatCard
                title="Avg Rides Per User"
                value={data.userAnalytics.avgRidesPerUser}
                icon={<TrendingUp className="w-5 h-5 text-moss-600" />}
                subtitle="Repeat rides per active user"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">User Registrations Trend</h3>
                    <p className="text-xs text-sand-600">Monthly new user onboarding velocity</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-moss-600" />
                </div>
                {renderBarChart(data.userAnalytics.registrationsTimeline, "moss")}
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Active Users Progression</h3>
                    <p className="text-xs text-sand-600">Weekly active user engagement metrics</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-terracotta-600" />
                </div>
                {renderBarChart(data.userAnalytics.activeUsersTrend, "terracotta")}
              </Card>
            </div>
          </div>
        )}

        {/* SECTION 2: DRIVER ANALYTICS */}
        {selectedSection === "driver" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Onboarded Drivers"
                value={data.driverAnalytics.totalDrivers}
                icon={<Users className="w-5 h-5 text-moss-600" />}
                trend={{ value: "8.5%", isPositive: true }}
              />
              <StatCard
                title="Drivers Online (Current Peak)"
                value={data.driverAnalytics.activeDriversOnline}
                icon={<Activity className="w-5 h-5 text-moss-600" />}
                subtitle="69.7% of total drivers active"
              />
              <StatCard
                title="Avg Online Duty Hours"
                value={data.driverAnalytics.avgOnlineHours}
                icon={<Calendar className="w-5 h-5 text-moss-600" />}
                subtitle="Optimal shift duration"
              />
              <StatCard
                title="Monthly Churn / Turnover"
                value={data.driverAnalytics.driverTurnover}
                icon={<AlertCircle className="w-5 h-5 text-terracotta-600" />}
                trend={{ value: "0.4%", isPositive: true }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Driver Supply Growth</h3>
                    <p className="text-xs text-sand-600">Total verified driver fleet expansion</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-moss-600" />
                </div>
                {renderBarChart(data.driverAnalytics.driverCountTrend, "moss")}
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Driver Activity Distribution</h3>
                    <p className="text-xs text-sand-600">Breakdown of online hours utilization</p>
                  </div>
                  <PieChart className="w-5 h-5 text-moss-600" />
                </div>
                {renderProgressList(data.driverAnalytics.driverActivityBreakdown, "%")}
              </Card>
            </div>
          </div>
        )}

        {/* SECTION 3: VEHICLE ANALYTICS */}
        {selectedSection === "vehicle" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Vehicles Enrolled"
                value={data.vehicleAnalytics.totalVehicles}
                icon={<Car className="w-5 h-5 text-moss-600" />}
              />
              <StatCard
                title="EV Green Fleet Share"
                value={data.vehicleAnalytics.evPercentage}
                icon={<CheckCircle2 className="w-5 h-5 text-moss-600" />}
                subtitle="Electric vehicles ratio"
              />
              <StatCard
                title="Fleet Utilization Rate"
                value={data.vehicleAnalytics.utilizationRate}
                icon={<TrendingUp className="w-5 h-5 text-moss-600" />}
                trend={{ value: "4.2%", isPositive: true }}
              />
              <StatCard
                title="Avg Maintenance Cost"
                value={data.vehicleAnalytics.avgMaintenanceCost}
                icon={<DollarSign className="w-5 h-5 text-sand-700" />}
                subtitle="Per vehicle per month"
              />
            </div>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif text-sand-900">Daily Vehicle Utilization %</h3>
                  <p className="text-xs text-sand-600">7-day active shift deployment matrix</p>
                </div>
                <BarChart3 className="w-5 h-5 text-moss-600" />
              </div>
              {renderBarChart(data.vehicleAnalytics.vehicleUtilizationTrend, "moss", "%")}
            </Card>
          </div>
        )}

        {/* SECTION 4: RIDE ANALYTICS */}
        {selectedSection === "ride" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Completed Rides"
                value={data.rideAnalytics.totalRides}
                icon={<TrendingUp className="w-5 h-5 text-moss-600" />}
                trend={{ value: "16.8%", isPositive: true }}
              />
              <StatCard
                title="Fulfillment Completion %"
                value={data.rideAnalytics.completionRate}
                icon={<CheckCircle2 className="w-5 h-5 text-moss-600" />}
                subtitle="SLA Target: 92%"
              />
              <StatCard
                title="Overall Cancellation %"
                value={data.rideAnalytics.cancellationRate}
                icon={<AlertCircle className="w-5 h-5 text-terracotta-600" />}
                subtitle="Combined user & driver cancels"
              />
              <StatCard
                title="Avg Ride Distance"
                value={data.rideAnalytics.avgRideDistance}
                icon={<Car className="w-5 h-5 text-sand-700" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Ride Volume Timeline</h3>
                    <p className="text-xs text-sand-600">Total trip dispatch count trend</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-moss-600" />
                </div>
                {renderBarChart(data.rideAnalytics.rideVolumeTrend, "moss")}
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Completion vs Cancellation Breakdown</h3>
                    <p className="text-xs text-sand-600">Fulfillment analysis</p>
                  </div>
                  <PieChart className="w-5 h-5 text-moss-600" />
                </div>
                {renderProgressList(data.rideAnalytics.completionVsCancellation, "%")}
              </Card>
            </div>
          </div>
        )}

        {/* SECTION 5: BUSINESS ANALYTICS */}
        {selectedSection === "business" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Gross Merchandise Value (GMV)"
                value={data.businessAnalytics.grossMerchandiseValue}
                icon={<DollarSign className="w-5 h-5 text-moss-600" />}
                trend={{ value: "21.4%", isPositive: true }}
              />
              <StatCard
                title="Net Revenue (Platform Fee)"
                value={data.businessAnalytics.netRevenue}
                icon={<TrendingUp className="w-5 h-5 text-moss-600" />}
                subtitle="20% commission average"
              />
              <StatCard
                title="Average Order Value (AOV)"
                value={data.businessAnalytics.avgOrderValue}
                icon={<DollarSign className="w-5 h-5 text-moss-600" />}
              />
              <StatCard
                title="Coupon Promo Burn"
                value={data.businessAnalytics.couponSpend}
                icon={<FileSpreadsheet className="w-5 h-5 text-terracotta-600" />}
                subtitle="Total discount subsidies"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Quarterly GMV Trend (₹ Cr)</h3>
                    <p className="text-xs text-sand-600">Gross revenue expansion</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-moss-600" />
                </div>
                {renderBarChart(data.businessAnalytics.revenueTrend, "terracotta", " Cr")}
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Top Coupon Redemptions</h3>
                    <p className="text-xs text-sand-600">Volume by promotional code</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-moss-600" />
                </div>
                {renderBarChart(data.businessAnalytics.couponPerformance, "moss")}
              </Card>
            </div>
          </div>
        )}

        {/* SECTION 6: ADMINISTRATIVE ANALYTICS */}
        {selectedSection === "admin" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Admin Accounts"
                value={data.administrativeAnalytics.totalAdmins}
                icon={<Users className="w-5 h-5 text-moss-600" />}
              />
              <StatCard
                title="Permission Edits"
                value={data.administrativeAnalytics.activePermissionChanges}
                icon={<ShieldCheck className="w-5 h-5 text-moss-600" />}
                subtitle="RBAC & scope modifications"
              />
              <StatCard
                title="Approvals Processed"
                value={data.administrativeAnalytics.approvalsProcessed}
                icon={<CheckCircle2 className="w-5 h-5 text-moss-600" />}
                subtitle="Ticket & onboard requests"
              />
              <StatCard
                title="Security Incidents"
                value={data.administrativeAnalytics.securityIncidents}
                icon={<ShieldCheck className="w-5 h-5 text-moss-600" />}
                subtitle="Zero critical breaches"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Weekly Admin Audit Activity</h3>
                    <p className="text-xs text-sand-600">Super admin and regional admin actions logged</p>
                  </div>
                  <Activity className="w-5 h-5 text-moss-600" />
                </div>
                {renderBarChart(data.administrativeAnalytics.adminActivityTrend, "moss")}
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-sand-900">Approval Category Share</h3>
                    <p className="text-xs text-sand-600">Distribution by type</p>
                  </div>
                  <PieChart className="w-5 h-5 text-moss-600" />
                </div>
                {renderProgressList(
                  data.administrativeAnalytics.approvalActivityBreakdown.map((i) => ({
                    label: i.label,
                    value: Math.round((i.value / 984) * 100)
                  })),
                  "%"
                )}
              </Card>
            </div>
          </div>
        )}
    </div>
  );
}
