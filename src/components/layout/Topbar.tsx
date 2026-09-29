"use client";

import React from "react";
import { Menu, Bell, Search, User, ShieldCheck } from "lucide-react";
import { UserProfile } from "@/types";
import { Dropdown } from "../ui/Dropdown";

export interface TopbarProps {
  user: UserProfile;
  onMobileMenuToggle: () => void;
  className?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  user,
  onMobileMenuToggle,
  className = "",
}) => {
  const profileDropdownItems = [
    {
      label: "My Profile",
      icon: <User className="w-4 h-4" />,
      onClick: () => console.log("Navigate to profile"),
    },
    {
      label: "System Settings",
      icon: <ShieldCheck className="w-4 h-4" />,
      onClick: () => console.log("Navigate to settings"),
    },
    {
      label: "Sign Out",
      destructive: true,
      onClick: () => console.log("Log out"),
    },
  ];

  return (
    <header
      className={`sticky top-0 z-30 h-20 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#DED8CF] px-4 sm:px-8 flex items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-2xl text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Input Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78786C]" />
          <input
            type="text"
            placeholder="Search resources, users, logs..."
            className="w-full bg-[#F0EBE5]/60 hover:bg-[#F0EBE5] border border-transparent focus:border-[#5D7052] rounded-full py-2 pl-10 pr-4 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Icon Button */}
        <button
          className="relative p-2.5 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition-colors focus:outline-none"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#C18C5D] rounded-full border-2 border-[#FDFCF8]" />
        </button>

        {/* User Profile Badge & Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-[#F0EBE5] border border-[#DED8CF] transition-colors text-left cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#5D7052] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-[#2C2C24] leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-[#78786C] font-semibold uppercase tracking-wider">
                  {user.role}
                </p>
              </div>
            </button>
          }
          items={profileDropdownItems}
        />
      </div>
    </header>
  );
};
