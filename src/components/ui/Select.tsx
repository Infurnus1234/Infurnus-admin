import React from "react";

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
  ({ label, options, error, helperText, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-[#78786C]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full bg-[#FDFCF8] border rounded-2xl px-4 py-2.5 text-sm text-[#2C2C24] appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5D7052] focus:border-[#5D7052] ${
              error
                ? "border-[#A85448] focus:ring-[#A85448]"
                : "border-[#DED8CF] hover:border-[#C18C5D]"
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#78786C]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

Select.displayName = "Select";
