import React from "react";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = "Loading panel details...",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 min-h-[200px] text-center ${className}`}
    >
      <Loader2 className="w-8 h-8 text-[#FF7A0A] animate-spin mb-3" />
      <p className="text-sm font-medium text-[#526581] font-sans">{label}</p>
    </div>
  );
};
