"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DetailedDriver } from "@/lib/driverData";
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
} from "@/components";
import {
  ArrowLeft,
  User,
  Phone,
  ShieldCheck,
  FileText,
  Car,
  Building,
  Briefcase,
  MapPin,
  Star,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  History,
  Ban,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

export interface DriverDetailsViewProps {
  driver: DetailedDriver;
}

export const DriverDetailsView: React.FC<DriverDetailsViewProps> = ({ driver: initialDriver }) => {
  const [driver, setDriver] = useState<DetailedDriver>(initialDriver);
  const [activeTab, setActiveTab] = useState("profile");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const toggleDriverStatus = () => {
    setDriver((prev) => ({
      ...prev,
      status: prev.status === "Suspended" ? "Active" : "Suspended",
    }));
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Page Header */}
      <PageHeader
        title={driver.name}
        description={`Driver ID: ${driver.id} • Registered ${driver.profile.joinedDate}`}
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Driver Management", href: "/super-admin/drivers" },
          { label: driver.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Badge
              variant={
                driver.status === "Active"
                  ? "moss"
                  : driver.status === "On Trip"
                  ? "terracotta"
                  : driver.status === "Suspended"
                  ? "destructive"
                  : "muted"
              }
              dot
            >
              {driver.status}
            </Badge>

            {driver.status === "Suspended" ? (
              <Button
                variant="secondary"
                size="sm"
                icon={<UserCheck className="w-4 h-4" />}
                onClick={() => setIsConfirmModalOpen(true)}
              >
                Reactivate Driver
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                icon={<Ban className="w-4 h-4" />}
                onClick={() => setIsConfirmModalOpen(true)}
              >
                Suspend Driver
              </Button>
            )}

            <Link href="/super-admin/drivers">
              <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Directory
              </Button>
            </Link>
          </div>
        }
      />

      {/* Navigation Tabs across 15 Sections */}
      <Tabs
        tabs={[
          { id: "profile", label: "Profile & Assignment", icon: <User className="w-3.5 h-3.5" /> },
          { id: "verification", label: "Verification & Compliance", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { id: "performance", label: "Performance & Earnings", icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: "rides", label: "Ride History & Complaints", icon: <Car className="w-3.5 h-3.5" /> },
          { id: "history", label: "Driver & Audit History", icon: <History className="w-3.5 h-3.5" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab 1: Profile & Assignment */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 1: Driver Profile */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#5D7052]" /> 1. Driver Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-[#DED8CF]">
                <div className="w-12 h-12 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-lg shadow-moss">
                  {driver.avatar || driver.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2C2C24]">{driver.name}</h3>
                  <p className="text-[#78786C] font-mono">{driver.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#78786C] block">Date of Birth</span>
                  <span className="font-semibold text-[#2C2C24]">{driver.profile.dob}</span>
                </div>
                <div>
                  <span className="text-[#78786C] block">Experience</span>
                  <span className="font-semibold text-[#2C2C24]">{driver.profile.experienceYears} Years</span>
                </div>
                <div>
                  <span className="text-[#78786C] block">License No</span>
                  <span className="font-semibold text-[#2C2C24] font-mono">{driver.profile.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-[#78786C] block">License Expiry</span>
                  <span className="font-semibold text-[#2C2C24]">{driver.profile.licenseExpiry}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2 & 8: Contact Information & Location */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#C18C5D]" /> 2 & 8. Contact & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-2">
                <p className="font-bold text-[#2C2C24]">Contact Information</p>
                <div className="space-y-1">
                  <p><span className="text-[#78786C]">Phone:</span> <span className="font-semibold">{driver.phone}</span></p>
                  <p><span className="text-[#78786C]">Email:</span> <span className="font-semibold font-mono">{driver.email}</span></p>
                  <p><span className="text-[#78786C]">Emergency:</span> <span className="font-semibold">{driver.emergencyContact}</span></p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#DED8CF] space-y-2">
                <p className="font-bold text-[#2C2C24]">Current Location (GPS)</p>
                <div className="space-y-1">
                  <p><span className="text-[#78786C]">City / District:</span> <span className="font-semibold">{driver.location.city}, {driver.location.district} ({driver.location.state})</span></p>
                  <p><span className="text-[#78786C]">Coordinates:</span> <span className="font-mono text-[#5D7052]">{driver.location.coordinates}</span></p>
                  <p><span className="text-[#78786C]">Last Ping:</span> <span className="font-semibold">{driver.location.lastPing}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5, 6, 7: Vehicle, Fleet & Partner */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#5D7052]" /> 5, 6, 7. Vehicle, Fleet & Partner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-[#2C2C24]">Assigned Vehicle</p>
                <p className="font-semibold text-[#5D7052]">{driver.vehicle.model} ({driver.vehicle.type})</p>
                <p className="text-[#78786C] font-mono">Plate: {driver.vehicle.plateNumber} • Inspection Expiry: {driver.vehicle.inspectionExpiry}</p>
              </div>

              <div className="pt-3 border-t border-[#DED8CF] space-y-1">
                <p className="font-bold text-[#2C2C24]">Fleet Assignment</p>
                <p className="font-semibold text-[#2C2C24]">{driver.fleet.name} ({driver.fleet.id})</p>
                <p className="text-[#78786C]">Manager: {driver.fleet.manager}</p>
              </div>

              <div className="pt-3 border-t border-[#DED8CF] space-y-1">
                <p className="font-bold text-[#2C2C24]">Partner Organization</p>
                <p className="font-semibold text-[#C18C5D]">{driver.partner.name}</p>
                <Badge variant="moss" size="sm">{driver.partner.contractStatus}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Verification & Compliance */}
      {activeTab === "verification" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 3 & 4: Verification Status & Documents */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C18C5D]" /> 3 & 4. Documents & Verification Status
              </CardTitle>
              <CardDescription>Submitted safety certificates and identity documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {driver.documents.map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#2C2C24]">{doc.type}</p>
                    <p className="text-[#78786C] font-mono mt-0.5">{doc.number} • Expires {doc.expiryDate}</p>
                  </div>
                  <Badge variant={doc.status === "Verified" ? "moss" : "terracotta"} size="sm">
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section 13: Compliance */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#5D7052]" /> 13. Safety & Regulatory Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2C2C24]">Background Check</span>
                  <Badge variant={driver.compliance.backgroundCheck === "Passed" ? "moss" : "terracotta"}>
                    {driver.compliance.backgroundCheck}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#DED8CF]">
                  <span className="font-bold text-[#2C2C24]">Drug & Medical Test</span>
                  <Badge variant={driver.compliance.drugTest === "Passed" ? "moss" : "terracotta"}>
                    {driver.compliance.drugTest}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#DED8CF]">
                  <span className="font-bold text-[#2C2C24]">Commercial Safety Certification</span>
                  <Badge variant={driver.compliance.safetyCert === "Valid" ? "moss" : "destructive"}>
                    {driver.compliance.safetyCert}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Performance & Earnings */}
      {activeTab === "performance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 11: Performance */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#C18C5D]" /> 11. Driver Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#F0EBE5] border border-[#DED8CF]">
                <p className="text-xs text-[#78786C] font-bold uppercase">Overall Rating</p>
                <p className="font-heading text-3xl font-extrabold text-[#5D7052] mt-1">★ {driver.rating}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F0EBE5] border border-[#DED8CF]">
                <p className="text-xs text-[#78786C] font-bold uppercase">Completion Rate</p>
                <p className="font-heading text-3xl font-extrabold text-[#2C2C24] mt-1">{driver.completionRate}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F0EBE5] border border-[#DED8CF]">
                <p className="text-xs text-[#78786C] font-bold uppercase">Acceptance Rate</p>
                <p className="font-heading text-3xl font-extrabold text-[#2C2C24] mt-1">{driver.acceptanceRate}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F0EBE5] border border-[#DED8CF]">
                <p className="text-xs text-[#78786C] font-bold uppercase">Cancellation Rate</p>
                <p className="font-heading text-3xl font-extrabold text-[#A85448] mt-1">{driver.cancellationRate}%</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 10: Earnings */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#5D7052]" /> 10. Financial Earnings Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DED8CF]">
                <span className="font-bold text-[#78786C]">Lifetime Net Earnings</span>
                <span className="font-heading text-lg font-bold text-[#5D7052]">{driver.earnings.totalEarnings}</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DED8CF]">
                <span className="font-bold text-[#78786C]">Current Week Earnings</span>
                <span className="font-bold text-[#2C2C24]">{driver.earnings.weeklyEarnings}</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DED8CF]">
                <span className="font-bold text-[#78786C]">Platform Commission Paid</span>
                <span className="font-bold text-[#2C2C24]">{driver.earnings.commissionPaid}</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DED8CF]">
                <span className="font-bold text-[#78786C]">Tips Received</span>
                <span className="font-bold text-[#C18C5D]">{driver.earnings.tipsReceived}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 4: Rides & Complaints */}
      {activeTab === "rides" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 9: Ride History */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#5D7052]" /> 9. Dispatched Ride History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {driver.rideHistory.length === 0 ? (
                <p className="text-[#78786C]">No recent dispatches on record.</p>
              ) : (
                driver.rideHistory.map((r) => (
                  <div key={r.id} className="p-3.5 rounded-2xl border border-[#DED8CF] bg-white space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#2C2C24]">{r.id} • {r.passenger}</span>
                      <span className="text-[#5D7052]">{r.fare}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#78786C]">
                      <span>{r.date}</span>
                      <span>Rating: ★ {r.ratingGiven}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Section 12: Complaints */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#A85448]" /> 12. Logged Complaints & Disputes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {driver.complaints.length === 0 ? (
                <p className="text-[#78786C]">No complaints logged against this driver.</p>
              ) : (
                driver.complaints.map((cmp) => (
                  <div key={cmp.id} className="p-3.5 rounded-2xl border border-[#DED8CF] bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2C2C24]">{cmp.subject}</span>
                      <Badge variant={cmp.status === "Resolved" ? "moss" : "destructive"} size="sm">
                        {cmp.status}
                      </Badge>
                    </div>
                    <p className="text-[#78786C]">{cmp.id} • Logged on {cmp.date} ({cmp.complainant})</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 5: Driver History & Audit */}
      {activeTab === "history" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 14: Driver Lifecycle History */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#C18C5D]" /> 14. Driver Lifecycle History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {driver.lifecycleHistory.map((hist, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2C2C24]">{hist.event}</span>
                    <span className="text-[#78786C] text-[10px]">{hist.date}</span>
                  </div>
                  <p className="text-[#78786C]">{hist.notes}</p>
                  <p className="text-[10px] text-[#5D7052] font-semibold">Actor: {hist.actor}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section 15: Audit History */}
          <Card variant="elevated" rounded="3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#5D7052]" /> 15. Administrative Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {driver.auditLogs.length === 0 ? (
                <p className="text-[#78786C]">No recent administrative audit modifications.</p>
              ) : (
                driver.auditLogs.map((log, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white border border-[#DED8CF] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2C2C24]">{log.action}</span>
                      <span className="text-[#78786C] text-[10px]">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#78786C]">By {log.performedBy} ({log.ipAddress})</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirmation Action Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={`Confirm Driver ${driver.status === "Suspended" ? "Reactivation" : "Suspension"}`}
        description={`Are you sure you want to update the status of driver "${driver.name}"?`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={driver.status === "Suspended" ? "primary" : "destructive"}
              onClick={toggleDriverStatus}
            >
              Confirm Update
            </Button>
          </>
        }
      >
        <p className="text-xs text-[#78786C] py-2">
          {driver.status === "Suspended"
            ? "Reactivating this driver will restore dispatch requests and fleet vehicle access."
            : "Suspending this driver will instantly halt dispatches and lock vehicle access."}
        </p>
      </Modal>
    </div>
  );
};
