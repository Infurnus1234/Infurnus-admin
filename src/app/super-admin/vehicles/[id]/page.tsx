import React from "react";
import Link from "next/link";
import { MOCK_VEHICLES } from "@/lib/fleetVehiclePartnerData";
import { PageHeader, Button, Badge, Card, CardHeader, CardTitle, CardContent, Tabs } from "@/components";
import { ArrowLeft, Car, ShieldCheck, MapPin, User, Activity, Clock, Wrench, FileText } from "lucide-react";

interface VehicleDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VehicleDetailPage({ params }: VehicleDetailsProps) {
  const { id } = await params;
  const vehicle = MOCK_VEHICLES.find((v) => v.id === id) || MOCK_VEHICLES[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <PageHeader
        title={`${vehicle.make} ${vehicle.model} (${vehicle.registrationPlate})`}
        description={`VIN: ${vehicle.vin} • Fleet: ${vehicle.fleetName} (${vehicle.partnerName})`}
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin" },
          { label: "Vehicles", href: "/super-admin/vehicles" },
          { label: vehicle.registrationPlate },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={vehicle.operationalStatus === "Active" ? "moss" : "destructive"}>
              {vehicle.operationalStatus}
            </Badge>
            <Badge variant={vehicle.availability === "Available" ? "moss" : "terracotta"}>
              {vehicle.availability}
            </Badge>
            <Link href="/super-admin/vehicles">
              <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Vehicles
              </Button>
            </Link>
          </div>
        }
      />

      {/* Grid of 12 Required Vehicle Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1, 2 & 8: Identity, Ownership & Operational Status */}
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-[#5D7052]" /> 1, 2 & 8. Identity & Ownership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-[#78786C] block">Registration Plate</span>
              <span className="font-bold text-sm text-[#2C2C24]">{vehicle.registrationPlate}</span>
            </div>
            <div>
              <span className="text-[#78786C] block">Vehicle Model / Year</span>
              <span className="font-semibold text-[#2C2C24]">{vehicle.make} {vehicle.model} ({vehicle.year})</span>
            </div>
            <div>
              <span className="text-[#78786C] block">VIN Identifier</span>
              <span className="font-mono text-[#5D7052]">{vehicle.vin}</span>
            </div>
            <div>
              <span className="text-[#78786C] block">Ownership Type</span>
              <span className="font-semibold text-[#2C2C24]">{vehicle.owner}</span>
            </div>
            <div>
              <span className="text-[#78786C] block">Vehicle Type & Category</span>
              <span className="font-bold text-[#C18C5D]">{vehicle.type} ({vehicle.category})</span>
            </div>
          </CardContent>
        </Card>

        {/* Section 3 & 4: Geography & Compliance */}
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C18C5D]" /> 3 & 4. Geography & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-[#78786C] block">Assigned Location</span>
              <span className="font-semibold text-[#2C2C24]">{vehicle.location.city}, {vehicle.location.district} ({vehicle.location.state})</span>
            </div>
            <div>
              <span className="text-[#78786C] block">GPS Coordinates</span>
              <span className="font-mono text-[#5D7052]">{vehicle.location.coordinates}</span>
            </div>
            <div className="pt-2 border-t border-[#DED8CF]">
              <span className="text-[#78786C] block">Insurance Expiry</span>
              <span className="font-semibold text-[#2C2C24]">{vehicle.compliance.insuranceExpiry}</span>
            </div>
            <div>
              <span className="text-[#78786C] block">Permit Type</span>
              <span className="font-semibold text-[#2C2C24]">{vehicle.compliance.permitType}</span>
            </div>
          </CardContent>
        </Card>

        {/* Section 5, 6 & 7: Assigned Driver, Current Ride & Maintenance */}
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#5D7052]" /> 5, 6 & 7. Driver, Ride & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-[#78786C] block">Assigned Primary Driver</span>
              <span className="font-bold text-sm text-[#5D7052]">{vehicle.assignedDriver.name}</span>
              <span className="text-[#78786C] font-mono block">{vehicle.assignedDriver.phone}</span>
            </div>

            {vehicle.currentRide ? (
              <div className="p-3 rounded-2xl bg-[#E6DCCD]/40 border border-[#DED8CF] space-y-1">
                <span className="font-bold text-[#2C2C24]">Active Ride: {vehicle.currentRide.rideId}</span>
                <p className="text-[#78786C]">Dest: {vehicle.currentRide.destination} (ETA: {vehicle.currentRide.eta})</p>
              </div>
            ) : (
              <p className="text-[#78786C]">No active ride dispatch at the moment.</p>
            )}

            <div className="pt-2 border-t border-[#DED8CF]">
              <span className="text-[#78786C] block">Maintenance Health</span>
              <Badge variant={vehicle.maintenanceStatus === "Good" ? "moss" : "terracotta"}>
                {vehicle.maintenanceStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 9, 10, 11 & 12: Assignment, Ride, Maintenance & Status Histories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#C18C5D]" /> 11. Maintenance History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {vehicle.maintenanceHistory.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#2C2C24]">
                  <span>{m.type}</span>
                  <span className="text-[#5D7052]">{m.cost}</span>
                </div>
                <p className="text-[#78786C]">{m.provider} • Date: {m.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card variant="elevated" rounded="3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#5D7052]" /> 9, 10 & 12. Histories & Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <h4 className="font-bold text-[#2C2C24] mb-1">Assignment History</h4>
              {vehicle.assignmentHistory.map((a, i) => (
                <p key={i} className="text-[#78786C]">{a.date}: {a.driverName} ({a.type})</p>
              ))}
            </div>
            <div className="pt-2 border-t border-[#DED8CF]">
              <h4 className="font-bold text-[#2C2C24] mb-1">Status Audit History</h4>
              {vehicle.statusHistory.map((s, i) => (
                <p key={i} className="text-[#78786C]">{s.date}: Status set to {s.status} ({s.reason})</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
