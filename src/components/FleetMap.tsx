"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/admin-api";
import {
  locatedFleet,
  decodeRoute,
  type FleetMapVehicle,
} from "@/lib/fleet-map";
import { loadMapsSdk, type MapOverlay, type MapView } from "@/lib/maps-sdk";
export function FleetMap({
  vehicles,
  role,
  busy,
  error,
  fullPage = false,
}: {
  vehicles: FleetMapVehicle[];
  role: "admin" | "super-admin";
  busy: boolean;
  error: string;
  fullPage?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null),
    map = useRef<MapView | null>(null),
    route = useRef<MapOverlay | null>(null);
  const [revision, setRevision] = useState(0),
    [sdkError, setSdkError] = useState(""),
    [ready, setReady] = useState(false),
    [routeMessage, setRouteMessage] = useState("");
  const key = process.env.NEXT_PUBLIC_MAPS_API_KEY || "";
  useEffect(() => {
    if (!key) return;
    let current = true;
    const authorizationFailed = () => {
      if (current) {
        setReady(false);
        setSdkError(
          "Browser Maps authorization failed. Check API and website restrictions.",
        );
      }
    };
    window.addEventListener("infurnus-maps-auth-failure", authorizationFailed);
    void loadMapsSdk(key).then(
      (sdk) => {
        if (!current || !host.current) return;
        map.current = new sdk.Map(host.current, {
          center: { lat: 25.5941, lng: 85.1376 },
          zoom: 10,
          maxZoom: 16,
          streetViewControl: false,
          mapTypeControl: false,
        });
        setReady(true);
        setSdkError("");
      },
      () => {
        if (current)
          setSdkError(
            "Map SDK could not initialize. Check the browser key, website restrictions and network.",
          );
      },
    );
    return () => {
      current = false;
      window.removeEventListener(
        "infurnus-maps-auth-failure",
        authorizationFailed,
      );
      route.current?.setMap(null);
      map.current = null;
    };
  }, [key, revision]);
  useEffect(() => {
    const view = map.current,
      sdk = window.google?.maps;
    if (!ready || !view || !sdk) return;
    let current = true;
    const overlays: MapOverlay[] = [],
      windows: { close(): void }[] = [];
    const locations = locatedFleet(vehicles),
      bounds = new sdk.LatLngBounds();
    for (const vehicle of locations) {
      const position = { lat: vehicle.latitude!, lng: vehicle.longitude! };
      bounds.extend(position);
      const marker = new sdk.Marker({
        map: view,
        position,
        title: vehicle.plateNumber,
      });
      overlays.push(marker);
      const content = document.createElement("div"),
        title = document.createElement("strong"),
        status = document.createElement("p"),
        details = document.createElement("a");
      title.textContent = vehicle.plateNumber;
      status.textContent = `${vehicle.driverName || "Driver not assigned"} · ${vehicle.status}`;
      details.textContent = "Open fleet record";
      details.href = `/${role}/fleets/${vehicle.id}`;
      content.className = "fleet-map-popup";
      content.append(title, status, details);
      if (vehicle.currentRideId) {
        const button = document.createElement("button");
        button.textContent = "Show current ride route";
        content.append(button);
        button.onclick = async () => {
          if (button.disabled) return;
          button.disabled = true;
          setRouteMessage("Loading recorded ride route…");
          try {
            const page = await adminApi<{
                items: {
                  pickup_address?: string;
                  destination_address?: string;
                }[];
              }>(
                `/admin/operations/rides?recordId=${encodeURIComponent(vehicle.currentRideId!)}&pageSize=1`,
              ),
              ride = page.items[0];
            if (!ride?.pickup_address || !ride.destination_address)
              throw Error("Recorded ride addresses are unavailable.");
            const origin = await adminApi<{
                latitude: number;
                longitude: number;
              }>("/maps/geocode", "POST", { address: ride.pickup_address }),
              destination = await adminApi<{
                latitude: number;
                longitude: number;
              }>("/maps/geocode", "POST", {
                address: ride.destination_address,
              });
            const result = await adminApi<{
              encodedPolyline?: string;
              distanceMeters: number;
              durationSeconds: number;
            }>("/maps/route", "POST", {
              origin,
              destination,
              mode: "driving",
              avoidTolls: false,
            });
            if (!result.encodedPolyline)
              throw Error("Backend route geometry is unavailable.");
            if (!current) return;
            const points = decodeRoute(result.encodedPolyline);
            route.current?.setMap(null);
            route.current = new sdk.Polyline({
              map: view,
              path: points,
              strokeColor: "#FF7A0A",
              strokeWeight: 4,
            });
            const fit = new sdk.LatLngBounds();
            for (const point of points) fit.extend(point);
            view.fitBounds(fit);
            setRouteMessage(
              `${(result.distanceMeters / 1000).toFixed(1)} km · ${Math.ceil(result.durationSeconds / 60)} min (backend road route)`,
            );
          } catch (e) {
            if (current)
              setRouteMessage(
                e instanceof Error ? e.message : "Route unavailable.",
              );
          } finally {
            if (current) button.disabled = false;
          }
        };
      }
      const popup = new sdk.InfoWindow({ content });
      windows.push(popup);
      marker.addListener("click", () =>
        popup.open({ map: view, anchor: marker }),
      );
    }
    if (locations.length) view.fitBounds(bounds);
    return () => {
      current = false;
      for (const overlay of overlays) overlay.setMap(null);
      for (const popup of windows) popup.close();
      route.current?.setMap(null);
    };
  }, [vehicles, role, ready, revision]);
  return (
    <div className="dashboard-map-container">
      {!fullPage && <Link className="action-link" href={`/${role}/map`}>
        Open full-page map
      </Link>}
      <div
        ref={host}
        className="dashboard-map-surface"
        role="region"
        aria-label="Actual fleet locations on Google Maps"
      />
      {(!key || sdkError || !ready) && (
        <div className="dashboard-map-message">
          <p role={sdkError ? "alert" : "status"}>
            {!key
              ? "Browser Maps SDK is not configured."
              : sdkError || "Loading map…"}
          </p>
          {sdkError && (
            <button
              type="button"
              onClick={() => {
                setReady(false);
                setRouteMessage("");
                setSdkError("");
                setRevision((value) => value + 1);
              }}
            >
              Retry map
            </button>
          )}
          <Link href={`/${role}/fleets`}>Open fleet location records</Link>
        </div>
      )}
      {ready && (
        <p className="workspace-note" role={error ? "alert" : "status"}>
          {error ||
            (busy
              ? "Loading fleet locations…"
              : locatedFleet(vehicles).length
                ? `${locatedFleet(vehicles).length} vehicles with fresh reported coordinates. Older or unverified positions are not shown.`
                : "No fleet records with reported coordinates. No simulated locations are shown.")}
        </p>
      )}
      {ready && routeMessage && (
        <p className="workspace-note" role="status">
          {routeMessage}
        </p>
      )}
    </div>
  );
}
