"use client";

import React, { useState } from "react";
import { CouponRecord, MOCK_COUPONS } from "@/lib/couponNotificationData";
import {
  PageHeader,
  Button,
  Badge,
  Card,
  DataTable,
  Modal,
  Input,
  Select,
  StatCard,
} from "@/components";
import { Column } from "@/types";
import {
  Ticket,
  Plus,
  Search,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  DollarSign,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponRecord[]>(MOCK_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCouponHistory, setSelectedCouponHistory] = useState<CouponRecord | null>(null);

  // Create Form State
  const [code, setCode] = useState("AUTUMN2026");
  const [discountType, setDiscountType] = useState<"Percentage" | "Fixed Amount">("Percentage");
  const [discountValue, setDiscountValue] = useState("15% OFF");
  const [expiryDate, setExpiryDate] = useState("2026-11-30");
  const [maxUsageLimit, setMaxUsageLimit] = useState(2500);
  const [userLimit, setUserLimit] = useState(1);
  const [eligibility, setEligibility] = useState("All Passengers");
  const [geoRestriction, setGeoRestriction] = useState("Berlin & Munich");
  const [vehicleRestriction, setVehicleRestriction] = useState("All Vehicles");
  const [rideRestriction, setRideRestriction] = useState("Min Fare €15.00");

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.eligibility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.geoRestriction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCoupon = () => {
    const newCoupon: CouponRecord = {
      id: `CPN-${Date.now().toString().slice(-3)}`,
      code: code.toUpperCase(),
      discountType,
      discountValue,
      usageCount: 0,
      maxUsageLimit,
      userLimit,
      expiryDate,
      eligibility,
      status: "Active",
      geoRestriction,
      vehicleRestriction,
      rideRestriction,
      totalDiscountAmount: "€0.00",
      redemptionHistory: [],
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    setIsCreateModalOpen(false);
  };

  const columns: Column<CouponRecord>[] = [
    {
      key: "code",
      header: "Code",
      render: (c) => (
        <div>
          <span className="font-mono text-xs font-bold text-[#5D7052]">{c.code}</span>
          <p className="text-[10px] text-[#78786C] font-mono">{c.id}</p>
        </div>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      render: (c) => <Badge variant="sand" size="sm">{c.discountValue}</Badge>,
    },
    {
      key: "usage",
      header: "Usage / Limit",
      render: (c) => (
        <span className="text-xs font-mono font-bold text-[#2C2C24]">
          {c.usageCount.toLocaleString()} / {c.maxUsageLimit.toLocaleString()}
        </span>
      ),
    },
    {
      key: "userLimit",
      header: "User Limit",
      render: (c) => <span className="text-xs font-medium text-[#78786C]">{c.userLimit} per user</span>,
    },
    {
      key: "expiry",
      header: "Expiry Date",
      render: (c) => <span className="text-xs font-mono text-[#2C2C24]">{c.expiryDate}</span>,
    },
    {
      key: "eligibility",
      header: "Eligibility",
      render: (c) => <span className="text-xs font-semibold text-[#C18C5D]">{c.eligibility}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (c) => (
        <Badge
          variant={
            c.status === "Active"
              ? "moss"
              : c.status === "Depleted"
              ? "terracotta"
              : "destructive"
          }
          dot
          size="sm"
        >
          {c.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (c) => (
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 rounded-full hover:bg-[#E6DCCD]"
          onClick={() => setSelectedCouponHistory(c)}
          title="View Usage History"
        >
          <Eye className="w-4 h-4 text-[#5D7052]" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title="Coupon & Promotion Management"
        description="Configure promotional codes, usage thresholds, vehicle & geographic restrictions, and redemption analytics."
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Coupons" },
        ]}
        actions={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Coupon
          </Button>
        }
      />

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Active Coupons"
          value={coupons.filter((c) => c.status === "Active").length}
          trend={{ value: "Live Promotions", isPositive: true }}
          icon={<Ticket className="w-5 h-5" />}
        />
        <StatCard
          title="Total Redemptions"
          value={coupons.reduce((acc, c) => acc + c.usageCount, 0).toLocaleString()}
          trend={{ value: "High engagement", isPositive: true }}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Disbursed Discount Value"
          value="€21,360.00"
          trend={{ value: "MTD Total", isPositive: true }}
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by code, eligibility, or geo restriction..."
          className="w-full bg-white border border-[#DED8CF] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052] transition-all"
        />
      </div>

      <DataTable columns={columns} data={filteredCoupons} keyExtractor={(c) => c.id} />

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Promotional Coupon"
        description="Configure discount rules, usage caps, and restrictions."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateCoupon}>Create Coupon</Button>
          </>
        }
      >
        <div className="space-y-4 py-2 text-xs">
          <Input label="Coupon Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. AUTUMN2026" />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Discount Type"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              options={[
                { label: "Percentage (% OFF)", value: "Percentage" },
                { label: "Fixed Amount (€ Credit)", value: "Fixed Amount" },
              ]}
            />
            <Input label="Discount Value" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="e.g. 15% OFF" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Expiry Date" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            <Input label="Max Usage Limit" type="number" value={maxUsageLimit} onChange={(e) => setMaxUsageLimit(Number(e.target.value))} />
            <Input label="Per User Limit" type="number" value={userLimit} onChange={(e) => setUserLimit(Number(e.target.value))} />
          </div>

          <Input label="Eligibility Audience" value={eligibility} onChange={(e) => setEligibility(e.target.value)} placeholder="e.g. All Passengers" />

          <div className="grid grid-cols-3 gap-3">
            <Input label="Geo Restrictions" value={geoRestriction} onChange={(e) => setGeoRestriction(e.target.value)} placeholder="e.g. Berlin" />
            <Input label="Vehicle Restrictions" value={vehicleRestriction} onChange={(e) => setVehicleRestriction(e.target.value)} placeholder="e.g. EV Sedan" />
            <Input label="Ride Restrictions" value={rideRestriction} onChange={(e) => setRideRestriction(e.target.value)} placeholder="e.g. Min Fare €10" />
          </div>
        </div>
      </Modal>

      {/* Usage History Modal */}
      <Modal
        isOpen={selectedCouponHistory !== null}
        onClose={() => setSelectedCouponHistory(null)}
        title={`Coupon Analytics & History (${selectedCouponHistory?.code})`}
        description="Redemption details and discount logs."
        footer={<Button variant="primary" onClick={() => setSelectedCouponHistory(null)}>Close</Button>}
      >
        <div className="space-y-3 py-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F0EBE5] border border-[#DED8CF] flex justify-between font-bold">
            <span>Total Disbursed: {selectedCouponHistory?.totalDiscountAmount}</span>
            <span>Total Redemptions: {selectedCouponHistory?.usageCount}</span>
          </div>

          <h4 className="font-bold text-[#2C2C24]">Recent Redemptions Log</h4>
          {selectedCouponHistory?.redemptionHistory.length === 0 ? (
            <p className="text-[#78786C]">No recent redemption logs recorded.</p>
          ) : (
            selectedCouponHistory?.redemptionHistory.map((h, i) => (
              <div key={i} className="p-3 rounded-2xl border border-[#DED8CF] bg-white flex justify-between">
                <div>
                  <p className="font-bold text-[#2C2C24]">{h.userName}</p>
                  <p className="text-[10px] text-[#78786C]">Ride {h.rideId} • {h.date}</p>
                </div>
                <Badge variant="moss" size="sm">{h.discountApplied}</Badge>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
