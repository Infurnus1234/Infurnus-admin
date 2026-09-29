import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_DETAILED_DRIVERS } from "@/lib/driverData";
import { DriverDetailsView } from "./DriverDetailsView";

interface DriverDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: DriverDetailsPageProps) {
  const { id } = await params;
  const driver = MOCK_DETAILED_DRIVERS.find((d) => d.id === id);
  return {
    title: `INFURNUS | Driver ${driver ? driver.name : id}`,
  };
}

export default async function DriverDetailsPage({ params }: DriverDetailsPageProps) {
  const { id } = await params;
  const driver = MOCK_DETAILED_DRIVERS.find((d) => d.id === id) || MOCK_DETAILED_DRIVERS[0];

  return <DriverDetailsView driver={driver} />;
}
