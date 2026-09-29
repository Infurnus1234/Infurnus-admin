"use client";

import React, { useState } from "react";
import { DriverApprovalRequest, DriverRequestStatus } from "@/lib/driverRequestData";
import { ApprovalTimeline } from "./ApprovalTimeline";
import { Badge, Button, Input, Modal } from "@/components";
import {
  X,
  User,
  Phone,
  FileText,
  ShieldCheck,
  Car,
  Building,
  MapPin,
  History,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

export interface RequestReviewDrawerProps {
  request: DriverApprovalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (req: DriverApprovalRequest, notes: string) => void;
  onReject: (req: DriverApprovalRequest, notes: string) => void;
  onRequestChanges: (req: DriverApprovalRequest, notes: string) => void;
}

export const RequestReviewDrawer: React.FC<RequestReviewDrawerProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
}) => {
  const [actionNotes, setActionNotes] = useState("");

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C2C24]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-2xl bg-[#FDFCF8] h-full shadow-organic-lg flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-[#DED8CF]">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#DED8CF] bg-[#F0EBE5]/50 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#C18C5D]">{request.id}</span>
              <Badge
                variant={
                  request.priority === "High"
                    ? "destructive"
                    : request.priority === "Medium"
                    ? "terracotta"
                    : "sand"
                }
                size="sm"
              >
                {request.priority} Priority
              </Badge>
            </div>
            <h2 className="font-heading text-xl font-bold text-[#2C2C24] mt-1">
              {request.requestType.replace(/_/g, " ")}
            </h2>
            <p className="text-xs text-[#78786C]">
              Submitted by <span className="font-bold text-[#2C2C24]">{request.submittedBy.name}</span> ({request.submittedBy.role}) on {request.submittedDate}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Approval Timeline */}
        <div className="px-6 py-2 bg-[#FDFCF8] border-b border-[#DED8CF] shrink-0">
          <ApprovalTimeline status={request.status} />
        </div>

        {/* Scrollable Details */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Driver & Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl border border-[#DED8CF] bg-white space-y-2 text-xs">
              <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
                <User className="w-4 h-4 text-[#5D7052]" /> Driver Information
              </h3>
              <p><span className="text-[#78786C]">Name:</span> <span className="font-bold text-[#2C2C24]">{request.driverName}</span></p>
              <p><span className="text-[#78786C]">Email:</span> <span className="font-mono">{request.driverEmail}</span></p>
              <p><span className="text-[#78786C]">Phone:</span> <span className="font-semibold">{request.driverPhone}</span></p>
            </div>

            <div className="p-4 rounded-3xl border border-[#DED8CF] bg-white space-y-2 text-xs">
              <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C18C5D]" /> Contact Details
              </h3>
              <p><span className="text-[#78786C]">Direct Phone:</span> <span className="font-semibold">{request.details.contact.phone}</span></p>
              <p><span className="text-[#78786C]">Emergency Contact:</span> <span className="font-semibold">{request.details.contact.emergency}</span></p>
            </div>
          </div>

          {/* Documents & Verification */}
          <div className="p-5 rounded-3xl border border-[#DED8CF] bg-white space-y-3 text-xs">
            <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#5D7052]" /> Verification & Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {request.details.documents.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#F0EBE5]/50 flex items-center justify-between border border-[#DED8CF]/60">
                  <span className="font-bold text-[#2C2C24]">{doc.title}</span>
                  <Badge variant={doc.status === "Verified" ? "moss" : "terracotta"} size="sm">
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle, Partner & Fleet */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-[#DED8CF] bg-white space-y-1">
              <h4 className="font-bold text-[#2C2C24] flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#5D7052]" /> Vehicle
              </h4>
              <p className="font-semibold text-[#5D7052]">{request.details.vehicle.model}</p>
              <p className="text-[#78786C] font-mono">{request.details.vehicle.plate} ({request.details.vehicle.type})</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#DED8CF] bg-white space-y-1">
              <h4 className="font-bold text-[#2C2C24] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#C18C5D]" /> Fleet
              </h4>
              <p className="font-semibold text-[#2C2C24]">{request.details.fleet.name}</p>
              <p className="text-[#78786C] font-mono">{request.details.fleet.id}</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#DED8CF] bg-white space-y-1">
              <h4 className="font-bold text-[#2C2C24] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#5D7052]" /> Partner & Location
              </h4>
              <p className="font-semibold text-[#C18C5D]">{request.details.partner.name}</p>
              <p className="text-[#78786C]">{request.details.location.city}, {request.details.location.district}</p>
            </div>
          </div>

          {/* Previous Request History */}
          <div className="p-5 rounded-3xl border border-[#DED8CF] bg-white space-y-3 text-xs">
            <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
              <History className="w-4 h-4 text-[#C18C5D]" /> Previous Request History
            </h3>
            {request.details.previousHistory.length === 0 ? (
              <p className="text-[#78786C]">No prior approval requests for this driver.</p>
            ) : (
              request.details.previousHistory.map((hist) => (
                <div key={hist.id} className="p-3 rounded-2xl bg-[#F0EBE5]/50 flex items-center justify-between border border-[#DED8CF]">
                  <div>
                    <span className="font-bold text-[#2C2C24]">{hist.type}</span>
                    <span className="text-[#78786C] text-[10px] block">{hist.id} • {hist.date}</span>
                  </div>
                  <Badge variant="moss" size="sm">{hist.status}</Badge>
                </div>
              ))
            )}
          </div>

          {/* Action Notes Input */}
          <div className="space-y-1.5 pt-2">
            <Input
              label="Review / Decision Notes"
              placeholder="Add optional notes or change instructions..."
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="p-6 border-t border-[#DED8CF] bg-[#F0EBE5]/50 flex items-center justify-between gap-3 shrink-0">
          <Button
            variant="destructive"
            icon={<XCircle className="w-4 h-4" />}
            onClick={() => {
              onReject(request, actionNotes);
              setActionNotes("");
            }}
          >
            Reject Request
          </Button>

          <Button
            variant="accent"
            icon={<AlertCircle className="w-4 h-4 text-[#C18C5D]" />}
            onClick={() => {
              onRequestChanges(request, actionNotes);
              setActionNotes("");
            }}
          >
            Request Changes
          </Button>

          <Button
            variant="primary"
            icon={<CheckCircle className="w-4 h-4" />}
            onClick={() => {
              onApprove(request, actionNotes);
              setActionNotes("");
            }}
          >
            Approve Request
          </Button>
        </div>
      </div>
    </div>
  );
};
