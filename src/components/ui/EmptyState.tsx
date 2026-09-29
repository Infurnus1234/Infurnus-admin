import React from "react";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  description = "There are no items to display at the moment.",
  icon = <FolderOpen className="w-10 h-10 text-[#C18C5D]" />,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-[#FDFCF8] rounded-3xl border border-dashed border-[#DED8CF] ${className}`}
    >
      <div className="p-4 rounded-full bg-[#E6DCCD]/40 mb-4">{icon}</div>
      <h3 className="font-heading text-lg font-bold text-[#2C2C24]">{title}</h3>
      <p className="text-sm text-[#78786C] max-w-sm mt-1 mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
