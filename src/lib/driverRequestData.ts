export type DriverRequestType =
  | "DRIVER_ADDITION"
  | "DRIVER_DELETION"
  | "DRIVER_UPDATE"
  | "DRIVER_VEHICLE_CHANGE"
  | "DRIVER_FLEET_CHANGE"
  | "DRIVER_PARTNER_CHANGE";

export type DriverRequestStatus =
  | "Pending"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Changes Requested"
  | "Cancelled"
  | "Expired";

export interface DriverApprovalRequest {
  id: string;
  driverName: string;
  driverEmail: string;
  driverAvatar?: string;
  driverPhone: string;
  requestType: DriverRequestType;
  submittedBy: {
    name: string;
    role: string;
  };
  submittedDate: string;
  status: DriverRequestStatus;
  priority: "High" | "Medium" | "Low";
  reasonNotes: string;

  // Review Details
  details: {
    contact: {
      phone: string;
      email: string;
      emergency: string;
    };
    documents: {
      title: string;
      status: "Verified" | "Pending" | "Missing";
    }[];
    verification: {
      kycStatus: "Passed" | "Pending";
      policeClearance: "Passed" | "Pending";
    };
    vehicle: {
      model: string;
      plate: string;
      type: string;
    };
    partner: {
      name: string;
      id: string;
    };
    fleet: {
      name: string;
      id: string;
    };
    location: {
      city: string;
      district: string;
    };
    compliance: {
      backgroundCheck: "Cleared" | "Flagged";
      drugTest: "Cleared" | "Pending";
    };
    previousHistory: {
      id: string;
      type: string;
      date: string;
      status: string;
    }[];
  };
}

export const MOCK_DRIVER_REQUESTS: DriverApprovalRequest[] = [
  {
    id: "REQ-D-1090",
    driverName: "Viktor Petrov",
    driverEmail: "v.petrov@infurnus.org",
    driverAvatar: "VP",
    driverPhone: "+49 151 888 2211",
    requestType: "DRIVER_ADDITION",
    submittedBy: { name: "Marcus Wright", role: "Regional Onboarding Admin" },
    submittedDate: "2026-09-29 14:30",
    status: "Pending",
    priority: "High",
    reasonNotes: "New driver application with completed commercial background check.",
    details: {
      contact: { phone: "+49 151 888 2211", email: "v.petrov@infurnus.org", emergency: "+49 151 999 1100 (Wife)" },
      documents: [
        { title: "Driver License Class B", status: "Verified" },
        { title: "Commercial Transport Permit", status: "Verified" },
        { title: "Police Clearance Certificate", status: "Pending" },
      ],
      verification: { kycStatus: "Passed", policeClearance: "Pending" },
      vehicle: { model: "Tesla Model Y", plate: "B-IN 9091", type: "EV SUV" },
      partner: { name: "EcoMove Mobility", id: "PTR-ECO-09" },
      fleet: { name: "Berlin Express", id: "FLT-BER-01" },
      location: { city: "Berlin", district: "Mitte" },
      compliance: { backgroundCheck: "Cleared", drugTest: "Cleared" },
      previousHistory: [],
    },
  },
  {
    id: "REQ-D-1088",
    driverName: "Astrid Lindgren",
    driverEmail: "astrid.l@infurnus.org",
    driverAvatar: "AL",
    driverPhone: "+49 175 3322 110",
    requestType: "DRIVER_DELETION",
    submittedBy: { name: "Sophia Martinez", role: "Compliance Officer" },
    submittedDate: "2026-09-28 09:15",
    status: "Under Review",
    priority: "High",
    reasonNotes: "Compliance deletion request following expired license and high cancellation rate.",
    details: {
      contact: { phone: "+49 175 3322 110", email: "astrid.l@infurnus.org", emergency: "+49 175 6655 443" },
      documents: [
        { title: "Driver License", status: "Missing" },
      ],
      verification: { kycStatus: "Pending", policeClearance: "Pending" },
      vehicle: { model: "Volkswagen Passat", plate: "HH-IN 102", type: "Standard Sedan" },
      partner: { name: "UrbanFleet Systems", id: "PTR-URB-01" },
      fleet: { name: "Nordic Trans", id: "FLT-HAM-03" },
      location: { city: "Hamburg", district: "Altona" },
      compliance: { backgroundCheck: "Flagged", drugTest: "Pending" },
      previousHistory: [
        { id: "REQ-D-092", type: "DRIVER_VEHICLE_CHANGE", date: "2025-02-14", status: "Approved" },
      ],
    },
  },
  {
    id: "REQ-D-1082",
    driverName: "Stefan Meyer",
    driverEmail: "stefan.meyer@infurnus.org",
    driverAvatar: "SM",
    driverPhone: "+49 170 1234 567",
    requestType: "DRIVER_VEHICLE_CHANGE",
    submittedBy: { name: "Greta Schmidt", role: "Fleet Manager" },
    submittedDate: "2026-09-27 16:45",
    status: "Approved",
    priority: "Medium",
    reasonNotes: "Vehicle upgrade request from Hybrid SUV to EV Luxury Sedan.",
    details: {
      contact: { phone: "+49 170 1234 567", email: "stefan.meyer@infurnus.org", emergency: "+49 170 8877 665" },
      documents: [
        { title: "Vehicle Registration", status: "Verified" },
        { title: "EV Safety Pass", status: "Verified" },
      ],
      verification: { kycStatus: "Passed", policeClearance: "Passed" },
      vehicle: { model: "BMW i4 EV", plate: "M-INF 9901", type: "EV Sedan" },
      partner: { name: "TransCity GmbH", id: "PTR-TRN-04" },
      fleet: { name: "Munich Fleet Alpha", id: "FLT-MUN-02" },
      location: { city: "Munich", district: "Schwabing" },
      compliance: { backgroundCheck: "Cleared", drugTest: "Cleared" },
      previousHistory: [
        { id: "REQ-D-781", type: "DRIVER_ADDITION", date: "2024-08-01", status: "Approved" },
      ],
    },
  },
  {
    id: "REQ-D-1075",
    driverName: "Klaus Hoffmann",
    driverEmail: "klaus.h@infurnus.org",
    driverAvatar: "KH",
    driverPhone: "+49 162 4455 667",
    requestType: "DRIVER_FLEET_CHANGE",
    submittedBy: { name: "David Chen", role: "Regional Admin" },
    submittedDate: "2026-09-25 11:20",
    status: "Changes Requested",
    priority: "Low",
    reasonNotes: "Requested transfer from Frankfurt Express to Rhine Fleet Alpha.",
    details: {
      contact: { phone: "+49 162 4455 667", email: "klaus.h@infurnus.org", emergency: "+49 162 999 888" },
      documents: [
        { title: "Fleet Transfer Consent", status: "Pending" },
      ],
      verification: { kycStatus: "Passed", policeClearance: "Passed" },
      vehicle: { model: "Audi A6", plate: "F-IN 401", type: "Standard Sedan" },
      partner: { name: "TransCity GmbH", id: "PTR-TRN-04" },
      fleet: { name: "Rhine Fleet Alpha", id: "FLT-RHI-05" },
      location: { city: "Frankfurt", district: "Innenstadt" },
      compliance: { backgroundCheck: "Cleared", drugTest: "Cleared" },
      previousHistory: [],
    },
  },
  {
    id: "REQ-D-1060",
    driverName: "Elena Weber",
    driverEmail: "elena.w@infurnus.org",
    driverAvatar: "EW",
    driverPhone: "+49 171 1122 334",
    requestType: "DRIVER_PARTNER_CHANGE",
    submittedBy: { name: "Elena Rostova", role: "Operations Lead" },
    submittedDate: "2026-09-20 10:00",
    status: "Rejected",
    priority: "Medium",
    reasonNotes: "Partner change rejected due to active partner contract exclusivity clause.",
    details: {
      contact: { phone: "+49 171 1122 334", email: "elena.w@infurnus.org", emergency: "+49 171 000 111" },
      documents: [
        { title: "Partner Contract Exclusivity", status: "Verified" },
      ],
      verification: { kycStatus: "Passed", policeClearance: "Passed" },
      vehicle: { model: "Mercedes EQE", plate: "K-IN 880", type: "EV Sedan" },
      partner: { name: "EcoMove Mobility", id: "PTR-ECO-09" },
      fleet: { name: "Cologne Fleet", id: "FLT-CGN-01" },
      location: { city: "Cologne", district: "Deutz" },
      compliance: { backgroundCheck: "Cleared", drugTest: "Cleared" },
      previousHistory: [],
    },
  },
];
