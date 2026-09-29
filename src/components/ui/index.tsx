import React from "react";

// --- BUTTON ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5D7052]/50 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#5D7052] text-[#F3F4F1] hover:bg-[#4d5e43] shadow-sm hover:shadow active:scale-[0.98]",
    secondary: "bg-[#C18C5D] text-white hover:bg-[#b07d4f] shadow-sm hover:shadow active:scale-[0.98]",
    accent: "bg-[#E6DCCD] text-[#2C2C24] hover:bg-[#ded1be] active:scale-[0.98]",
    outline: "border-2 border-[#DED8CF] text-[#2C2C24] bg-transparent hover:border-[#5D7052] hover:text-[#5D7052]",
    ghost: "bg-transparent text-[#2C2C24] hover:bg-[#F0EBE5]",
    destructive: "bg-[#A85448] text-white hover:bg-[#96473c] shadow-sm active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

// --- INPUT ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold tracking-wide uppercase text-[#78786C]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && <div className="absolute left-3.5 text-[#78786C] pointer-events-none">{leftIcon}</div>}
        <input
          id={inputId}
          className={`w-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-[#2C2C24] placeholder-[#78786C]/60 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5D7052] focus:bg-[#FDFCF8] focus:ring-2 focus:ring-[#5D7052]/20 transition-all ${
            leftIcon ? "pl-10" : ""
          } ${rightIcon ? "pr-10" : ""} ${error ? "border-[#A85448] focus:border-[#A85448] focus:ring-[#A85448]/20" : ""} ${className}`}
          {...props}
        />
        {rightIcon && <div className="absolute right-3.5 text-[#78786C]">{rightIcon}</div>}
      </div>
      {error && <span className="text-xs text-[#A85448] font-medium">{error}</span>}
    </div>
  );
};

// --- SELECT ---
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = "",
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-bold tracking-wide uppercase text-[#78786C]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-[#2C2C24] rounded-2xl px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-[#5D7052] focus:bg-[#FDFCF8] focus:ring-2 focus:ring-[#5D7052]/20 transition-all pr-10 cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#78786C]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-[#A85448] font-medium">{error}</span>}
    </div>
  );
};

// --- BADGE ---
export interface BadgeProps {
  variant?: "moss" | "terracotta" | "sand" | "neutral" | "destructive";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = "moss", children, className = "" }) => {
  const variants = {
    moss: "bg-[#5D7052]/15 text-[#5D7052] border border-[#5D7052]/30",
    terracotta: "bg-[#C18C5D]/15 text-[#C18C5D] border border-[#C18C5D]/30",
    sand: "bg-[#E6DCCD] text-[#554a3b] border border-[#DED8CF]",
    neutral: "bg-[#F0EBE5] text-[#78786C] border border-[#DED8CF]",
    destructive: "bg-[#A85448]/15 text-[#A85448] border border-[#A85448]/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// --- CARD ---
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", hoverable = false }) => {
  return (
    <div
      className={`bg-[#FDFCF8] border border-[#DED8CF] rounded-3xl p-6 organic-shadow ${
        hoverable ? "organic-shadow-hover cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

// --- STAT CARD ---
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  description?: string;
  accentColor?: "moss" | "terracotta" | "sand";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  description,
  accentColor = "moss",
}) => {
  const iconBg = {
    moss: "bg-[#5D7052]/10 text-[#5D7052]",
    terracotta: "bg-[#C18C5D]/10 text-[#C18C5D]",
    sand: "bg-[#E6DCCD] text-[#554a3b]",
  };

  return (
    <Card hoverable className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider uppercase text-[#78786C]">{title}</p>
          <h3 className="text-3xl font-bold font-heading text-[#2C2C24] mt-2">{value}</h3>
        </div>
        {icon && <div className={`p-3 rounded-2xl ${iconBg[accentColor]}`}>{icon}</div>}
      </div>

      {(change || description) && (
        <div className="mt-4 pt-3 border-t border-[#DED8CF]/60 flex items-center justify-between text-xs">
          {change && (
            <span className={`font-bold ${isPositive ? "text-[#5D7052]" : "text-[#A85448]"}`}>
              {isPositive ? "↑" : "↓"} {change}
            </span>
          )}
          {description && <span className="text-[#78786C]">{description}</span>}
        </div>
      )}
    </Card>
  );
};

// --- MODAL ---
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FDFCF8] border border-[#DED8CF] rounded-3xl max-w-lg w-full p-6 organic-shadow-lg flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[#DED8CF] pb-4">
          <h3 className="text-xl font-bold font-heading text-[#2C2C24]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0EBE5] flex items-center justify-center text-[#78786C] hover:bg-[#E6DCCD] transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="text-sm text-[#2C2C24]">{children}</div>
        {footer && <div className="border-t border-[#DED8CF] pt-4 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

// --- DROPDOWN ---
export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#FDFCF8] border border-[#DED8CF] rounded-2xl organic-shadow py-2 z-40">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2 transition-colors ${
                item.danger
                  ? "text-[#A85448] hover:bg-[#A85448]/10"
                  : "text-[#2C2C24] hover:bg-[#F0EBE5]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- TABS ---
export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex items-center gap-2 bg-[#F0EBE5] p-1.5 rounded-full w-fit">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              isActive
                ? "bg-[#5D7052] text-[#F3F4F1] shadow-sm"
                : "text-[#78786C] hover:text-[#2C2C24]"
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive ? "bg-[#F3F4F1]/20 text-white" : "bg-[#E6DCCD] text-[#2C2C24]"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// --- DATA TABLE ---
export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title="No items" description={emptyMessage} />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-[#DED8CF] bg-[#FDFCF8] organic-shadow">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#DED8CF] bg-[#F0EBE5]/50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-6 py-4 text-xs font-bold tracking-wider uppercase text-[#78786C] ${
                  col.className || ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DED8CF]/60">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className="hover:bg-[#F0EBE5]/40 transition-colors"
            >
              {columns.map((col, idx) => (
                <td key={idx} className={`px-6 py-4 text-[#2C2C24] ${col.className || ""}`}>
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- EMPTY STATE ---
export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[#FDFCF8] border border-dashed border-[#DED8CF] rounded-3xl text-center">
      {icon ? (
        <div className="p-4 rounded-full bg-[#E6DCCD]/40 text-[#5D7052] mb-4">{icon}</div>
      ) : (
        <div className="w-14 h-14 rounded-full bg-[#E6DCCD]/40 text-[#5D7052] flex items-center justify-center text-xl mb-4">
          🍃
        </div>
      )}
      <h4 className="text-lg font-bold font-heading text-[#2C2C24]">{title}</h4>
      <p className="text-sm text-[#78786C] max-w-sm mt-1">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

// --- LOADING STATE ---
export const LoadingState: React.FC<{ label?: string }> = ({ label = "Loading data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center gap-3">
      <div className="w-10 h-10 border-4 border-[#E6DCCD] border-t-[#5D7052] rounded-full animate-spin"></div>
      <span className="text-xs font-bold text-[#78786C] uppercase tracking-wider">{label}</span>
    </div>
  );
};

// --- BREADCRUMBS ---
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-xs text-[#78786C] mb-2 font-medium">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span>/</span>}
          {item.href ? (
            <a href={item.href} className="hover:text-[#5D7052] transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-[#2C2C24] font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// --- PAGE HEADER ---
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#DED8CF]">
      <div>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-3xl font-bold font-heading text-[#2C2C24]">{title}</h1>
        {subtitle && <p className="text-sm text-[#78786C] mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};
