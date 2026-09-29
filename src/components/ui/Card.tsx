import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "flat" | "elevated" | "outlined" | "sand";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "2xl" | "3xl";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "elevated",
  padding = "md",
  rounded = "3xl",
}) => {
  const roundedClass = rounded === "2xl" ? "rounded-2xl" : "rounded-3xl";

  const variantStyles = {
    flat: "bg-[#F0EBE5] border border-transparent",
    elevated: "bg-white border border-[#DED8CF] shadow-organic",
    outlined: "bg-[#FDFCF8] border border-[#DED8CF]",
    sand: "bg-[#E6DCCD]/40 border border-[#DED8CF]",
  };

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`relative transition-all duration-300 ${roundedClass} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`flex flex-col gap-1 pb-4 border-b border-[#DED8CF]/60 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h3 className={`font-heading text-xl font-bold text-[#2C2C24] tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <p className={`text-sm text-[#78786C] ${className}`}>{children}</p>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`pt-4 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`pt-4 mt-4 border-t border-[#DED8CF]/60 flex items-center justify-between ${className}`}>
    {children}
  </div>
);
