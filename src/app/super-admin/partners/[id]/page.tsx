import React from "react";
import Link from "next/link";
import { MOCK_PARTNERS } from "@/lib/fleetVehiclePartnerData";
import { PageHeader, Button, Badge, Card, CardHeader, CardTitle, CardContent } from "@/components";
import { ArrowLeft, Building2, Layers, Car, Users, Activity, TrendingUp, History } from "lucide-react";

interface PartnerDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PartnerDetailPage({ params }: PartnerDetailsProps) {
  const { id } = await params;
  const partner = MOCK_PARTNERS.find((p) => p.id === id) || MOCK_PARTNERS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title={`${partner.name} (${partner.code})`}
        description={`Partner ID: ${partner.id} • ${partner.city}, ${partner.country}`}
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Partners", href: "/super-admin/partners" },
          { label: partner.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Badge variant="moss">{partner.status}</Badge>
            <Link href="/super-admin/partners">
              <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Partners
              </Button>
            </Link>
          </div>
        }
      />

      {/* Overview & Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#C18C5D]" /> 1. Overview & Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-[#78786C] block">Organization Name</span>
              <span className="font-bold text-sm text-[#2C2C24]">{partner.name}</span>
            </div>
            <div>
              <span className="text-[#78786C] block">Contact Email</span>
              <span className="font-mono font-semibold text-[#5D7052]">{partner.email}</span>
            </div>
            <div>
              <span className="text-[#78786C] block">Contact Phone</span>
              <span className="font-semibold text-[#2C2C24]">{partner.phone}</span>
            </div>
            <div>
              <span className="text-[#78786C] block">Contract Expiry</span>
              <span className="font-semibold text-[#2C2C24]">{partner.contractExpiry}</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#5D7052]" /> 6. Partner Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-[#F0EBE5] border border-[#DED8CF]">
              <p className="text-xs text-[#78786C] font-bold uppercase">Performance Score</p>
              <p className="font-heading text-3xl font-extrabold text-[#5D7052] mt-1">{partner.performanceScore} / 100</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-[#2C2C24]">
              <div className="p-2 rounded-xl bg-white border border-[#DED8CF]">
                <span className="text-[#78786C] text-[10px] block">Fleets</span>
                <span>{partner.fleetCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#DED8CF]">
                <span className="text-[#78786C] text-[10px] block">Vehicles</span>
                <span>{partner.vehicleCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#DED8CF]">
                <span className="text-[#78786C] text-[10px] block">Drivers</span>
                <span>{partner.driverCount}</span>
              </div>
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
            {partner.activities.map((act, i) => (
              <div key={i} className="p-3 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                <p className="font-bold text-[#2C2C24]">{act.action}</p>
                <p className="text-[10px] text-[#78786C]">{act.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Fleets, Vehicles & Drivers Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#5D7052]" /> 2. Partner Fleets ({partner.fleetsList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {partner.fleetsList.map((f) => (
              <div key={f.id} className="p-3 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C2C24]">{f.name}</p>
                  <p className="text-[10px] text-[#78786C] font-mono">{f.id}</p>
                </div>
                <Badge variant="sand" size="sm">{f.vehicleCount} Vehicles</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-[#C18C5D]" /> 3. Registered Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {partner.vehiclesList.map((v) => (
              <div key={v.id} className="p-3 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C2C24]">{v.plate}</p>
                  <p className="text-[10px] text-[#78786C]">{v.model}</p>
                </div>
                <Badge variant="moss" size="sm">Active</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#5D7052]" /> 4. Onboarded Drivers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {partner.driversList.map((d) => (
              <div key={d.id} className="p-3 rounded-2xl border border-[#DED8CF] bg-white flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C2C24]">{d.name}</p>
                  <p className="text-[10px] text-[#78786C] font-mono">{d.id}</p>
                </div>
                <Badge variant="moss" size="sm">{d.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
