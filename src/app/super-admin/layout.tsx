import React from "react";
import { AppShell } from "@/components/layout/AppShell";

export const metadata = {
  title: "INFURNUS | Super Admin Portal",
  description: "Global system control & super administrative console",
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell role="super-admin">{children}</AppShell>;
}
