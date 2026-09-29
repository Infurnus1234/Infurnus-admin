// ------------------- VEHICLE TYPES -------------------
export interface DetailedVehicle {
  id: string;
  registrationPlate: string;
  model: string;
  make: string;
  year: number;
  vin: string;
  type: "EV Sedan" | "Hybrid SUV" | "Standard Sedan" | "Luxury Van";
  category: "Eco" | "Premium" | "XL" | "Comfort";
  owner: "EcoMove Mobility" | "Individual Owner" | "Fleet Owned";
  partnerName: string;
  fleetName: string;
  assignedDriver: {
    id: string;
    name: string;
    phone: string;
  };
  location: {
    city: string;
    district: string;
    state: string;
    coordinates: string;
  };
  availability: "Available" | "On Ride" | "Reserved" | "Unavailable";
  maintenanceStatus: "Good" | "Due Soon" | "In Service" | "Critical";
  operationalStatus: "Active" | "Suspended" | "Decommissioned";
  
  // Details fields
  compliance: {
    insuranceExpiry: string;
    pollutionCertExpiry: string;
    permitType: string;
  };
  currentRide?: {
    rideId: string;
    passenger: string;
    destination: string;
    eta: string;
  };
  maintenanceHistory: {
    date: string;
    type: string;
    cost: string;
    provider: string;
  }[];
  assignmentHistory: {
    date: string;
    driverName: string;
    type: string;
  }[];
  rideHistory: {
    id: string;
    date: string;
    distance: string;
    fare: string;
  }[];
  statusHistory: {
    date: string;
    status: string;
    reason: string;
  }[];
}

// ------------------- PARTNER TYPES -------------------
export interface DetailedPartner {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  fleetCount: number;
  vehicleCount: number;
  driverCount: number;
  city: string;
  country: string;
  status: "Active" | "Under Review" | "Suspended";
  performanceScore: number;
  contractExpiry: string;

  fleetsList: { id: string; name: string; vehicleCount: number }[];
  vehiclesList: { id: string; plate: string; model: string }[];
  driversList: { id: string; name: string; status: string }[];
  activities: { date: string; action: string }[];
}

// ------------------- FLEET TYPES -------------------
export interface DetailedFleet {
  id: string;
  name: string;
  code: string;
  partnerName: string;
  managerName: string;
  vehicleCount: number;
  driverCount: number;
  city: string;
  district: string;
  status: "Active" | "Inactive" | "Suspended";
  utilizationRate: number;
  onTimeRate: number;

  vehiclesList: { id: string; plate: string; model: string; status: string }[];
  driversList: { id: string; name: string; rating: number }[];
  activityLogs: { date: string; event: string }[];
}

// ------------------- MOCK DATA -------------------
export const MOCK_VEHICLES: DetailedVehicle[] = [
  {
    id: "VEH-901",
    registrationPlate: "B-IN 4022",
    model: "Tesla Model 3",
    make: "Tesla",
    year: 2024,
    vin: "5YJ3E1EA8NF908124",
    type: "EV Sedan",
    category: "Eco",
    owner: "EcoMove Mobility",
    partnerName: "EcoMove Mobility",
    fleetName: "Berlin Express",
    assignedDriver: { id: "DRV-1001", name: "Hans Gruber", phone: "+49 152 8899 123" },
    location: { city: "Berlin", district: "Mitte", state: "Berlin", coordinates: "52.5200° N, 13.4050° E" },
    availability: "On Ride",
    maintenanceStatus: "Good",
    operationalStatus: "Active",
    compliance: { insuranceExpiry: "2027-01-15", pollutionCertExpiry: "N/A (EV)", permitType: "Commercial Taxi Permit A1" },
    currentRide: { rideId: "RD-8801", passenger: "Eleanor Vance", destination: "Brandenburg Gate", eta: "8 mins" },
    maintenanceHistory: [
      { date: "2026-06-10", type: "Annual EV Battery Diagnostic & Tire Rotation", cost: "€320.00", provider: "Tesla Berlin Service Center" },
    ],
    assignmentHistory: [
      { date: "2025-01-12", driverName: "Hans Gruber", type: "Primary Driver Assignment" },
    ],
    rideHistory: [
      { id: "RD-8801", date: "2026-09-29", distance: "6.4 km", fare: "€24.50" },
      { id: "RD-8790", date: "2026-09-29", distance: "4.2 km", fare: "€18.20" },
    ],
    statusHistory: [
      { date: "2024-03-10", status: "Active", reason: "Vehicle Onboarded into Berlin Express Fleet" },
    ],
  },
  {
    id: "VEH-902",
    registrationPlate: "M-INF 8812",
    model: "Toyota RAV4 Hybrid",
    make: "Toyota",
    year: 2023,
    vin: "JTEER5BF9K0982141",
    type: "Hybrid SUV",
    category: "Premium",
    owner: "Fleet Owned",
    partnerName: "TransCity GmbH",
    fleetName: "Munich Fleet Alpha",
    assignedDriver: { id: "DRV-1002", name: "Stefan Meyer", phone: "+49 170 1234 567" },
    location: { city: "Munich", district: "Schwabing", state: "Bavaria", coordinates: "48.1371° N, 11.5754° E" },
    availability: "Available",
    maintenanceStatus: "Due Soon",
    operationalStatus: "Active",
    compliance: { insuranceExpiry: "2026-11-20", pollutionCertExpiry: "2026-11-20", permitType: "Commercial SUV Permit" },
    maintenanceHistory: [
      { date: "2026-02-15", type: "Oil Change & Brake Inspection", cost: "€180.00", provider: "Toyota Munich Service" },
    ],
    assignmentHistory: [
      { date: "2024-08-01", driverName: "Stefan Meyer", type: "Primary Driver Assignment" },
    ],
    rideHistory: [
      { id: "RD-8410", date: "2026-09-28", distance: "12.8 km", fare: "€32.00" },
    ],
    statusHistory: [
      { date: "2024-08-01", status: "Active", reason: "Vehicle Added" },
    ],
  },
];

export const MOCK_PARTNERS: DetailedPartner[] = [
  {
    id: "PTR-ECO-09",
    name: "EcoMove Mobility",
    code: "ECO-MOB",
    email: "partner@ecomove.de",
    phone: "+49 30 900 1234",
    fleetCount: 4,
    vehicleCount: 142,
    driverCount: 168,
    city: "Berlin",
    country: "Germany",
    status: "Active",
    performanceScore: 98.2,
    contractExpiry: "2028-12-31",
    fleetsList: [
      { id: "FLT-BER-01", name: "Berlin Express", vehicleCount: 45 },
      { id: "FLT-BER-02", name: "Berlin North Electric", vehicleCount: 38 },
    ],
    vehiclesList: [
      { id: "VEH-901", plate: "B-IN 4022", model: "Tesla Model 3" },
    ],
    driversList: [
      { id: "DRV-1001", name: "Hans Gruber", status: "Active" },
    ],
    activities: [
      { date: "2026-09-20", action: "Partner Contract Renewed for 24 Months" },
    ],
  },
  {
    id: "PTR-TRN-04",
    name: "TransCity GmbH",
    code: "TRN-CITY",
    email: "contact@transcity.de",
    phone: "+49 89 440 9876",
    fleetCount: 3,
    vehicleCount: 98,
    driverCount: 110,
    city: "Munich",
    country: "Germany",
    status: "Active",
    performanceScore: 94.5,
    contractExpiry: "2027-06-30",
    fleetsList: [
      { id: "FLT-MUN-02", name: "Munich Fleet Alpha", vehicleCount: 32 },
    ],
    vehiclesList: [
      { id: "VEH-902", plate: "M-INF 8812", model: "Toyota RAV4 Hybrid" },
    ],
    driversList: [
      { id: "DRV-1002", name: "Stefan Meyer", status: "Active" },
    ],
    activities: [
      { date: "2026-09-15", action: "Added 10 New Hybrid SUV Vehicles" },
    ],
  },
];

export const MOCK_FLEETS: DetailedFleet[] = [
  {
    id: "FLT-BER-01",
    name: "Berlin Express",
    code: "BER-EXP",
    partnerName: "EcoMove Mobility",
    managerName: "Klaus Weber",
    vehicleCount: 45,
    driverCount: 52,
    city: "Berlin",
    district: "Mitte",
    status: "Active",
    utilizationRate: 91.5,
    onTimeRate: 98.4,
    vehiclesList: [
      { id: "VEH-901", plate: "B-IN 4022", model: "Tesla Model 3", status: "Active" },
    ],
    driversList: [
      { id: "DRV-1001", name: "Hans Gruber", rating: 4.9 },
    ],
    activityLogs: [
      { date: "2026-09-28", event: "Achieved 98.4% On-time Dispatch Score" },
    ],
  },
  {
    id: "FLT-MUN-02",
    name: "Munich Fleet Alpha",
    code: "MUN-ALPHA",
    partnerName: "TransCity GmbH",
    managerName: "Greta Schmidt",
    vehicleCount: 32,
    driverCount: 38,
    city: "Munich",
    district: "Schwabing",
    status: "Active",
    utilizationRate: 88.0,
    onTimeRate: 96.2,
    vehiclesList: [
      { id: "VEH-902", plate: "M-INF 8812", model: "Toyota RAV4 Hybrid", status: "Active" },
    ],
    driversList: [
      { id: "DRV-1002", name: "Stefan Meyer", rating: 4.7 },
    ],
    activityLogs: [
      { date: "2026-09-25", event: "Fleet Inspection Passed" },
    ],
  },
];
