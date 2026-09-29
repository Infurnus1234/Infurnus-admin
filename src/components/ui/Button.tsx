import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D7052] disabled:opacity-50 disabled:cursor-not-allowed rounded-full cursor-pointer";

    const variantStyles = {
      primary:
        "bg-[#5D7052] text-[#F3F4F1] hover:bg-[#4d5e43] shadow-moss active:scale-[0.98]",
      secondary:
        "bg-[#C18C5D] text-white hover:bg-[#b07b4c] shadow-terracotta active:scale-[0.98]",
      accent:
        "bg-[#E6DCCD] text-[#2C2C24] hover:bg-[#dacdba] border border-[#DED8CF] active:scale-[0.98]",
      outline:
        "border-2 border-[#DED8CF] text-[#2C2C24] hover:bg-[#F0EBE5] hover:border-[#C18C5D] active:scale-[0.98]",
      ghost:
        "text-[#2C2C24] hover:bg-[#F0EBE5] hover:text-[#5D7052]",
      destructive:
        "bg-[#A85448] text-white hover:bg-[#93453a] shadow-sm active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3 text-base gap-2.5 font-semibold",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
