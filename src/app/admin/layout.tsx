import React from "react";
import { AuthenticatedShell } from "@/components/layout/AuthenticatedShell";

export const metadata = {
  title: "INFURNUS | Admin Panel",
  description: "Administrative management console",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
