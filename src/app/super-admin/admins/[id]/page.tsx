import React from "react";
import { MOCK_ADMIN_RECORDS } from "@/lib/adminData";
import { AdminDetailsView } from "./AdminDetailsView";

interface AdminDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminDetailsPage({ params }: AdminDetailsPageProps) {
  const { id } = await params;
  const admin = MOCK_ADMIN_RECORDS.find((a) => a.id === id) || MOCK_ADMIN_RECORDS[0];

  return <AdminDetailsView admin={admin} />;
}
