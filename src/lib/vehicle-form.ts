export const emptyVehicleForm = {
  make: "",
  model: "",
  plateNumber: "",
  color: "",
  sector: "passenger",
  category: "",
  driverProfileId: "",
  ownerId: "",
  fuelRatePerKm: "",
  loadCapacityKg: "",
  manufacturingYear: "",
  fuelType: "",
  seatingCapacity: "",
  registrationDate: "",
  registrationExpiry: "",
  isCommercial: true,
  permitDetails: "",
};
export type VehicleForm = typeof emptyVehicleForm;
export function vehicleForm(record: Record<string, unknown>): VehicleForm {
  return Object.fromEntries(
    Object.entries(emptyVehicleForm).map(([key, value]) => [
      key,
      typeof value === "boolean"
        ? record[key] === true
        : record[key] == null
          ? ""
          : /Date$|Expiry$/.test(key)
            ? String(record[key]).slice(0, 10)
            : String(record[key]),
    ]),
  ) as VehicleForm;
}
export function vehiclePayload(form: VehicleForm, editing: boolean) {
  const body: Record<string, unknown> = {};
  for (const key of [
    "make",
    "model",
    "plateNumber",
    "sector",
    "category",
  ] as const) {
    const value = form[key].trim();
    if (!value) throw Error(`${key} is required.`);
    body[key] = value;
  }
  if (
    !["passenger", "logistics", "service", "premium", "rental"].includes(
      form.sector,
    )
  )
    throw Error("Invalid sector.");
  for (const key of ["color", "fuelType", "permitDetails"] as const)
    body[key] = form[key].trim() || null;
  for (const key of [
    "fuelRatePerKm",
    "loadCapacityKg",
    "manufacturingYear",
    "seatingCapacity",
  ] as const) {
    const text = form[key].trim();
    if (!text) {
      if (editing)
        body[key] = ["fuelRatePerKm", "loadCapacityKg"].includes(key)
          ? undefined
          : null;
      continue;
    }
    const value = Number(text);
    if (!Number.isFinite(value) || value < 0)
      throw Error(`${key} must be a non-negative number.`);
    if (
      key === "manufacturingYear" &&
      (!Number.isInteger(value) || value < 1900 || value > 2100)
    )
      throw Error("Manufacturing year must be1900–2100.");
    if (
      key === "seatingCapacity" &&
      (!Number.isInteger(value) || value < 1 || value > 100)
    )
      throw Error("Seating capacity must be1–100.");
    body[key] = value;
  }
  for (const key of ["registrationDate", "registrationExpiry"] as const) {
    if (form[key] && !/^\d{4}-\d{2}-\d{2}$/.test(form[key]))
      throw Error("Invalid registration date.");
    body[key] = form[key] || null;
  }
  if (
    form.registrationDate &&
    form.registrationExpiry &&
    form.registrationExpiry < form.registrationDate
  )
    throw Error("Registration expiry must be on or after registration date.");
  if (!editing)
    for (const key of ["driverProfileId", "ownerId"] as const) {
      const value = form[key].trim();
      if (value && !/^[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value))
        throw Error(`${key} must be a valid UUID.`);
      body[key] = value || null;
    }
  body.isCommercial = form.isCommercial;
  return body;
}
