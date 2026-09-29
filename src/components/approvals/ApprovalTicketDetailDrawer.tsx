"use client";

import React, { useState } from "react";
import { CentralizedApprovalTicket } from "@/lib/centralizedApprovalsData";
import { Badge, Button, Input } from "@/components";
import {
  X,
  User,
  ShieldAlert,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  GitCompare,
} from "lucide-react";

export interface ApprovalTicketDetailDrawerProps {
  ticket: CentralizedApprovalTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (t: CentralizedApprovalTicket, notes: string) => void;
  onReject: (t: CentralizedApprovalTicket, notes: string) => void;
  onRequestChanges: (t: CentralizedApprovalTicket, notes: string) => void;
}

export const ApprovalTicketDetailDrawer: React.FC<ApprovalTicketDetailDrawerProps> = ({
  ticket,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
}) => {
  const [decisionNotes, setDecisionNotes] = useState("");

  if (!isOpen || !ticket) return null;

  const riskBadgeVariant =
    ticket.riskLevel === "Critical" || ticket.riskLevel === "High"
      ? "destructive"
      : ticket.riskLevel === "Medium"
      ? "terracotta"
      : "moss";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C2C24]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-[#FDFCF8] h-full shadow-organic-lg flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-[#DED8CF]">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#DED8CF] bg-[#F0EBE5]/50 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#C18C5D]">{ticket.id}</span>
              <Badge variant={riskBadgeVariant} size="sm">
                {ticket.riskLevel} Risk
              </Badge>
              <Badge variant="sand" size="sm">{ticket.category}</Badge>
            </div>
            <h2 className="font-heading text-xl font-bold text-[#2C2C24] mt-1">
              {ticket.type}
            </h2>
            <p className="text-xs text-[#78786C] mt-0.5">
              Required Approval: <span className="font-semibold text-[#5D7052]">{ticket.requiredApproval}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Detail View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Request Summary & Requester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-3xl border border-[#DED8CF] bg-white space-y-2">
              <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5D7052]" /> Request Summary
              </h3>
              <p className="text-[#2C2C24] leading-relaxed font-medium">{ticket.summary}</p>
              <p className="text-[10px] text-[#78786C] pt-1">Target Resource: <span className="font-mono font-semibold">{ticket.resource}</span></p>
            </div>

            <div className="p-4 rounded-3xl border border-[#DED8CF] bg-white space-y-2">
              <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
                <User className="w-4 h-4 text-[#C18C5D]" /> Requester Information
              </h3>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-xs">
                  {ticket.requester.avatar || ticket.requester.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#2C2C24]">{ticket.requester.name}</p>
                  <p className="text-[#78786C]">{ticket.requester.role}</p>
                  <p className="text-[10px] text-[#78786C] font-mono">Created: {ticket.createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2 & 3. Current State, Requested Change & Reason */}
          <div className="p-5 rounded-3xl border border-[#DED8CF] bg-white space-y-3 text-xs">
            <h3 className="font-heading text-sm font-bold text-[#2C2C24]">
              Current State vs. Requested Change
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                <span className="text-[#78786C] font-bold block uppercase text-[10px]">Current State</span>
                <span className="font-semibold text-[#2C2C24] mt-1 block">{ticket.currentState}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#E6DCCD]/50 border border-[#DED8CF]">
                <span className="text-[#5D7052] font-bold block uppercase text-[10px]">Requested Change</span>
                <span className="font-bold text-[#5D7052] mt-1 block">{ticket.requestedChange}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#DED8CF]">
              <span className="text-[#78786C] font-bold block">Justification / Reason:</span>
              <p className="text-[#2C2C24] mt-0.5">{ticket.reason}</p>
            </div>
          </div>

          {/* 4. Previous State vs Proposed State (Side-by-Side Diff Comparison) */}
          <div className="p-5 rounded-3xl border border-[#DED8CF] bg-white space-y-3 text-xs">
            <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-[#C18C5D]" /> Previous State vs. Proposed State Comparison
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Previous State */}
              <div className="p-3.5 rounded-2xl bg-[#F0EBE5]/40 border border-[#DED8CF] space-y-2">
                <span className="font-bold text-[#A85448] uppercase text-[10px] block">- Previous State</span>
                {Object.entries(ticket.previousState).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-[#DED8CF]/60 pb-1">
                    <span className="text-[#78786C]">{k}</span>
                    <span className="font-mono text-[#2C2C24] font-semibold">{v}</span>
                  </div>
                ))}
              </div>

              {/* Proposed State */}
              <div className="p-3.5 rounded-2xl bg-[#5D7052]/10 border border-[#5D7052] space-y-2">
                <span className="font-bold text-[#5D7052] uppercase text-[10px] block">+ Proposed State</span>
                {Object.entries(ticket.proposedState).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-[#5D7052]/20 pb-1">
                    <span className="text-[#78786C]">{k}</span>
                    <span className="font-mono text-[#5D7052] font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Approval History */}
          <div className="p-5 rounded-3xl border border-[#DED8CF] bg-white space-y-3 text-xs">
            <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5D7052]" /> Approval History
            </h3>
            {ticket.approvalHistory.map((h, i) => (
              <div key={i} className="p-3 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#2C2C24]">
                  <span>{h.action}</span>
                  <span className="text-[#78786C] text-[10px]">{h.date}</span>
                </div>
                <p className="text-[#78786C]">{h.notes}</p>
                <p className="text-[10px] text-[#5D7052] font-semibold">Actor: {h.actor}</p>
              </div>
            ))}
          </div>

          {/* 6. Audit Preview */}
          <div className="p-5 rounded-3xl border border-[#DED8CF] bg-[#F0EBE5]/40 space-y-2 text-xs">
            <h3 className="font-heading text-sm font-bold text-[#2C2C24] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#C18C5D]" /> Audit & Compliance Preview
            </h3>
            <p><span className="text-[#78786C]">Audit Rule Code:</span> <span className="font-mono font-bold text-[#5D7052]">{ticket.auditPreview.ruleCode}</span></p>
            <p><span className="text-[#78786C]">Risk Check Status:</span> <span className="font-mono font-semibold text-[#2C2C24]">{ticket.auditPreview.riskCheck}</span></p>
            <p><span className="text-[#78786C]">Compliance Policy:</span> <span className="font-semibold text-[#2C2C24]">{ticket.auditPreview.compliancePolicy}</span></p>
          </div>

          {/* Decision Notes */}
          <div className="space-y-1.5 pt-2">
            <Input
              label="Decision Notes / Rejection Reason"
              placeholder="Add optional decision notes for local state transition..."
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="p-6 border-t border-[#DED8CF] bg-[#F0EBE5]/50 flex items-center justify-between gap-3 shrink-0">
          <Button
            variant="destructive"
            icon={<XCircle className="w-4 h-4" />}
            onClick={() => {
              onReject(ticket, decisionNotes);
              setDecisionNotes("");
            }}
          >
            Reject Ticket
          </Button>

          <Button
            variant="accent"
            icon={<AlertCircle className="w-4 h-4 text-[#C18C5D]" />}
            onClick={() => {
              onRequestChanges(ticket, decisionNotes);
              setDecisionNotes("");
            }}
          >
            Request Changes
          </Button>

          <Button
            variant="primary"
            icon={<CheckCircle2 className="w-4 h-4" />}
            onClick={() => {
              onApprove(ticket, decisionNotes);
              setDecisionNotes("");
            }}
          >
            Approve Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};
