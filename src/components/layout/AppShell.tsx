"use client";

import React, { useCallback, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { UserProfile, UserRole } from "@/types";
import { AdminAccessProvider } from "../AdminAccessContext";

export interface AppShellProps {
  role: UserRole;
  user: UserProfile;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ role, user, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  return (
    <AdminAccessProvider value={{ role, permissions: user.permissions || [] }}>
      <div className="admin-app-shell">
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
        <div inert={isSidebarOpen} className="admin-app-content">
          {/* Topbar Navigation Bar */}
          <Topbar
            user={user}
            onMobileMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
          />

          {/* Main Content Area */}
          <main id="main-content" tabIndex={-1} className="admin-main">
            {children}
          </main>
        </div>
      </div>
    </AdminAccessProvider>
  );
};
