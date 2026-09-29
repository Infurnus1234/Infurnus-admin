import React from "react";
import { DriverRequestStatus } from "@/lib/driverRequestData";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

export interface ApprovalTimelineProps {
  status: DriverRequestStatus;
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ status }) => {
  const steps = [
    { key: "submitted", label: "Submitted" },
    { key: "review", label: "Under Review" },
    { key: "decision", label: "Decision" },
    { key: "completed", label: "Completed" },
  ];

  let currentStepIndex = 0;
  if (status === "Pending") currentStepIndex = 0;
  else if (status === "Under Review") currentStepIndex = 1;
  else if (status === "Changes Requested") currentStepIndex = 1;
  else if (status === "Approved" || status === "Rejected") currentStepIndex = 2;
  else if (status === "Cancelled" || status === "Expired") currentStepIndex = 3;

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative max-w-xl mx-auto">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-[#DED8CF] z-0" />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[#5D7052] transition-all duration-500 z-0"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isDone
                    ? "bg-[#5D7052] text-white shadow-moss"
                    : isCurrent
                    ? status === "Rejected"
                      ? "bg-[#A85448] text-white shadow-sm ring-4 ring-[#A85448]/20"
                      : status === "Changes Requested"
                      ? "bg-[#C18C5D] text-white shadow-terracotta ring-4 ring-[#C18C5D]/20"
                      : "bg-[#5D7052] text-white shadow-moss ring-4 ring-[#5D7052]/20 animate-pulse"
                    : "bg-[#FDFCF8] border-2 border-[#DED8CF] text-[#78786C]"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent && status === "Rejected" ? (
                  <XCircle className="w-4 h-4" />
                ) : isCurrent && status === "Changes Requested" ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[11px] font-bold mt-2 ${
                  isCurrent ? "text-[#2C2C24]" : isDone ? "text-[#5D7052]" : "text-[#78786C]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
