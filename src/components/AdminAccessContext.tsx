"use client";
import { createContext, useContext } from "react";
const AdminAccess = createContext<{
  role: string;
  permissions: readonly string[];
}>({ role: "admin", permissions: [] });
export const AdminAccessProvider = AdminAccess.Provider;
export function useAdminAccess() {
  const access = useContext(AdminAccess);
  return (permission: string) =>
    access.role === "super-admin" || access.permissions.includes(permission);
}
