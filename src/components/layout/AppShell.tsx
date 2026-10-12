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
    <div className="min-h-screen bg-[#f5f6f5] text-[#202a25] flex flex-col font-sans selection:bg-[#dde9e1] selection:text-[#154b3d]">
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
        className="lg:pl-72 flex flex-col flex-1 min-w-0"
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
          className="min-w-0 flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
