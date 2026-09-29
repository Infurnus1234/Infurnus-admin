import React from "react";
import Link from "next/link";
import { MOCK_FLEETS } from "@/lib/fleetVehiclePartnerData";
import { PageHeader, Button, Badge, Card, CardHeader, CardTitle, CardContent } from "@/components";
import { ArrowLeft, Layers, Car, Users, MapPin, Activity, TrendingUp, History } from "lucide-react";

interface FleetDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FleetDetailPage({ params }: FleetDetailsProps) {
  const { id } = await params;
  const fleet = MOCK_FLEETS.find((f) => f.id === id) || MOCK_FLEETS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title={`${fleet.name} (${fleet.code})`}
        description={`Fleet ID: ${fleet.id} • Partner: ${fleet.partnerName} • Manager: ${fleet.managerName}`}
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Fleets", href: "/super-admin/fleets" },
          { label: fleet.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Badge variant="moss">{fleet.status}</Badge>
            <Link href="/super-admin/fleets">
              <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Fleets
              </Button>
            </Link>
          </div>
        }
      />

      {/* Grid of 7 Required Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#5D7052]" /> 1 & 4. Overview & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-[#78786C] block">Fleet Name / Code</span>
              <span className="font-bold text-sm text-[#2C2C24]">{fleet.name} ({fleet.code})</span>
            </div>
            <div>
              <span className="text-[#78786C] block">Parent Partner</span>
              <span className="font-semibold text-[#C18C5D]">{fleet.partnerName}</span>
            </div>
            <div>
              <span className="text-[#78786C] block">Fleet Manager</span>
              <span className="font-semibold text-[#2C2C24]">{fleet.managerName}</span>
            </div>
            <div className="pt-2 border-t border-[#DED8CF]">
              <span className="text-[#78786C] block">Geographic Operating Zone</span>
              <span className="font-semibold text-[#2C2C24]">{fleet.city}, {fleet.district}</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#C18C5D]" /> 6. Fleet Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F0EBE5] border border-[#DED8CF]">
                <p className="text-xs text-[#78786C] font-bold uppercase">Utilization Rate</p>
                <p className="font-heading text-2xl font-extrabold text-[#5D7052] mt-1">{fleet.utilizationRate}%</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F0EBE5] border border-[#DED8CF]">
                <p className="text-xs text-[#78786C] font-bold uppercase">On-Time Dispatch</p>
                <p className="font-heading text-2xl font-extrabold text-[#2C2C24] mt-1">{fleet.onTimeRate}%</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#DED8CF] flex justify-around text-xs font-bold text-[#2C2C24]">
              <span>{fleet.vehicleCount} Vehicles Allocated</span>
              <span>{fleet.driverCount} Active Drivers</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#5D7052]" /> 5 & 7. Activity & History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {fleet.activityLogs.map((log, i) => (
              <div key={i} className="p-3 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                <p className="font-bold text-[#2C2C24]">{log.event}</p>
                <p className="text-[10px] text-[#78786C]">{log.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-[#5D7052]" /> 2. Vehicles in Fleet ({fleet.vehiclesList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {fleet.vehiclesList.map((v) => (
              <div key={v.id} className="p-3 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C2C24]">{v.plate}</p>
                  <p className="text-[10px] text-[#78786C]">{v.model}</p>
                </div>
                <Badge variant="moss" size="sm">{v.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#C18C5D]" /> 3. Drivers in Fleet ({fleet.driversList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {fleet.driversList.map((d) => (
              <div key={d.id} className="p-3 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C2C24]">{d.name}</p>
                  <p className="text-[10px] text-[#78786C] font-mono">{d.id}</p>
                </div>
                <span className="font-bold text-[#5D7052]">★ {d.rating}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
