import React from "react";
import { AuthenticatedShell } from "@/components/layout/AuthenticatedShell";

export const metadata = {
  title: "INFURNUS | Super Admin Portal",
  description: "Global system control & super administrative console",
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedShell superOnly>{children}</AuthenticatedShell>;
}
