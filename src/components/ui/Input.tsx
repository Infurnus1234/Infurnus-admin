"use client";
import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, icon, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[#526581]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3.5 text-[#526581] pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              [
                props["aria-describedby"],
                error || helperText ? inputId + "-message" : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={`w-full bg-[#FFFFFF] border rounded-2xl px-4 py-2.5 text-sm text-[#101828] placeholder-[#526581]/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A0A] focus:border-[#FF7A0A] ${
              icon ? "pl-10" : ""
            } ${
              error
                ? "border-[#F04438] focus:ring-[#F04438]"
                : "border-[#E5EAF0] hover:border-[#2678F3]"
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p
            id={inputId + "-message"}
            className="text-xs text-[#F04438] font-medium"
          >
            {error}
          </p>
        ) : helperText ? (
          <p id={inputId + "-message"} className="text-xs text-[#526581]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
