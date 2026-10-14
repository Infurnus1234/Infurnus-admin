type Position = { lat: number; lng: number };
export interface MapView {
  fitBounds(bounds: MapBounds): void;
}
interface MapBounds {
  extend(position: Position): void;
}
export interface MapOverlay {
  setMap(map: MapView | null): void;
}
interface MapMarker extends MapOverlay {
  addListener(event: string, callback: () => void): { remove(): void };
}
export interface MapsSdk {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => MapView;
  Marker: new (options: Record<string, unknown>) => MapMarker;
  LatLngBounds: new () => MapBounds;
  InfoWindow: new (options: { content: HTMLElement }) => {
    open(options: { map: MapView; anchor: MapMarker }): void;
    close(): void;
  };
  Polyline: new (options: Record<string, unknown>) => MapOverlay;
}
declare global {
  interface Window {
    google?: { maps?: MapsSdk };
    __infurnusMapsReady?: () => void;
    gm_authFailure?: () => void;
  }
}
let loading: Promise<MapsSdk> | undefined;
let authorizationFailed = false;
export function loadMapsSdk(key: string): Promise<MapsSdk> {
  if (authorizationFailed)
    return Promise.reject(
      Error(
        "Browser Maps authorization failed. Reload after correcting configuration.",
      ),
    );
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps);
  if (!key.trim())
    return Promise.reject(Error("Browser Maps SDK is not configured."));
  if (loading) return loading;
  loading = new Promise<MapsSdk>((resolve, reject) => {
    const script = document.createElement("script"),
      previousFailure = window.gm_authFailure;
    const timeout = setTimeout(
      () => fail("Map initialization timed out. Check network access."),
      20000,
    );
    function fail(message: string) {
      clearTimeout(timeout);
      script.remove();
      loading = undefined;
      delete window.__infurnusMapsReady;
      window.gm_authFailure = previousFailure;
      reject(Error(message));
    }
    window.gm_authFailure = () => {
      authorizationFailed = true;
      window.dispatchEvent(new Event("infurnus-maps-auth-failure"));
      fail(
        "Browser Maps authorization failed. Check API and website restrictions.",
      );
    };
    window.__infurnusMapsReady = () => {
      clearTimeout(timeout);
      delete window.__infurnusMapsReady;
      const maps = window.google?.maps;
      if (!maps?.Map) {
        fail("Map SDK did not initialize.");
        return;
      }
      resolve(maps);
    };
    script.async = true;
    script.onerror = () =>
      fail("Map SDK could not load. Check network access.");
    const url = new URL("https://maps.googleapis.com/maps/api/js");
    url.searchParams.set("key", key);
    url.searchParams.set("callback", "__infurnusMapsReady");
    url.searchParams.set("loading", "async");
    script.src = url.href;
    document.head.append(script);
  });
  return loading;
}
