import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, icon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#78786C]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3.5 text-[#78786C] pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-[#FDFCF8] border rounded-2xl px-4 py-2.5 text-sm text-[#2C2C24] placeholder-[#78786C]/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5D7052] focus:border-[#5D7052] ${
              icon ? "pl-10" : ""
            } ${
              error
                ? "border-[#A85448] focus:ring-[#A85448]"
                : "border-[#DED8CF] hover:border-[#C18C5D]"
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-[#A85448] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#78786C]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
