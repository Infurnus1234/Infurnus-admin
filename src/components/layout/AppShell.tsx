"use client";

import React, { useCallback, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { UserProfile, UserRole } from "@/types";

export interface AppShellProps {
  role: UserRole;
  user: UserProfile;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ role, user, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2C2C24] flex flex-col font-sans bg-grain selection:bg-[#E6DCCD] selection:text-[#5D7052]">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Sidebar
        role={role}
        userPermissions={user.permissions}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main App Container */}
      <div
        inert={isSidebarOpen}
        className="lg:pl-72 flex flex-col flex-1 min-w-0 transition-all duration-300"
      >
        {/* Topbar Navigation Bar */}
        <Topbar
          user={user}
          onMobileMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Main Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
