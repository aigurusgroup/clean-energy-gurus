// Lightweight on-demand loader for the Google Maps JS API.
// Uses the Lovable Google Maps Platform connector browser key.

/* eslint-disable @typescript-eslint/no-explicit-any */
let loadingPromise: Promise<any> | null = null;

// Browser key injected by the Lovable Google Maps Platform connector.
// Referrer-restricted in Google Cloud Console — safe to expose in client code.
export const GOOGLE_MAPS_API_KEY: string =
  (import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined) ??
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ??
  "AIzaSyDTkgk0PQlPwi-Mx51axe4soT6tlU72eFM";

const TRACKING_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as
  | string
  | undefined;

export const loadGoogleMaps = (): Promise<any> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }
  const w = window as any;
  if (w.google?.maps) return Promise.resolve(w.google);
  if (loadingPromise) return loadingPromise;
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error("Missing Google Maps API key"));
  }

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      libraries: "drawing,geometry",
      v: "weekly",
    });
    if (TRACKING_ID) params.set("channel", TRACKING_ID);
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.onload = async () => {
      const g = (window as any).google;
      if (!g?.maps) { reject(new Error("Google Maps failed to initialise")); return; }
      try {
        if (typeof g.maps.importLibrary === "function") {
          await Promise.all([
            g.maps.importLibrary("maps"),
            g.maps.importLibrary("drawing"),
            g.maps.importLibrary("geometry"),
          ]);
        }
        resolve(g);
      } catch (err) {
        reject(err as Error);
      }
    };
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });

  return loadingPromise;
};
