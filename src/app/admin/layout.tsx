import React from "react";
import { AppShell } from "@/components/layout/AppShell";

export const metadata = {
  title: "INFURNUS | Admin Panel",
  description: "Administrative management console",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell role="admin">{children}</AppShell>;
}
