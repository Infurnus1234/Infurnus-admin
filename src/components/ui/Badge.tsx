import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "moss" | "terracotta" | "sand" | "muted" | "destructive" | "outline";
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
    moss: "bg-[#5D7052]/15 text-[#5D7052] border border-[#5D7052]/20",
    terracotta: "bg-[#C18C5D]/15 text-[#C18C5D] border border-[#C18C5D]/20",
    sand: "bg-[#E6DCCD] text-[#2C2C24] border border-[#DED8CF]",
    muted: "bg-[#F0EBE5] text-[#78786C] border border-[#DED8CF]",
    destructive: "bg-[#A85448]/15 text-[#A85448] border border-[#A85448]/20",
    outline: "border border-[#DED8CF] text-[#78786C] bg-transparent",
  };

  const dotColors = {
    moss: "bg-[#5D7052]",
    terracotta: "bg-[#C18C5D]",
    sand: "bg-[#2C2C24]",
    muted: "bg-[#78786C]",
    destructive: "bg-[#A85448]",
    outline: "bg-[#78786C]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium rounded-full gap-1.5",
    md: "px-3 py-1 text-xs font-semibold rounded-full gap-2",
  };

  return (
    <span className={`inline-flex items-center ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
