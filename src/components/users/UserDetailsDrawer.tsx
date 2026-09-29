"use client";

import React, { useState } from "react";
import { DetailedUser } from "@/lib/userData";
import { Badge, Button, Tabs, DataTable } from "@/components";
import { Column } from "@/types";
import {
  X,
  User,
  Phone,
  MapPin,
  Car,
  CreditCard,
  Ticket,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle,
  Ban,
  UserCheck,
  UserX,
} from "lucide-react";

export interface UserDetailsDrawerProps {
  user: DetailedUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSuspend: (user: DetailedUser) => void;
  onReactivate: (user: DetailedUser) => void;
  onDeactivate: (user: DetailedUser) => void;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onSuspend,
  onReactivate,
  onDeactivate,
}) => {
  const [activeTab, setActiveTab] = useState("profile");

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C2C24]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-[#FDFCF8] h-full shadow-organic-lg flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-[#DED8CF]">
        {/* Header */}
        <div className="p-6 border-b border-[#DED8CF] bg-[#F0EBE5]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-lg shadow-moss">
              {user.avatar || user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-bold text-[#2C2C24]">
                  {user.name}
                </h2>
                <Badge
                  variant={
                    user.accountStatus === "Active"
                      ? "moss"
                      : user.accountStatus === "Suspended"
                      ? "terracotta"
                      : "destructive"
                  }
                  dot
                  size="sm"
                >
                  {user.accountStatus}
                </Badge>
              </div>
              <p className="text-xs text-[#78786C] font-mono mt-0.5">{user.id} • Registered {user.registrationDate}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="px-6 py-3 border-b border-[#DED8CF] shrink-0 bg-[#FDFCF8]">
          <Tabs
            tabs={[
              { id: "profile", label: "Profile & Info", icon: <User className="w-3.5 h-3.5" /> },
              { id: "rides", label: "Rides", badge: user.rideHistory.length },
              { id: "payments", label: "Payments", badge: user.paymentHistory.length },
              { id: "coupons", label: "Coupons", badge: user.couponUsage.length },
              { id: "complaints", label: "Complaints", badge: user.complaints.length },
              { id: "sessions", label: "Sessions & Security" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Quick Status Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                  <p className="text-[10px] uppercase font-bold text-[#78786C]">Payment Status</p>
                  <p className="text-xs font-bold text-[#2C2C24] mt-1">{user.paymentStatus}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                  <p className="text-[10px] uppercase font-bold text-[#78786C]">KYC Verification</p>
                  <p className="text-xs font-bold text-[#5D7052] mt-1">{user.profile.kycStatus}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                  <p className="text-[10px] uppercase font-bold text-[#78786C]">Total Dispatches</p>
                  <p className="text-xs font-bold text-[#2C2C24] mt-1">{user.totalRides} Rides</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-5 rounded-3xl border border-[#DED8CF] bg-white space-y-3">
                <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#5D7052]" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#78786C] block">Email Address</span>
                    <span className="font-semibold text-[#2C2C24]">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-[#78786C] block">Phone Number</span>
                    <span className="font-semibold text-[#2C2C24]">{user.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#78786C] block">Emergency Contact</span>
                    <span className="font-semibold text-[#2C2C24]">{user.emergencyContact}</span>
                  </div>
                  <div>
                    <span className="text-[#78786C] block">Preferred Language</span>
                    <span className="font-semibold text-[#2C2C24]">{user.profile.preferredLanguage}</span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="p-5 rounded-3xl border border-[#DED8CF] bg-white space-y-3">
                <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C18C5D]" /> Location & Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#78786C] block">Street Address</span>
                    <span className="font-semibold text-[#2C2C24]">{user.addressLine}</span>
                  </div>
                  <div>
                    <span className="text-[#78786C] block">City / Postal Code</span>
                    <span className="font-semibold text-[#2C2C24]">{user.city}, {user.zipCode}</span>
                  </div>
                  <div>
                    <span className="text-[#78786C] block">State / Region</span>
                    <span className="font-semibold text-[#2C2C24]">{user.state}</span>
                  </div>
                  <div>
                    <span className="text-[#78786C] block">Country</span>
                    <span className="font-semibold text-[#2C2C24]">{user.country}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rides" && (
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold text-[#2C2C24]">Ride History</h3>
              {user.rideHistory.length === 0 ? (
                <p className="text-xs text-[#78786C]">No rides dispatched for this user.</p>
              ) : (
                <div className="space-y-3">
                  {user.rideHistory.map((ride) => (
                    <div key={ride.id} className="p-4 rounded-2xl border border-[#DED8CF] bg-white text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2C2C24]">{ride.id}</span>
                        <Badge variant={ride.status === "Completed" ? "moss" : "destructive"} size="sm">
                          {ride.status}
                        </Badge>
                      </div>
                      <div className="text-[#78786C]">
                        <p>📍 Pick: {ride.pickup}</p>
                        <p>🏁 Drop: {ride.dropoff}</p>
                      </div>
                      <div className="pt-2 border-t border-[#DED8CF]/60 flex items-center justify-between font-bold text-[#2C2C24]">
                        <span>{ride.date}</span>
                        <span className="text-[#5D7052]">{ride.fare}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold text-[#2C2C24]">Payment History</h3>
              {user.paymentHistory.map((pay) => (
                <div key={pay.id} className="p-4 rounded-2xl border border-[#DED8CF] bg-white text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#2C2C24]">{pay.method}</p>
                    <p className="text-[#78786C] mt-0.5">{pay.id} • {pay.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#2C2C24]">{pay.amount}</p>
                    <Badge variant={pay.status === "Paid" ? "moss" : "destructive"} size="sm">
                      {pay.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "coupons" && (
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold text-[#2C2C24]">Redeemed Coupons</h3>
              {user.couponUsage.length === 0 ? (
                <p className="text-xs text-[#78786C]">No coupon redemptions recorded.</p>
              ) : (
                user.couponUsage.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-[#DED8CF] bg-white text-xs flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold text-[#5D7052]">{c.code}</p>
                      <p className="text-[#78786C] mt-0.5">Used on {c.usedOn}</p>
                    </div>
                    <Badge variant="sand" size="sm">{c.discount}</Badge>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "complaints" && (
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold text-[#2C2C24]">Support Tickets & Complaints</h3>
              {user.complaints.length === 0 ? (
                <p className="text-xs text-[#78786C]">No complaints logged against this user account.</p>
              ) : (
                user.complaints.map((cmp) => (
                  <div key={cmp.id} className="p-4 rounded-2xl border border-[#DED8CF] bg-white text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2C2C24]">{cmp.subject}</span>
                      <Badge variant={cmp.status === "Resolved" ? "moss" : "terracotta"} size="sm">
                        {cmp.status}
                      </Badge>
                    </div>
                    <p className="text-[#78786C]">{cmp.id} • Logged on {cmp.date}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold text-[#2C2C24]">Active Login & Sessions</h3>
              {user.loginSessions.map((s, i) => (
                <div key={i} className="p-4 rounded-2xl border border-[#DED8CF] bg-white text-xs space-y-1">
                  <p className="font-bold text-[#2C2C24]">{s.device}</p>
                  <p className="text-[#78786C] font-mono">IP: {s.ip} ({s.location})</p>
                  <p className="text-[10px] text-[#78786C]">Last active: {s.lastActive}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Action Controls Footer */}
        <div className="p-6 border-t border-[#DED8CF] bg-[#F0EBE5]/50 flex items-center justify-between shrink-0 gap-2">
          {user.accountStatus === "Active" ? (
            <Button
              variant="outline"
              size="sm"
              icon={<Ban className="w-4 h-4 text-[#C18C5D]" />}
              onClick={() => onSuspend(user)}
            >
              Suspend User
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              icon={<UserCheck className="w-4 h-4" />}
              onClick={() => onReactivate(user)}
            >
              Reactivate Account
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            icon={<UserX className="w-4 h-4" />}
            onClick={() => onDeactivate(user)}
          >
            Deactivate User
          </Button>
        </div>
      </div>
    </div>
  );
};
