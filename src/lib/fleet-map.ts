export interface FleetMapVehicle {
  id: string;
  plateNumber: string;
  driverName?: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  lastLocationAt?: string | null;
  currentRideId?: string | null;
  locationFresh?: boolean;
}
export function locatedFleet(rows: FleetMapVehicle[]) {
  return rows.filter(
    (row) =>
      typeof row.latitude === "number" &&
      row.locationFresh === true &&
      Number.isFinite(row.latitude) &&
      Math.abs(row.latitude) <= 90 &&
      typeof row.longitude === "number" &&
      Number.isFinite(row.longitude) &&
      Math.abs(row.longitude) <= 180,
  );
}
/** Render the backend's encoded route, never a fabricated route or fare. */
export function decodeRoute(encoded: string) {
  const points: { lat: number; lng: number }[] = [];
  let offset = 0,
    lat = 0,
    lng = 0;
  function delta() {
    let value = 0,
      shift = 0,
      byte;
    do {
      if (offset >= encoded.length || shift > 30)
        throw Error("Invalid route geometry");
      byte = encoded.charCodeAt(offset++) - 63;
      if (byte < 0 || byte > 63) throw Error("Invalid route geometry");
      value |= (byte & 31) << shift;
      shift += 5;
    } while (byte >= 32);
    return value & 1 ? ~(value >> 1) : value >> 1;
  }
  while (offset < encoded.length) {
    lat += delta();
    lng += delta();
    if (Math.abs(lat / 1e5) > 90 || Math.abs(lng / 1e5) > 180)
      throw Error("Invalid route geometry");
    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}
