import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    "primary" | "secondary" | "accent" | "outline" | "ghost" | "destructive";
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
    ref,
  ) => {
    const baseStyles =
      "inline-flex min-h-11 items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#154B3D] disabled:opacity-50 disabled:cursor-not-allowed rounded-md cursor-pointer";

    const variantStyles = {
      primary: "bg-[#154B3D] text-[#F3F4F1] hover:bg-[#103B30]  ",
      secondary: "bg-[#52645B] text-white hover:bg-[#3F5147]  ",
      accent:
        "bg-[#E7ECE8] text-[#202A25] hover:bg-[#dacdba] border border-[#DCE2DD] ",
      outline:
        "border-2 border-[#DCE2DD] text-[#202A25] hover:bg-[#F2F5F2] hover:border-[#52645B] ",
      ghost: "text-[#202A25] hover:bg-[#F2F5F2] hover:text-[#154B3D]",
      destructive: "bg-[#A85448] text-white hover:bg-[#93453a] shadow-sm ",
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
        {icon && iconPosition === "left" && (
          <span className="shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
