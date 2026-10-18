"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { UserProfile, UserRole } from "@/types";
import { AdminAccessProvider } from "../AdminAccessContext";
import { useSidebarState } from "@/lib/use-sidebar-state";

export interface AppShellProps {
  role: UserRole;
  user: UserProfile;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ role, user, children }) => {
  const sidebar = useSidebarState(user.id || user.email, role);
  return (
    <AdminAccessProvider value={{ role, permissions: user.permissions || [] }}>
      <div className="admin-app-shell" data-sidebar-expanded={sidebar.expanded}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Sidebar
          role={role}
          userPermissions={user.permissions}
          isOpen={sidebar.expanded}
          onClose={sidebar.closeMobile}
          onToggle={sidebar.toggle}
        />

        {/* Main App Container */}
        <div inert={sidebar.inertContent} className="admin-app-content">
          {/* Topbar Navigation Bar */}
          <Topbar
            user={user}
            sidebarExpanded={sidebar.expanded}
            onSidebarToggle={sidebar.toggle}
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
