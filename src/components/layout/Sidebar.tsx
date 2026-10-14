"use client";

import React, { useEffect, useRef } from "react";
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
} from "lucide-react";
import { UserRole } from "@/types";
import { getGroupedNavItemsForRole } from "@/config/navigation";

export interface SidebarProps {
  role: UserRole;
  userPermissions?: string[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const renderNavIcon = (iconName?: string) => {
  const iconProps = {
    className: "w-4 h-4 shrink-0  ",
  };
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
  const drawer = useRef<HTMLElement>(null);
  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width:1024px)");
    if (!isOpen || breakpoint.matches) return;
    const resize = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    breakpoint.addEventListener("change", resize);
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = drawer.current;
    panel?.querySelector<HTMLButtonElement>("button")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab") {
        const elements = Array.from(
          panel?.querySelectorAll<HTMLElement>(
            "a[href],button:not(:disabled),summary",
          ) || [],
        ).filter((element) => element.getClientRects().length > 0);
        const first = elements[0],
          last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      breakpoint.removeEventListener("change", resize);
      previous?.focus();
    };
  }, [isOpen, onClose]);
  const pathname = usePathname();
  const groupedSections = getGroupedNavItemsForRole(role, userPermissions);

  return (
    <>
      <div
        className={`admin-nav-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={drawer}
        aria-label="Main navigation"
        className={`admin-sidebar ${isOpen ? "is-open" : ""} ${className}`}
      >
        <div className="admin-brand">
          <Link href={`/${role}`}>
            <Flame size={30} aria-hidden="true" />
            <span>INFURNUS</span>
          </Link>
          <button
            className="admin-nav-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="admin-nav-scroll">
          {groupedSections.map((group) => (
            <details className="admin-nav-group" key={group.section} open>
              <summary>{group.section}</summary>
              <div>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== `/${role}` &&
                      pathname.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`admin-nav-link ${isActive ? "is-active" : ""}`}
                      onClick={onClose}
                    >
                      {renderNavIcon(item.icon)}
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </details>
          ))}
        </nav>
        <div className="admin-nav-footer">
          <Shield size={16} />
          <span>
            {role === "super-admin" ? "Super Admin" : "Admin"} workspace
            <br />
            <small>Backend-authorized access</small>
          </span>
        </div>
      </aside>
    </>
  );
};
