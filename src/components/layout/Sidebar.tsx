"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Car,
  UserCheck,
  Briefcase,
  Truck,
  MapPin,
  Wallet,
  Ticket,
  Bell,
  HelpCircle,
  BarChart3,
  Shield,
  Key,
  Layers,
  CheckSquare,
  FileText,
  Cpu,
  Sliders,
  Settings,
  Flame,
  X,
  Lock,
} from "lucide-react";
import { UserRole, AdminPermission } from "@/types";
import { getGroupedNavItemsForRole } from "@/config/navigation";

export interface SidebarProps {
  role: UserRole;
  userPermissions?: AdminPermission[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const renderNavIcon = (iconName?: string) => {
  const iconProps = { className: "w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" };
  switch (iconName) {
    case "dashboard":
      return <LayoutDashboard {...iconProps} />;
    case "users":
      return <Users {...iconProps} />;
    case "steering":
    case "car":
      return <Car {...iconProps} />;
    case "user-check":
      return <UserCheck {...iconProps} />;
    case "briefcase":
      return <Briefcase {...iconProps} />;
    case "truck":
      return <Truck {...iconProps} />;
    case "map-pin":
      return <MapPin {...iconProps} />;
    case "wallet":
      return <Wallet {...iconProps} />;
    case "ticket":
      return <Ticket {...iconProps} />;
    case "bell":
      return <Bell {...iconProps} />;
    case "help-circle":
      return <HelpCircle {...iconProps} />;
    case "bar-chart":
      return <BarChart3 {...iconProps} />;
    case "user-shield":
    case "shield":
      return <Shield {...iconProps} />;
    case "key":
      return <Key {...iconProps} />;
    case "layers":
      return <Layers {...iconProps} />;
    case "check-square":
      return <CheckSquare {...iconProps} />;
    case "file-text":
      return <FileText {...iconProps} />;
    case "cpu":
      return <Cpu {...iconProps} />;
    case "toggle-right":
      return <Sliders {...iconProps} />;
    case "settings":
      return <Settings {...iconProps} />;
    default:
      return <Layers {...iconProps} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  userPermissions,
  isOpen,
  onClose,
  className = "",
}) => {
  const pathname = usePathname();
  const groupedSections = getGroupedNavItemsForRole(role, userPermissions);

  return (
    <>
      {/* Mobile Drawer Backdrop overlay with blur */}
      <div
        className={`fixed inset-0 z-40 bg-[#2C2C24]/30 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Desktop & Mobile Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#FDFCF8] bg-grain border-r border-[#DED8CF] flex flex-col justify-between transition-transform duration-400 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-organic-lg" : "-translate-x-full"
        } ${className}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="p-6 shrink-0 flex items-center justify-between border-b border-[#DED8CF]/70">
            <Link href={`/${role}`} className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#5D7052] flex items-center justify-center text-[#F3F4F1] shadow-moss group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight text-[#2C2C24]">
                  INFURNUS
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#C18C5D]">
                    {role === "super-admin" ? "Super Admin" : "Admin Console"}
                  </span>
                  {role === "admin" && (
                    <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded-full bg-[#E6DCCD] text-[#78786C]">
                      <Lock className="w-2.5 h-2.5" /> Scoped
                    </span>
                  )}
                </div>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-[#78786C] hover:bg-[#F0EBE5] transition-colors focus:outline-none"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[#DED8CF]">
            {groupedSections.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1.5">
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#78786C]/80 font-sans">
                  {group.section}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== `/${role}` && pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300 ${
                          isActive
                            ? "bg-[#5D7052] text-[#F3F4F1] shadow-moss font-bold"
                            : "text-[#78786C] hover:bg-[#F0EBE5] hover:text-[#2C2C24]"
                        }`}
                      >
                        <span className={isActive ? "text-[#F3F4F1]" : "text-[#78786C] group-hover:text-[#5D7052]"}>
                          {renderNavIcon(item.icon)}
                        </span>
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              isActive
                                ? "bg-[#C18C5D] text-white"
                                : "bg-[#E6DCCD] text-[#2C2C24]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer Context */}
          <div className="p-4 shrink-0 border-t border-[#DED8CF]/70 bg-[#F0EBE5]/50">
            <div className="p-3 rounded-2xl bg-[#FDFCF8] border border-[#DED8CF] text-center shadow-organic-sm">
              <p className="text-xs font-bold text-[#2C2C24]">Permission Engine Active</p>
              <p className="text-[10px] text-[#78786C] mt-0.5">
                {role === "super-admin"
                  ? "Full System Privileges"
                  : `${userPermissions?.length || 0} Frontend Scopes`}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
