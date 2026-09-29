"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { UserProfile, UserRole, AdminPermission } from "@/types";
import { MOCK_ADMIN_PERMISSIONS } from "@/config/navigation";

export interface AppShellProps {
  role: UserRole;
  user?: UserProfile;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  role,
  user = {
    name: role === "super-admin" ? "Eleanor Vance" : "Julian Thorne",
    email: role === "super-admin" ? "eleanor@infurnus.org" : "j.thorne@infurnus.org",
    role: role,
    department: role === "super-admin" ? "Global System Control" : "Regional Logistics Admin",
    permissions: MOCK_ADMIN_PERMISSIONS,
  },
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2C2C24] flex flex-col font-sans bg-grain selection:bg-[#E6DCCD] selection:text-[#5D7052]">
      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <Sidebar
        role={role}
        userPermissions={user.permissions}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0 transition-all duration-300">
        {/* Topbar Navigation Bar */}
        <Topbar
          user={user}
          onMobileMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};
