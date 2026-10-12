import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    "moss" | "terracotta" | "sand" | "muted" | "destructive" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "moss",
  size = "md",
  dot = false,
  className = "",
}) => {
  const variantStyles = {
    moss: "bg-[#FF7A0A]/15 text-[#FF7A0A] border border-[#FF7A0A]/20",
    terracotta: "bg-[#2678F3]/15 text-[#2678F3] border border-[#2678F3]/20",
    sand: "bg-[#E5EAF0] text-[#101828] border border-[#E5EAF0]",
    muted: "bg-[#F4F6F9] text-[#526581] border border-[#E5EAF0]",
    destructive: "bg-[#F04438]/15 text-[#F04438] border border-[#F04438]/20",
    outline: "border border-[#E5EAF0] text-[#526581] bg-transparent",
  };

  const dotColors = {
    moss: "bg-[#FF7A0A]",
    terracotta: "bg-[#2678F3]",
    sand: "bg-[#101828]",
    muted: "bg-[#526581]",
    destructive: "bg-[#F04438]",
    outline: "bg-[#526581]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium rounded-full gap-1.5",
    md: "px-3 py-1 text-xs font-semibold rounded-full gap-2",
  };

  return (
    <span
      className={`inline-flex items-center ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};
