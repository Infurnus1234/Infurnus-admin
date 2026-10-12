"use client";
import React, { useId } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, error, helperText, className = "", id, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-[#526581]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={
              [
                props["aria-describedby"],
                error || helperText ? selectId + "-message" : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={`w-full bg-[#FFFFFF] border rounded-2xl px-4 py-2.5 text-sm text-[#101828] appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A0A] focus:border-[#FF7A0A] ${
              error
                ? "border-[#F04438] focus:ring-[#F04438]"
                : "border-[#E5EAF0] hover:border-[#2678F3]"
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#526581]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error ? (
          <p
            id={selectId + "-message"}
            className="text-xs text-[#F04438] font-medium"
          >
            {error}
          </p>
        ) : helperText ? (
          <p id={selectId + "-message"} className="text-xs text-[#526581]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
